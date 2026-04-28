import { Room } from "../classes/room.js";
import { Player } from "../classes/player.js";
import socketService from "./socket/socketService.js";
import matchHistoryService from "./matchHistoryService.js";
import { RoomDao } from "../dao/roomDao.js";
import { UserDao } from "../dao/userDao.js";
import pino from "pino";

const logger = pino({ level: "info" });

export class MultiGameService {
    constructor(matchHistoryServiceInstance) {
        this.activeGames = new Map();
        this.roomDao = new RoomDao();
        this.userDao = new UserDao();
        this.matchHistoryService = matchHistoryServiceInstance || matchHistoryService;
        this.setupSocketHandler();
    }

    setupSocketHandler() {
        try {
            socketService.setMultiMoveHandler((roomId, userId, direction) => {
                this.handleMovePiece(roomId, userId, direction).catch(error => {
                    logger.error(`Error in move handler: ${error.message}`);
                });
            });

            socketService.addDisconnectHandler(async userId => {
                try {
                    await this.handlePlayerDisconnect(userId);
                } catch (error) {
                    logger.error(`Error in disconnect handler: ${error.message}`);
                }
            });
        } catch (error) {
            logger.error(`Error in setupSocketHandler: ${error.message}`);
        }
    }

    async handlePlayerDisconnect(userId) {
        for (const [roomId, roomInstance] of this.activeGames.entries()) {
            const players = roomInstance.getPlayers();
            const player = players.find(player => player.id === userId);

            if (player) {
                logger.info(`Cleaning up game in room ${roomId} for disconnected player ${userId}`);

                const game = roomInstance.getGame();
                game.stopGameLoop();
                game.endGame();

                const playerIds = players.map(player => player.id).filter(Boolean);

                socketService.emitToUsers(playerIds, "multiGameEnded", {
                    roomId,
                    players: players.map(player => ({
                        id: player.id,
                        name: player.getUsername(),
                        score: player.currentScore,
                    })),
                });

                this.activeGames.delete(roomId);
                await this.roomDao.updateByName(roomId, { status: "COMPLETED" });
            }
        }
    }

    async createMultiGame(roomId, leaderId, playerIds) {
        try {
            if (this.activeGames.has(roomId)) {
                throw new Error("Game already exists for this room");
            }

            const roomData = await this.roomDao.findById(roomId);
            if (!roomData) {
                throw new Error("Room not found");
            }

            const leaderSocketId = socketService.getUserSocketId(leaderId);
            if (!leaderSocketId) {
                throw new Error("Leader socket not found");
            }

            const leaderUser = await this.userDao.findById(leaderId);
            if (!leaderUser) {
                throw new Error("Leader user not found");
            }

            const roomInstance = new Room(roomId, leaderUser.name, leaderUser.id, leaderSocketId);

            const playerPromises = playerIds.map(async userId => {
                const socketId = socketService.getUserSocketId(userId);
                const user = await this.userDao.findById(userId);
                if (!user) {
                    throw new Error(`User not found: ${userId}`);
                }
                return new Player(user.name, user.id, socketId);
            });

            roomInstance.players = await Promise.all(playerPromises);

            this.activeGames.set(roomId, roomInstance);

            const game = roomInstance.getGame();
            game.onGameCompleted = result => {
                this.finalizeCompletedGame(roomId, roomInstance, result).catch(error => {
                    logger.error(`Error finalizing completed game: ${error.message}`);
                });
            };
            game.startGame();
            game.startGameLoop(socketService);

            await this.roomDao.updateByName(roomId, { status: "IN_PROGRESS" });

            logger.info(`Multi game started in room: ${roomId}`);

            return {
                roomId,
                players: roomInstance.players.map(player => ({
                    id: player.id,
                    name: player.getUsername(),
                })),
                status: "IN_PROGRESS",
            };
        } catch (error) {
            logger.error(`Error in createMultiGame: ${error.message}`);
            throw error;
        }
    }

    async getMultiGame(roomId) {
        try {
            const roomInstance = this.activeGames.get(roomId);

            if (!roomInstance) {
                const roomData = await this.roomDao.findByName(roomId);
                if (!roomData) {
                    return null;
                }
                return {
                    roomId,
                    status: roomData.status,
                    players: [],
                };
            }

            const game = roomInstance.getGame();
            const players = roomInstance.getPlayers();

            return {
                roomId,
                players: players.map(p => ({
                    id: p.id,
                    name: p.getUsername(),
                    score: p.currentScore,
                })),
                status: game.getStatus(),
                level: game.level,
            };
        } catch (error) {
            logger.error(`Error in getMultiGame: ${error.message}`);
            throw error;
        }
    }

