/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   player.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/10 15:04:22 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 15:25:48 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Grid } from "./grid.js";

export class Player {
	constructor(name, id, socketId) {
		this.name = name;
		this.id = id;
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
		this.grid = new Grid();
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
		return this.name;
	}

	getSocketId() {
		return this.socketId;
	}
}
