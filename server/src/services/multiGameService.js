/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   multiGameService.js                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/29 14:00:00 by npatron           #+#    #+#             */
/*   Updated: 2025/12/29 14:24:40 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Room } from "../classes/room.js";
import { Player } from "../classes/player.js";
import socketService from "./socket/socketService.js";
import pino from "pino";

const logger = pino({ level: "info" });

export class MultiGameService {
	constructor() {
		this.activeGames = new Map();
		this.setupSocketHandler();
	}

	setupSocketHandler() {
		try {
			socketService.setMultiMoveHandler((roomName, username, direction) => {
				try {
					this.handleMovePiece(roomName, username, direction);
				} catch (error) {
					logger.error(`Error in move handler: ${error.message}`);
				}
			});

			socketService.addDisconnectHandler((username) => {
				try {
					this.handlePlayerDisconnect(username);
				} catch (error) {
					logger.error(`Error in disconnect handler: ${error.message}`);
				}
			});
		} catch (error) {
			logger.error(`Error in setupSocketHandler: ${error.message}`);
		}
	}

	handlePlayerDisconnect(username) {
		for (const [roomName, roomInstance] of this.activeGames.entries()) {
			const game = roomInstance.getGame();
			const players = roomInstance.getPlayers();
			const player = players.find((p) => p.getUsername() === username);

			if (player) {
				logger.info(`Cleaning up game in room ${roomName} for disconnected player ${username}`);
				game.stopGameLoop();
				game.endGame();
				this.activeGames.delete(roomName);
			}
		}
	}

	createMultiGame(roomName, leaderUsername, players) {
		try {
			if (this.activeGames.has(roomName)) {
				throw new Error("Game already exists for this room");
			}

			const leaderSocketId = socketService.getUserSocketId(leaderUsername);
			if (!leaderSocketId) {
				throw new Error("Leader socket not found");
			}

			const roomInstance = new Room(roomName, leaderUsername, leaderSocketId);
			roomInstance.players = players.map((username) => {
				const socketId = socketService.getUserSocketId(username);
				return new Player(username, socketId);
			});

			this.activeGames.set(roomName, roomInstance);

			const game = roomInstance.getGame();
			game.startGame();
			game.startGameLoop(socketService);

			logger.info(`Multi game started in room: ${roomName}`);

			return {
				roomName,
				players: players,
				status: "IN_PROGRESS"
			};
		} catch (error) {
			logger.error(`Error in createMultiGame: ${error.message}`);
			throw error;
		}
	}

	getMultiGame(roomName) {
		try {
			const roomInstance = this.activeGames.get(roomName);

			if (!roomInstance) {
				return null;
			}

			const game = roomInstance.getGame();
			const players = roomInstance.getPlayers();

			return {
				roomName,
				players: players.map((p) => ({
					username: p.getUsername(),
					score: p.currentScore
				})),
				status: game.getStatus(),
				level: game.level
			};
		} catch (error) {
			logger.error(`Error in getMultiGame: ${error.message}`);
			throw error;
		}
	}

	endMultiGame(roomName) {
		try {
			const roomInstance = this.activeGames.get(roomName);

			if (!roomInstance) {
				throw new Error("Game not found");
			}

			const game = roomInstance.getGame();
			game.stopGameLoop();
			game.endGame();

			const players = roomInstance.getPlayers();
			const usernames = players.map((p) => p.getUsername());

			this.activeGames.delete(roomName);

			logger.info(`Multi game ended in room: ${roomName}`);

			socketService.emitToUsers(usernames, "multiGameEnded", {
				roomName,
				players: players.map((p) => ({
					username: p.getUsername(),
					score: p.currentScore
				}))
			});
		} catch (error) {
			logger.error(`Error in endMultiGame: ${error.message}`);
			throw error;
		}
	}

	handleMovePiece(roomName, username, direction) {
		try {
			console.log("handleMovePiece", roomName, username, direction);
			const roomInstance = this.getActiveGame(roomName);

			if (!roomInstance) {
				logger.warn(`Game not found for room: ${roomName}`);
				return;
			}

			const game = roomInstance.getGame();
			game.movePiece(username, direction, socketService);
		} catch (error) {
			logger.error(`Error in handleMovePiece: ${error.message}`);
		}
	}

	getActiveGame(roomName) {
		try {
			return this.activeGames.get(roomName);
		} catch (error) {
			logger.error(`Error in getActiveGame: ${error.message}`);
			return null;
		}
	}
}

export default new MultiGameService();
