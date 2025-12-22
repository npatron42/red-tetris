/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   soloGameService.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/11 17:39:02 by npatron           #+#    #+#             */
/*   Updated: 2025/12/22 16:35:31 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { SoloGame } from "../classes/soloGame.js";
import { Player } from "../classes/player.js";
import { GameDao } from "../dao/gameDao.js";
import socketService from "./socket/socketService.js";

import pino from "pino";
import { v4 as uuidv4 } from "uuid";

const logger = pino({ level: "info" });

export class SoloGameService {
	constructor() {
		this.activeGames = new Map();
		this.setupSocketHandler();
		this.gameDao = new GameDao();
	}

	setupSocketHandler() {
		try {
			socketService.setMoveHandler((gameId, username, direction) => {
				try {
					this.handleMovePiece(gameId, username, direction);
				} catch (error) {
					logger.error(`Error in move handler: ${error.message}`);
				}
			});

			socketService.setDisconnectHandler((username) => {
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
		for (const [gameId, game] of this.activeGames.entries()) {
			if (game.player.getUsername() === username) {
				logger.info(`Cleaning up game ${gameId} for disconnected player ${username}`);
				game.stopGameLoop();
				game.endGame();
				this.activeGames.delete(gameId);
			}
		}
	}

	async createSoloGame(username) {
		try {
			const gameId = uuidv4();
			const socketId = socketService.getUserSocketId(username);

			if (!socketId) {
				throw new Error("User socket not found");
			}

			const player = new Player(username, socketId);
			const soloGame = new SoloGame(player);

			this.activeGames.set(gameId, soloGame);
			let game = {
				gameId,
				username,
				status: "IN_PROGRESS"
			};
			await this.gameDao.create(game);
			soloGame.startGame();
			soloGame.startGameLoop(socketService);
			return {
				gameId: gameId,
				username,
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
				return null;
			}

			return {
				gameId,
				username: game.player.getUsername(),
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
			socketService.emitToUsers([game.player.getUsername()], "soloGameEnded", {
				gameId,
				score
			});
		} catch (error) {
			logger.error(`Error in endSoloGame: ${error.message}`);
			throw error;
		}
	}

	handleMovePiece(gameId, username, direction) {
		try {
			const activeGame = this.getActiveGame(gameId);

			if (!activeGame) {
				logger.warn(`Game not found for user: ${username}`);
				return;
			}

			activeGame.movePiece(username, direction, socketService);
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
