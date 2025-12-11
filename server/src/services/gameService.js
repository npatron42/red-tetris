/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gameService.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/10 15:29:15 by npatron           #+#    #+#             */
/*   Updated: 2025/12/11 18:49:58 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import pino from "pino";
import socketService from "./socket/socketService.js";

const logger = pino({
	level: "info"
});
logger.info("GameService initialized");

export class GameService {
	constructor() {
		this.game = null;
	}

	startGame(room) {
		if (this.game !== null) {
			return;
		}
		this.game = room.getGame();
		this.game.startGame();
	}

	endGame() {
		if (this.game === null) {
			return;
		}
		this.game.endGame();
		this.game = null;
	}

	movePiece(roomName, username, direction) {
		if (this.game === null) {
			return;
		}
		this.game.movePiece(username, direction, socketService);
	}
}
