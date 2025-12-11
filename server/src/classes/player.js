/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   player.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/10 15:04:22 by npatron           #+#    #+#             */
/*   Updated: 2025/12/11 19:01:13 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Grid } from "./grid.js";

export class Player {
	constructor(username, socketId) {
		this.username = username;
		this.socketId = socketId;

		this.numberOfGamesPlayed = 0;
		this.numberOfWins = 0;
		this.numberOfLosses = 0;
		this.bestScore = 0;
		this.totalScore = 0;
		this.averageScore = 0;
		this.grid = new Grid();
		this.resetGameData();
	}

	resetGameData() {
		console.log("resetting game data");
		console.log("grid before", this.grid); 
		this.grid = new Grid();
        console.log("grid after", this.grid);
		this.currentScore = 0;
		this.isSpectrum = false;
		this.linesResistant = 0;
		this.currentPiece = null;
	}

	incrementNumberOfGamesPlayed() {
		this.numberOfGamesPlayed++;
	}
	incrementNumberOfWins() {
		this.numberOfWins++;
	}
	incrementNumberOfLosses() {
		this.numberOfLosses++;
	}

	setBestScore(score) {
		if (score > this.bestScore) this.bestScore = score;
	}

	addToTotalScore(score) {
		this.totalScore += score;
	}

	calculateAverageScore() {
		if (this.numberOfGamesPlayed > 0) this.averageScore = this.totalScore / this.numberOfGamesPlayed;
	}

	updateGrid(newGrid) {
		this.grid = newGrid;
	}

	hasLost() {
		this.isSpectrum = true;
		this.incrementNumberOfLosses();
	}

	getGrid() {
		return this.grid;
	}

	getUsername() {
		return this.username;
	}

	getSocketId() {
		return this.socketId;
	}
}
