/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   multiPlayerGame.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:11:25 by npatron           #+#    #+#             */
/*   Updated: 2025/12/29 16:14:33 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { TetrominosBag } from "./tetrominosBag.js";
import { ScoringSystem } from "./scoringSystem.js";

export const Status = {
	PENDING: "PENDING",
	IN_PROGRESS: "IN_PROGRESS",
	COMPLETED: "COMPLETED"
};

export class MultiPlayerGame {
	constructor(room) {
		this.room = room;

		this.tetrominosBag = new TetrominosBag();
		this.scoringSystem = new ScoringSystem();
		this.isStarted = false;
		this.interval = null;
		this.levelInterval = null;
		this.gameStartTime = null;

		this.status = Status.PENDING;
		this.level = 1;
	}

	startGame() {
		if (this.getPlayersCount() < 1) return;

		this.isStarted = true;
		this.status = Status.IN_PROGRESS;
		this.level = 1;
		this.gameStartTime = Date.now();

		const players = this.room.getPlayers();
		players.forEach((player) => {
			player.resetGameData();
			player.incrementNumberOfGamesPlayed();
			player.currentPiece = this.tetrominosBag.getNextPiece();
		});
	}

	startGameLoop(socketService) {
		if (this.interval) {
			return;
		}
		this.startLevelTimer(socketService);
		this.interval = setInterval(() => {
			if (!this.isStarted) {
				this.stopGameLoop();
				return;
			}
			const players = this.room.getPlayers();
			players.forEach((player) => {
				this.movePiece(player.getUsername(), "DOWN", socketService);
			});
		}, 1000);
	}

	stopGameLoop() {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
		this.stopLevelTimer();
	}

	endGame() {
		this.stopGameLoop();
		this.stopLevelTimer();
		this.isStarted = false;
		this.status = Status.COMPLETED;
	}

	getPlayersCount() {
		return this.room.getPlayers().length;
	}

	getStatus() {
		return this.status;
	}

	handleLockPiece(player) {
		const grid = player.getGrid();
		grid.lockPiece(player.currentPiece);
		const linesCleared = grid.clearLines();
		if (linesCleared > 0) {
			player.currentScore = this.scoringSystem.calculateScore(player.currentScore, this.level, linesCleared);
		}
		player.currentPiece = this.tetrominosBag.getNextPiece();
		return grid.getGrid();
	}

	movePiece(username, direction, socketService) {
		if (!this.isStarted) {
			return null;
		}

		const player = this.room.getPlayers().find((p) => p.getUsername() === username);
		if (!player || !player.currentPiece) {
			return null;
		}

		const piece = player.currentPiece;
		const grid = player.getGrid();
		if (grid.gameIsLost()) {
			this.endGame();
			this.sendUpdatedGridToPlayers(socketService);
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
					this.handleLockPiece(player);
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
				this.handleLockPiece(player);
				break;
		}

		this.sendUpdatedGridToPlayers(socketService);
	}

	sendUpdatedGridToPlayers(socketService) {
		try {
			const players = this.room.getPlayers();
			const gameState = players.map((player) => ({
				username: player.getUsername(),
				grid: player.currentPiece
					? player.getGrid().getGridWithPiece(player.currentPiece)
					: player.getGrid().getGrid(),
				score: player.currentScore,
				level: this.level,
				status: this.getStatus(),
				nextPieces: this.tetrominosBag.peekNextPieces(3)
			}));

			const usernames = players.map((player) => player.getUsername());
			socketService.emitToUsers(usernames, "multiGridUpdate", {
				roomName: this.room.getRoomName(),
				gameState
			});
		} catch (error) {
			console.error("Error sending updated grid to players", error);
		}
	}

	startLevelTimer(socketService) {
		if (this.levelInterval) {
			return;
		}
		this.levelInterval = setInterval(() => {
			if (!this.isStarted) {
				this.stopLevelTimer();
				return;
			}
			this.level++;
			this._restartGameLoop(socketService);
			this.sendUpdatedGridToPlayers(socketService);
		}, 10000);
	}

	_restartGameLoop(socketService) {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
		const baseSpeed = 1000;
		const speedReduction = Math.max(0, (this.level - 1) * 0.05);
		const calculatedSpeed = Math.max(100, baseSpeed * (1 - speedReduction));

		this.interval = setInterval(() => {
			if (!this.isStarted) {
				this.stopGameLoop();
				return;
			}
			const players = this.room.getPlayers();
			players.forEach((player) => {
				this.movePiece(player.getUsername(), "DOWN", socketService);
			});
		}, Math.floor(calculatedSpeed));
	}

	stopLevelTimer() {
		if (this.levelInterval) {
			clearInterval(this.levelInterval);
			this.levelInterval = null;
		}
	}
}
