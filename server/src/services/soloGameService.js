/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   soloGameService.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/11 17:39:02 by npatron           #+#    #+#             */
/*   Updated: 2025/12/11 18:33:54 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import pino from "pino";
import { SoloGame } from "../classes/soloGame.js";
import { Player } from "../classes/player.js";
import socketService from "./socket/socketService.js";
import { GameDao } from "../dao/gameDao.js";

const logger = pino({ level: "info" });

export class SoloGameService {
	constructor() {
		this.activeGames = new Map();
		this.setupSocketHandler();
		this.gameDao = new GameDao();
	}

	setupSocketHandler() {
		socketService.setMoveHandler((username, direction) => {
			this.handleMovePiece(username, direction);
		});
	}

	async createSoloGame(username) {
		const socketId = socketService.getUserSocketId(username);

		if (!socketId) {
			throw new Error("User socket not found");
		}

		const player = new Player(username, socketId);
		const soloGame = new SoloGame(player);

		this.activeGames.set(soloGame.id, soloGame);
		this.gameDao.create(soloGame);
		soloGame.startGame();

		logger.info(`Solo game created for ${username}: ${soloGame.id}`);

		return {
			gameId: soloGame.id,
			username,
			status: "IN_PROGRESS"
		};
	}

	async getSoloGame(gameId) {
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
	}

	async endSoloGame(gameId, score) {
		const game = this.activeGames.get(gameId);

		if (!game) {
			throw new Error("Game not found");
		}

		game.endGame();
		this.activeGames.delete(gameId);

		logger.info(`Solo game ended: ${gameId}, score: ${score}`);
	}

	handleMovePiece(username, direction) {
		const activeGame = this.getActiveGameByUsername(username);

		if (!activeGame) {
			logger.warn(`Game not found for user: ${username}`);
			return;
		}

		activeGame.game.movePiece(username, direction, socketService);
	}

	getActiveGame(gameId) {
		return this.activeGames.get(gameId);
	}

	getActiveGameByUsername(username) {
		for (const [gameId, game] of this.activeGames.entries()) {
			if (game.player.getUsername() === username && game.gameStarted) {
				return { gameId, game };
			}
		}
		return null;
	}
}
