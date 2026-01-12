/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   soloGameService.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/11 17:39:02 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 15:46:26 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { SoloGame } from "../classes/soloGame.js";
import { Player } from "../classes/player.js";
import { GameDao } from "../dao/gameDao.js";
import { UserDao } from "../dao/UserDao.js";
import socketService from "./socket/socketService.js";

import pino from "pino";
import { v4 as uuidv4 } from "uuid";

const logger = pino({ level: "info" });

export class SoloGameService {
	constructor(gameDao = new GameDao(), userDao = new UserDao()) {
		this.activeGames = new Map();
		this.setupSocketHandler();
		this.gameDao = gameDao;
		this.userDao = userDao;
	}

	setupSocketHandler() {
		try {
			socketService.setSoloMoveHandler((gameId, odentifier, direction) => {
				try {
					this.handleMovePiece(gameId, odentifier, direction);
				} catch (error) {
					logger.error(`Error in move handler: ${error.message}`);
				}
			});

			socketService.addDisconnectHandler((identifier) => {
				try {
					this.handlePlayerDisconnect(identifier);
				} catch (error) {
					logger.error(`Error in disconnect handler: ${error.message}`);
				}
			});
		} catch (error) {
			logger.error(`Error in setupSocketHandler: ${error.message}`);
		}
	}

	handlePlayerDisconnect(identifier) {
		for (const [gameId, game] of this.activeGames.entries()) {
			if (game.player.getUsername() === identifier || game.playerId === identifier) {
				logger.info(`Cleaning up game ${gameId} for disconnected player ${identifier}`);
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

			const player = new Player(user.name, socketId);
			const soloGame = new SoloGame(player, difficulty);
			soloGame.playerId = userId;

			this.activeGames.set(gameId, soloGame);
			await this.gameDao.create({
				id: gameId,
				player_id: user.id,
				status: "IN_PROGRESS",
				difficulty
			});
			soloGame.startGame(difficulty);
			soloGame.startGameLoop(socketService);
			return {
				gameId: gameId,
				odentifier: user.id,
				name: user.name,
				status: "IN_PROGRESS"
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
				const persistedGame = await this.gameDao.findById(gameId);
				if (!persistedGame) {
					return null;
				}
				return {
					gameId: persistedGame.id,
					userId: persistedGame.player_id,
					status: persistedGame.status,
					score: null
				};
			}

			return {
				gameId,
				userId: game.playerId,
				name: game.player.getUsername(),
				status: game.getGameStatus(),
				score: game.player.currentScore
			};
		} catch (error) {
			logger.error(`Error in getSoloGame: ${error.message}`);
			throw error;
		}
	}

	async endSoloGame(gameId, score) {
		try {
			const game = this.activeGames.get(gameId);

			if (!game) {
				throw new Error("Game not found");
			}

			game.stopGameLoop();
			game.endGame();
			this.activeGames.delete(gameId);
			await this.gameDao.update(gameId, { status: "COMPLETED" });
			logger.info(`Solo game ended: ${gameId}, score: ${score}`);
			socketService.emitToUsers([game.playerId], "soloGameEnded", {
				gameId,
				score
			});
		} catch (error) {
			logger.error(`Error in endSoloGame: ${error.message}`);
			throw error;
		}
	}

	handleMovePiece(gameId, identifier, direction) {
		try {
			const activeGame = this.getActiveGame(gameId);

			if (!activeGame) {
				logger.warn(`Game not found for identifier: ${identifier}`);
				return;
			}

			activeGame.movePiece(identifier, direction, socketService);
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
