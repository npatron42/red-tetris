/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   multiGameService.js                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/29 14:00:00 by npatron           #+#    #+#             */
/*   Updated: 2026/01/31 11:36:08 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Room } from "../classes/room.js";
import { Player } from "../classes/player.js";
import socketService from "./socket/socketService.js";
import { UserDao } from "../dao/userDao.js";
import pino from "pino";

const logger = pino({ level: "info" });

export class MultiGameService {
	constructor() {
		this.activeGameInstances = new Map();
		this.userIdToUsernameMap = new Map();
		this.userDao = new UserDao();
		this.setupSocketHandler();
	}

	setupSocketHandler() {
		try {
			socketService.setMultiMoveHandler((roomName, userId, direction) => {
				try {
					this.handleMovePiece(roomName, userId, direction);
				} catch (error) {
					logger.error(`Error in move handler: ${error.message}`);
				}
			});

			socketService.addDisconnectHandler(async (userId) => {
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
		const username = this.userIdToUsernameMap.get(userId);
		if (!username) {
			logger.warn(`No username found for userId: ${userId}`);
			return;
		}

		for (const [roomName, roomInstance] of this.activeGameInstances.entries()) {
			const players = roomInstance.getPlayers();
			const player = players.find((p) => p.getUsername() === username);

			if (player) {
				logger.info(`Cleaning up game in room ${roomName} for disconnected player ${username}`);
				
				const game = roomInstance.getGame();
				game.stopGameLoop();
				game.endGame();
				
				const playerIds = players.map((p) => {
					return Array.from(this.userIdToUsernameMap.entries())
						.find(([, name]) => name === p.getUsername())?.[0];
				}).filter(Boolean);
				
				socketService.emitToUsers(playerIds, "multiGameEnded", {
					roomName,
					players: players.map((p) => ({
						name: p.getUsername(),
						score: p.currentScore
					}))
				});

				this.activeGameInstances.delete(roomName);
				
				playerIds.forEach((id) => {
					this.userIdToUsernameMap.delete(id);
				});
			}
		}
	}

	async createMultiGame(roomName, leaderId, playerIds) {
		try {
			if (this.activeGameInstances.has(roomName)) {
				throw new Error("Game already exists for this room");
			}

			const leaderSocketId = socketService.getUserSocketId(leaderId);
			if (!leaderSocketId) {
				throw new Error("Leader socket not found");
			}
			
			const leaderUser = await this.userDao.findById(leaderId);
			if (!leaderUser) {
				throw new Error("Leader user not found");
			}

			const roomInstance = new Room(roomName, leaderUser.name, leaderSocketId);
			
			const playerPromises = playerIds.map(async (userId) => {
				const socketId = socketService.getUserSocketId(userId);
				const user = await this.userDao.findById(userId);
				if (!user) {
					throw new Error(`User not found: ${userId}`);
				}
				this.userIdToUsernameMap.set(userId, user.name);
				return new Player(user.name, socketId);
			});
			
			roomInstance.players = await Promise.all(playerPromises);

			this.activeGameInstances.set(roomName, roomInstance);

			const game = roomInstance.getGame();
			game.startGame();
			game.startGameLoop(socketService);

			logger.info(`Multi game started in room: ${roomName}`);

			return {
				roomName,
				players: roomInstance.players.map(p => p.getUsername()),
				status: "IN_PROGRESS"
			};
		} catch (error) {
			logger.error(`Error in createMultiGame: ${error.message}`);
			throw error;
		}
	}

	getMultiGame(roomName) {
		try {
			const roomInstance = this.activeGameInstances.get(roomName);

			if (!roomInstance) {
				return null;
			}

			const game = roomInstance.getGame();
			const players = roomInstance.getPlayers();

			return {
				roomName,
				players: players.map((p) => ({
					name: p.getUsername(),
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
			const roomInstance = this.activeGameInstances.get(roomName);

			if (!roomInstance) {
				throw new Error("Game not found");
			}

			const game = roomInstance.getGame();
			game.stopGameLoop();
			game.endGame();

			const players = roomInstance.getPlayers();
			
			const playerIds = players.map((p) => {
				return Array.from(this.userIdToUsernameMap.entries())
					.find(([, name]) => name === p.getUsername())?.[0];
			}).filter(Boolean);

			this.activeGameInstances.delete(roomName);
			
			playerIds.forEach((id) => {
				this.userIdToUsernameMap.delete(id);
			});

			logger.info(`Multi game ended in room: ${roomName}`);

			socketService.emitToUsers(playerIds, "multiGameEnded", {
				roomName,
				players: players.map((p) => ({
					name: p.getUsername(),
					score: p.currentScore
				}))
			});
		} catch (error) {
			logger.error(`Error in endMultiGame: ${error.message}`);
			throw error;
		}
	}

	handleMovePiece(roomName, userId, direction) {
		try {
			const username = this.userIdToUsernameMap.get(userId);
			if (!username) {
				logger.warn(`No username found for userId: ${userId}`);
				return;
			}

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
			return this.activeGameInstances.get(roomName);
		} catch (error) {
			logger.error(`Error in getActiveGame: ${error.message}`);
			return null;
		}
	}
}

export default new MultiGameService();
