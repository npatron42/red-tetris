/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   soloGame.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/11 17:39:21 by npatron           #+#    #+#             */
/*   Updated: 2025/12/29 16:14:25 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { TetrominosBag } from "./tetrominosBag.js";
import { ScoringSystem } from "./scoringSystem.js";
import crypto from "crypto";

export const Difficulty = {
	EASY: "EASY",
	MEDIUM: "MEDIUM",
	HARD: "HARD",
	VERY_HARD: "VERY_HARD",
	IMPOSSIBLE: "IMPOSSIBLE",
	EXTREME: "EXTREME",
	ULTRA: "ULTRA",
	NINJA: "NINJA",
	GOD: "GOD"
};

export const Status = {
	PENDING: "PENDING",
	IN_PROGRESS: "IN_PROGRESS",
	COMPLETED: "COMPLETED"
};

export class SoloGame {
	constructor(player, difficulty) {
		this.id = crypto.randomUUID();
		this.player = player;

		this.tetrominosBag = new TetrominosBag();
		this.scoringSystem = new ScoringSystem();
		this.isStarted = false;
		this.interval = null;
		this.levelInterval = null;
		this.gameStartTime = null;

		this.status = Status.PENDING;
		this.difficulty = difficulty;
		this.level = 1;
	}

	startGame() {
		this.isStarted = true;
		this.status = Status.IN_PROGRESS;
		this.level = 1;
		this.gameStartTime = Date.now();

		this.player.resetGameData();
		this.player.incrementNumberOfGamesPlayed();
		this.player.currentPiece = this.tetrominosBag.getNextPiece();
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
			this.movePiece(this.player.getUsername(), "DOWN", socketService);
		}, this._getDifficultySpeed());
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

	getStatus() {
		return this.status;
	}

	handleLockPiece() {
		const grid = this.player.getGrid();
		grid.lockPiece(this.player.currentPiece);
		const linesCleared = grid.clearLines();
		if (linesCleared > 0) {
			this.player.currentScore = this.scoringSystem.calculateScore(
				this.player.currentScore,
				this.level,
				linesCleared
			);
		}
		this.player.currentPiece = this.tetrominosBag.getNextPiece();
		return grid.getGrid();
	}

	movePiece(username, direction, socketService) {
		if (!this.isStarted) {
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
			const state = [
				{
					username: this.player.getUsername(),
					grid: this.player.currentPiece
						? this.player.getGrid().getGridWithPiece(this.player.currentPiece)
						: this.player.getGrid().getGrid(),
					score: this.player.currentScore,
					level: this.level,
					status: this.getStatus(),
					nextPieces: this.tetrominosBag.peekNextPieces(3)
				}
			];

			socketService.emitToUsers([this.player.getUsername()], "soloGameUpdated", {
				username: this.player.getUsername(),
				state
			});
		} catch (error) {
			console.error("Error sending updated grid to player", error);
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
			this.sendUpdatedGridToPlayer(socketService);
		}, 10000);
	}

	_restartGameLoop(socketService) {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
		this.interval = setInterval(() => {
			if (!this.isStarted) {
				this.stopGameLoop();
				return;
			}
			this.movePiece(this.player.getUsername(), "DOWN", socketService);
		}, this._getDifficultySpeed());
	}

	stopLevelTimer() {
		if (this.levelInterval) {
			clearInterval(this.levelInterval);
			this.levelInterval = null;
		}
	}

	_getDifficultySpeed() {
		let baseSpeed;
		switch (this.difficulty) {
			case Difficulty.EASY:
				baseSpeed = 1000;
				break;
			case Difficulty.MEDIUM:
				baseSpeed = 500;
				break;
			case Difficulty.HARD:
				baseSpeed = 250;
				break;
			case Difficulty.VERY_HARD:
				baseSpeed = 100;
				break;
			case Difficulty.IMPOSSIBLE:
				baseSpeed = 50;
				break;
			case Difficulty.EXTREME:
				baseSpeed = 25;
				break;
			case Difficulty.ULTRA:
				baseSpeed = 10;
				break;
			case Difficulty.NINJA:
				baseSpeed = 5;
				break;
			case Difficulty.GOD:
				baseSpeed = 1;
				break;
			default:
				baseSpeed = 1000;
		}

		const speedReduction = Math.max(0, (this.level - 1) * 0.05);
		const calculatedSpeed = Math.max(1, baseSpeed * (1 - speedReduction));
		return Math.floor(calculatedSpeed);
	}
}
