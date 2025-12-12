/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   soloGame.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/11 17:39:21 by npatron           #+#    #+#             */
/*   Updated: 2025/12/12 16:44:46 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { PiecesGenerator } from "./piecesGenerator.js";
import crypto from "crypto";

export class SoloGame {
	constructor(player) {
		this.id = crypto.randomUUID();
		this.player = player;

		this.piecesGenerator = new PiecesGenerator();
		this.gameStarted = false;

		this.gameInterval = null;
		this.tickRate = 1000;

		this.gameStatus = {
			PENDING: "PENDING",
			IN_PROGRESS: "IN_PROGRESS",
			COMPLETED: "COMPLETED"
		};
		this.status = this.gameStatus.PENDING;
	}

	startGame() {
		this.gameStarted = true;
		this.status = this.gameStatus.IN_PROGRESS;

		this.player.resetGameData();
		this.player.incrementNumberOfGamesPlayed();
		this.player.currentPiece = this.piecesGenerator.getNextPiece();
	}

	endGame() {
		this.gameStarted = false;
		this.status = this.gameStatus.COMPLETED;
		this.stopGameLoop();
	}

	startGameLoop() {
		this.gameInterval = setInterval(() => {}, this.tickRate);
	}

	stopGameLoop() {
		if (this.gameInterval) {
			clearInterval(this.gameInterval);
			this.gameInterval = null;
		}
	}

	getGameStatus() {
		return this.status;
	}

	handleLockPiece() {
		const grid = this.player.getGrid();
		grid.lockPiece(this.player.currentPiece);
		this.player.currentPiece = this.piecesGenerator.getNextPiece();
		return grid.getGrid();
	}

	movePiece(username, direction, socketService) {
		if (!this.gameStarted) {
			return null;
		}

		if (this.player.getUsername() !== username || !this.player.currentPiece) {
			return null;
		}

		const piece = this.player.currentPiece;
		const grid = this.player.getGrid();
		if (grid.gameIsLost()) {
			this.endGame();
			this.sendUpdatedGridToPlayer(socketService);
			return;
		}
		const oldX = piece.getX();
		const oldY = piece.getY();
		const oldRotation = piece.rotationIndex;
		
		switch (direction) {
			case "LEFT":
				piece.moveLeft();
				if (grid.isValidPosition(piece, piece.getX(), piece.getY())) {
				} else {
					piece.setPosition(oldX, oldY);
				}
				break;
			case "RIGHT":
				piece.moveRight();
				if (grid.isValidPosition(piece, piece.getX(), piece.getY())) {
				} else {
					piece.setPosition(oldX, oldY);
				}
				break;
			case "DOWN":
				piece.moveDown();
				if (grid.isValidPosition(piece, piece.getX(), piece.getY())) {
				} else {
					piece.setPosition(oldX, oldY);
					this.handleLockPiece();
				}
				break;
			case "ROTATE":
				piece.rotate();
				if (!grid.isValidPosition(piece, piece.getX(), piece.getY())) {
					piece.rotationIndex = oldRotation;
				}
				break;
			case "DROP":
				let dropY = oldY;
				while (grid.isValidPosition(piece, piece.getX(), dropY + 1)) {
					dropY++;
				}
				piece.setPosition(piece.getX(), dropY);
				this.handleLockPiece();
				break;
		}
		
		this.sendUpdatedGridToPlayer(socketService);
	}

	sendUpdatedGridToPlayer(socketService) {
		try {
			const gameState = [
				{
					username: this.player.getUsername(),
					grid: this.player.currentPiece
						? this.player.getGrid().getGridWithPiece(this.player.currentPiece)
						: this.player.getGrid().getGrid(),
					score: this.player.currentScore
				}
			];

			socketService.emitToUsers([this.player.getUsername()], "soloGameUpdated", {
				username: this.player.getUsername(),
				gameState
			});
		} catch (error) {
			console.error("Error sending updated grid to player", error);
		}
	}
}