    async endMultiGame(roomId) {
        try {
            const roomInstance = this.activeGames.get(roomId);

            if (!roomInstance) {
                throw new Error("Game not found");
            }

            const game = roomInstance.getGame();
            game.stopGameLoop();
            game.endGame();

            const players = roomInstance.getPlayers();
            const playerIds = players.map(p => p.id).filter(Boolean);

            this.activeGames.delete(roomId);
            await this.roomDao.updateByName(roomId, { status: "COMPLETED" });

            logger.info(`Multi game ended in room: ${roomId}`);

            socketService.emitToUsers(playerIds, "multiGameEnded", {
                roomId,
                players: players.map(player => ({
                    id: player.id,
                    name: player.getUsername(),
                    score: player.currentScore,
                })),
            });
        } catch (error) {
            logger.error(`Error in endMultiGame: ${error.message}`);
            throw error;
        }
    }

    buildRoomPayload(room) {
        if (!room) {
            return null;
        }

        const players = [];
        const playerIds = [];
        const playerNames = [];

        if (room.leader) {
            players.push({ id: room.leader.id, name: room.leader.name });
            playerIds.push(room.leader.id);
            playerNames.push(room.leader.name);
        }
        if (room.opponent) {
            players.push({ id: room.opponent.id, name: room.opponent.name });
            playerIds.push(room.opponent.id);
            playerNames.push(room.opponent.name);
        }

        return {
            ...room,
            leaderId: room.leader_id,
            opponentId: room.opponent_id,
            leaderUsername: room.leader?.name || null,
            opponentUsername: room.opponent?.name || null,
            players,
            playerIds,
            playerNames,
        };
    }

    async finalizeCompletedGame(roomId, roomInstance, result) {
        const players = roomInstance.getPlayers();
        const playerIds = players.map(player => player.id).filter(Boolean);
        const game = roomInstance.getGame();

        this.activeGames.delete(roomId);
        await this.roomDao.updateById(roomId, { status: "COMPLETED" });

        await this.persistMatchResult(game, players, playerIds, result);

        const updatedRoom = await this.roomDao.findById(roomId);
        const roomPayload = this.buildRoomPayload(updatedRoom) || {
            id: roomId,
            status: "COMPLETED",
            players: players.map(player => ({
                id: player.id,
                name: player.getUsername(),
            })),
            playerIds,
            playerNames: players.map(player => player.getUsername()),
        };

        socketService.emitToUsers(playerIds, "roomUpdated", {
            ...roomPayload,
            winnerId: result.winnerId,
            loserId: result.loserId,
        });

        logger.info(`Multi game completed in room ${roomId}, winner: ${result.winnerId}`);
    }

    async persistMatchResult(game, players, playerIds, result) {
        if (!result?.winnerId || playerIds.length < 2) {
            return;
        }
        const durationMs = game.gameStartTime ? Date.now() - game.gameStartTime : null;
        const playerStats = players
            .filter(player => player.id)
            .map(player => ({
                playerId: player.id,
                score: player.currentScore || 0,
                level: game.level || 1,
                linesCleared: player.totalLinesCleared || 0,
                durationMs,
            }));

        try {
            await this.matchHistoryService.createMatchHistory(playerIds, result.winnerId, game.rngSeed, playerStats);
            console.log("Match history persisted HIHIHIHIHIIHIHIH");
        } catch (error) {
            logger.error(`Failed to persist match result: ${error.message}`);
        }
    }

    async handleMovePiece(roomId, userId, direction) {
        try {
            const roomInstance = this.getActiveGame(roomId);

            if (!roomInstance) {
                logger.warn(`Game not found for room: ${roomId}`);
                return;
            }

            const game = roomInstance.getGame();
            const result = game.movePiece(userId, direction, socketService);

            if (result?.completed && !game.completionNotified) {
                await this.finalizeCompletedGame(roomId, roomInstance, result);
            }
        } catch (error) {
            logger.error(`Error in handleMovePiece: ${error.message}`);
        }
    }

    getActiveGame(roomId) {
        try {
            return this.activeGames.get(roomId);
        } catch (error) {
            logger.error(`Error in getActiveGame: ${error.message}`);
            return null;
        }
    }
}

export default new MultiGameService();
