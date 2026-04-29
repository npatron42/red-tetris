/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   multiPlayerGame.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:11:25 by npatron           #+#    #+#             */
/*   Updated: 2026/02/02 16:03:36 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { TetrominosBag } from "./tetrominosBag.js";
import { ScoringSystem } from "./scoringSystem.js";
import { Piece } from "./piece.js";

export const Status = {
    PENDING: "PENDING",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
};

export class MultiPlayerGame {
    constructor(room) {
        this.room = room;

        this.tetrominosBag = new TetrominosBag();
        this.pieceSequence = []; // Stores sequence of piece types
        this.scoringSystem = new ScoringSystem();
        this.isStarted = false;
        this.interval = null;
        this.levelInterval = null;
        this.gameStartTime = null;

        this.status = Status.PENDING;
        this.level = 1;
        this.winnerId = null;
        this.loserId = null;
        this.rngSeed = null;
        this.onGameCompleted = null;
        this.completionNotified = false;
    }

    startGame() {
        if (this.getPlayersCount() < 1) return;

        this.isStarted = true;
        this.status = Status.IN_PROGRESS;
        this.level = 1;
        this.gameStartTime = Date.now();
        this.winnerId = null;
        this.loserId = null;
        this.rngSeed = this.gameStartTime;
        this.completionNotified = false;
        this.pieceSequence = []; // Reset sequence cleanly

        const players = this.room.getPlayers();
        players.forEach(player => {
            player.resetGameData();
            player.incrementNumberOfGamesPlayed();
            player.pieceIndex = 0; // Initialize player sequence index
            this._assignNextPieceToPlayer(player);
        });
    }

    _assignNextPieceToPlayer(player) {
        if (player.pieceIndex === undefined) {
             player.pieceIndex = 0;
        }
        while (this.pieceSequence.length <= player.pieceIndex) {
            const newPiece = this.tetrominosBag.getNextPiece();
            this.pieceSequence.push(newPiece.type);
        }
        const type = this.pieceSequence[player.pieceIndex];
        player.pieceIndex++;
        player.currentPiece = new Piece(type);
    }

    _getPreviewPiecesForPlayer(player, count = 3) {
        if (player.pieceIndex === undefined) {
            player.pieceIndex = 0;
        }
        const nextPieces = [];
        while (this.pieceSequence.length < player.pieceIndex + count) {
            const newPiece = this.tetrominosBag.getNextPiece();
            this.pieceSequence.push(newPiece.type);
        }
        for (let i = 0; i < count; i++) {
            nextPieces.push(this.pieceSequence[player.pieceIndex + i]);
        }
        return nextPieces;
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
            players.forEach(player => {
                this.movePiece(player.id, "DOWN", socketService);
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

    endGame(result = {}) {
        this.stopGameLoop();
        this.stopLevelTimer();
        this.isStarted = false;
        this.status = Status.COMPLETED;
        this.winnerId = result.winnerId || this.winnerId;
        this.loserId = result.loserId || this.loserId;
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
            player.totalLinesCleared = (player.totalLinesCleared || 0) + linesCleared;
        }
        this._assignNextPieceToPlayer(player);
        return linesCleared;
    }

    applyPenaltyLinesToOpponents(sourcePlayer, linesCleared) {
        const sourceId = sourcePlayer.id;
        const players = this.room.getPlayers();
        const penaltyLines = Math.max(0, linesCleared - 1);

        if (penaltyLines === 0) {
            return;
        }

        players.forEach(player => {
            if (player.id === sourceId) {
                return;
            }
            player.getGrid().addIndestructibleLines(penaltyLines);
        });
    }

    findLostPlayer() {
        return this.room.getPlayers().find(player => player.getGrid().gameIsLost()) || null;
    }

    completeGameForLoser(loser) {
        const players = this.room.getPlayers();
        const winner = players.find(player => player.id !== loser.id) || null;

        loser.hasLost();
        if (winner) {
            winner.incrementNumberOfWins();
        }

        const result = {
            completed: true,
            winnerId: winner?.id || null,
            loserId: loser.id,
        };

        this.endGame(result);
        this.notifyGameCompleted(result);
        return result;
    }

    notifyGameCompleted(result) {
        if (this.completionNotified || !this.onGameCompleted) {
            return;
        }
        this.completionNotified = true;
        this.onGameCompleted(result);
    }

    movePiece(userId, direction, socketService) {
        if (!this.isStarted) {
            return null;
        }

        const player = this.room.getPlayers().find(player => player.id === userId);
        if (!player || !player.currentPiece) {
            return null;
        }

        const piece = player.currentPiece;
        const grid = player.getGrid();
        const alreadyLostPlayer = this.findLostPlayer();
        if (alreadyLostPlayer) {
            const result = this.completeGameForLoser(alreadyLostPlayer);
            this.sendUpdatedGridToPlayers(socketService);
            return result;
        }

        const oldX = piece.getX();
        const oldY = piece.getY();
        const oldRotation = piece.rotationIndex;
        let linesCleared = 0;

        switch (direction) {
            case "LEFT":
                piece.moveLeft();
                if (grid.isValidPosition(piece, piece.getX(), piece.getY())) {
                    player.touchingBottom = false;
                } else {
                    piece.setPosition(oldX, oldY);
                }
                break;
            case "RIGHT":
                piece.moveRight();
                if (grid.isValidPosition(piece, piece.getX(), piece.getY())) {
                    player.touchingBottom = false;
                } else {
                    piece.setPosition(oldX, oldY);
                }
                break;
            case "DOWN":
                piece.moveDown();
                if (grid.isValidPosition(piece, piece.getX(), piece.getY())) {
                    player.touchingBottom = false;
                } else {
                    piece.setPosition(oldX, oldY);
                    if (!player.touchingBottom) {
                        player.touchingBottom = true;
                    } else {
                        player.touchingBottom = false;
                        linesCleared = this.handleLockPiece(player);
                    }
                }
                break;
            case "ROTATE":
                piece.rotate();
                if (!grid.isValidPosition(piece, piece.getX(), piece.getY())) {
                    if (!grid.applyWallKick(piece)) {
                        piece.rotationIndex = oldRotation;
                        piece.setPosition(oldX, oldY);
                    }
                } else {
                    player.touchingBottom = false;
                }
                break;
            case "DROP":
                let dropY = oldY;
                while (grid.isValidPosition(piece, piece.getX(), dropY + 1)) {
                    dropY++;
                }
                piece.setPosition(piece.getX(), dropY);
                player.touchingBottom = false;
                linesCleared = this.handleLockPiece(player);
                break;
        }

        if (linesCleared >= 1) {
            this.applyPenaltyLinesToOpponents(player, linesCleared);
        }

        const lostPlayer = this.findLostPlayer();
        if (lostPlayer) {
            const result = this.completeGameForLoser(lostPlayer);
            this.sendUpdatedGridToPlayers(socketService);
            return result;
        }

        this.sendUpdatedGridToPlayers(socketService);
        return null;
    }

    sendUpdatedGridToPlayers(socketService) {
        try {
            const players = this.room.getPlayers();
            const gameState = players.map(player => ({
                id: player.id,
                name: player.getUsername(),
                grid: player.currentPiece ? player.getGrid().getGridWithPiece(player.currentPiece) : player.getGrid().getGrid(),
                lockedGrid: player.getGrid().getGrid(),
                score: player.currentScore,
                level: this.level,
                status: this.getStatus(),
                isWinner: this.winnerId === player.id,
                isLoser: this.loserId === player.id,
                nextPieces: this._getPreviewPiecesForPlayer(player, 3),
            }));

            const playerIds = players.map(player => player.id).filter(Boolean);
            const roomId = this.room.id || this.room.getRoomName?.();

            socketService.emitToUsers(playerIds, "multiGridUpdate", {
                roomId,
                winnerId: this.winnerId,
                loserId: this.loserId,
                rngSeed: this.rngSeed,
                gameState,
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
            players.forEach(player => {
                this.movePiece(player.id, "DOWN", socketService);
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
