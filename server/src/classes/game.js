/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:11:25 by npatron           #+#    #+#             */
/*   Updated: 2025/12/22 17:18:04 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { PiecesGenerator } from "./piecesGenerator.js";

export class Game {
	constructor(room) {
		this.room = room;

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
		if (this.getPlayersCount() < 1) return;

		this.gameStarted = true;
		this.status = this.gameStatus.IN_PROGRESS;
        const players = this.room.getPlayers();
		players.forEach((player) => {
			player.resetGameData();
			player.incrementNumberOfGamesPlayed();
			player.currentPiece = this.piecesGenerator.getNextPiece(players.length);
		});
	}

	endGame() {
		this.gameStarted = false;
		this.status = this.gameStatus.COMPLETED;
		this.stopGameLoop();
	}


	stopGameLoop() {
		if (this.gameInterval) {
			clearInterval(this.gameInterval);
			this.gameInterval = null;
		}
	}

	getPlayersCount() {
		return this.room.getPlayers().length;
	}

	getGameStatus() {
		return this.status;
	}

	handleLockPiece(player) {
		const grid = player.getGrid();
		grid.lockPiece(player.currentPiece);
		player.currentPiece = this.piecesGenerator.getNextPiece();
		return grid.getGrid();
	}

	movePiece(username, direction, socketService) {
        console.log("movePiece", username, direction);
		if (!this.gameStarted) {
			return null;
		}

		const player = this.room.getPlayers().find((p) => p.getUsername() === username);
		if (!player || !player.currentPiece) {
			return null;
		}

		const piece = player.currentPiece;
		const grid = player.getGrid();
        if (grid.gameIsLost()) {
            console.log("game is lost");
            this.endGame();
            this.sendUpdatedGridToPlayers(socketService);
            return null;
        }
        console.log("game is not lost");
		const oldX = piece.getX();
		const oldY = piece.getY();
		const oldRotation = piece.rotationIndex;

		let moved = false;

		switch (direction) {
			case "LEFT":
				piece.moveLeft();
				if (grid.isValidPosition(piece, piece.getX(), piece.getY())) {
					moved = true;
				} else {
					piece.setPosition(oldX, oldY);
				}
				break;
			case "RIGHT":
				piece.moveRight();
				if (grid.isValidPosition(piece, piece.getX(), piece.getY())) {
					moved = true;
				} else {
					piece.setPosition(oldX, oldY);
				}
				break;
			case "DOWN":
				piece.moveDown();
				if (grid.isValidPosition(piece, piece.getX(), piece.getY())) {
					moved = true;
				} else {
					piece.setPosition(oldX, oldY);
					this.handleLockPiece(player);
				}
				break;
			case "ROTATE":
				piece.rotate();
				if (!grid.isValidPosition(piece, piece.getX(), piece.getY())) {
					piece.rotationIndex = oldRotation;
				} else {
					moved = true;
				}
				break;
            case "DROP":
                for (let i = 0; i < 20; i++) {
                    piece.fallDown();
                    if (grid.isValidPosition(piece, piece.getX(), piece.getY())) {
                        moved = true;
                    } else {
                        piece.setPosition(oldX, oldY);
                        this.handleLockPiece(player);
                    }
                }
                break;
		}

		this.sendUpdatedGridToPlayers(socketService);
		return moved;
	}
    
	sendUpdatedGridToPlayers(socketService) {
		const players = this.room.getPlayers();
		const gameState = players.map((player) => ({
			username: player.getUsername(),
			grid: player.currentPiece
				? player.getGrid().getGridWithPiece(player.currentPiece)
				: player.getGrid().getGrid(),
			score: player.currentScore,
            gameStatus: this.getGameStatus(),
            gameIsLost: player.getGrid().gameIsLost()
		}));

		const usernames = players.map((player) => player.getUsername());
		socketService.emitToUsers(usernames, "gridUpdate", {
			roomName: this.room.getRoomName(),
			gameState
		});
	}
}
