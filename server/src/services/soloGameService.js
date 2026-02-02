/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   soloGameService.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/11 17:39:02 by npatron           #+#    #+#             */
/*   Updated: 2026/02/02 17:47:50 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { SoloGame } from "../classes/soloGame.js";
import { Player } from "../classes/player.js";
import socketService from "./socket/socketService.js";
import { SoloGameDao } from "../dao/soloGameDao.js";
import { UserDao } from "../dao/userDao.js";
import pino from "pino";
import { v4 as uuidv4 } from "uuid";

const logger = pino({ level: "info" });

export class SoloGameService {
    constructor() {
        this.activeGames = new Map();
        this.setupSocketHandler();
        this.soloGameDao = new SoloGameDao();
        this.userDao = new UserDao();
    }

    setupSocketHandler() {
        try {
            socketService.setSoloMoveHandler((gameId, userId, direction) => {
                try {
                    this.handleMovePiece(gameId, userId, direction);
                } catch (error) {
                    logger.error(`Error in move handler: ${error.message}`);
                }
            });

            socketService.addDisconnectHandler(userId => {
                try {
                    this.handlePlayerDisconnect(userId);
                } catch (error) {
                    logger.error(`Error in disconnect handler: ${error.message}`);
                }
            });
        } catch (error) {
            logger.error(`Error in setupSocketHandler: ${error.message}`);
        }
    }

    handlePlayerDisconnect(userId) {
        for (const [gameId, game] of this.activeGames.entries()) {
            if (game.player.getUsername() === userId || game.playerId === userId) {
                logger.info(`Cleaning up game ${gameId} for disconnected player ${userId}`);
                game.stopGameLoop();
                game.endGame();
                this.activeGames.delete(gameId);
            }
        }
    }

    async createSoloGame(userId, difficulty) {
        try {
            const gameId = uuidv4();
            const socketId = socketService.getUserSocketId(userId);

            if (!socketId) {
                throw new Error("User socket not found");
            }

            const user = await this.userDao.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }

            const player = new Player(user.name, user.id, socketId);
            const soloGame = new SoloGame(player, difficulty);
            soloGame.playerId = userId;

            this.activeGames.set(gameId, soloGame);
            await this.soloGameDao.create({
                id: gameId,
                player_id: user.id,
                status: "IN_PROGRESS",
                difficulty,
            });
            soloGame.startGame(difficulty);
            soloGame.startGameLoop(socketService);
            return {
                gameId: gameId,
                userId: user.id,
                name: user.name,
                status: "IN_PROGRESS",
            };
        } catch (error) {
            logger.error(`Error in createSoloGame: ${error.message}`);
            throw error;
        }
    }

    async getSoloGame(gameId) {
        try {
            const game = this.activeGames.get(gameId);

            if (!game) {
                const persistedGame = await this.soloGameDao.findById(gameId);
                if (!persistedGame) {
                    return null;
                }
                return {
                    gameId: persistedGame.id,
                    userId: persistedGame.player_id,
                    status: persistedGame.status,
                    score: null,
                };
            }

            return {
                gameId,
                userId: game.playerId,
                name: game.player.getUsername(),
                status: game.getGameStatus(),
                score: game.player.currentScore,
            };
        } catch (error) {
            logger.error(`Error in getSoloGame: ${error.message}`);
            throw error;
        }
    }

    async endSoloGame(gameId, gameData) {
        try {
            const instanceGame = this.activeGames.get(gameId);
            if (!instanceGame) {
                throw new Error("Game not found");
            }

            const game = await this.soloGameDao.findById(gameId);
            if (!game) {
                throw new Error("Game not found");
            }

            const user = await this.userDao.findById(instanceGame.playerId);
            if (!user) {
                throw new Error("User not found");
            }

            instanceGame.stopGameLoop();
            instanceGame.endGame();
            this.activeGames.delete(gameId);
            if (gameData.score !== undefined && gameData.level !== undefined) {
                let score = gameData.score;
                let level = gameData.level;
                let endedAt = new Date();
                let durationMs = endedAt - game.created_at;
                await this.soloGameDao.update(gameId, {
                    status: "COMPLETED",
                    score: score,
                    level: level,
                    ended_at: endedAt,
                    duration_ms: durationMs,
                });
                if (user.bestScoreSolo < score) {
                    await this.userDao.updateById(user.id, { bestScoreSolo: score });
                }
            } else {
                await this.soloGameDao.update(gameId, { status: "COMPLETED" });
            }

            socketService.emitToUsers([instanceGame.player.id], "soloGameEnded", {
                playerId: instanceGame.playerId,
                gameId,
                score: gameData.score,
            });
        } catch (error) {
            logger.error(`Error in endSoloGame: ${error.message}`);
            throw error;
        }
    }

    handleMovePiece(gameId, userId, direction) {
        try {
            const activeGame = this.getActiveGame(gameId);

            if (!activeGame) {
                logger.warn(`Game not found for userId: ${userId}`);
                return;
            }

            activeGame.movePiece(userId, direction, socketService);
        } catch (error) {
            logger.error(`Error in handleMovePiece: ${error.message}`);
        }
    }

    getActiveGame(gameId) {
        try {
            return this.activeGames.get(gameId);
        } catch (error) {
            logger.error(`Error in getActiveGame: ${error.message}`);
            return null;
        }
    }
}
