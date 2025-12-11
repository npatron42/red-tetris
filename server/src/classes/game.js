/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:11:25 by npatron           #+#    #+#             */
/*   Updated: 2025/12/10 15:23:21 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { PiecesGenerator } from "./pieceGenerator.js";

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
        
        this.room.getPlayers().forEach(player => {
            player.resetGameData();
            player.incrementNumberOfGamesPlayed();
            player.currentPiece = this.piecesGenerator.getNextPiece();
        });

    }

    endGame() {
        this.gameStarted = false;
        this.status = this.gameStatus.COMPLETED;
        this.stopGameLoop();
        
    }

    startGameLoop() {
        this.gameInterval = setInterval(() => {
        }, this.tickRate);
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
    
    handleLockPiece(player, gridData) {
    }
}