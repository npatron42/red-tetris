/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   room.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:11:28 by npatron           #+#    #+#             */
/*   Updated: 2026/02/02 15:47:47 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Player } from "./player.js";
import { MultiPlayerGame } from "./multiPlayerGame.js";

export class Room {
    constructor(roomName, leaderUsername, leaderId, leaderSocketId) {
        this.roomName = roomName;
        this.leaderUsername = leaderUsername;
        this.leaderId = leaderId;
        this.players = [new Player(leaderUsername, leaderId, leaderSocketId)];
        this.game = new MultiPlayerGame(this);
    }

    addPlayer(name, id, socketId) {
        if (this.game.isStarted) return { success: false, error: "Game in progress" };

        const newPlayer = new Player(name, id, socketId);
        this.players.push(newPlayer);
        return { success: true, player: newPlayer };
    }

    removePlayer(id) {
        this.players = this.players.filter(player => player.id !== id);
    }

    getPlayers() {
        return this.players;
    }

    getLeaderUsername() {
        return this.leaderUsername;
    }

    getRoomName() {
        return this.roomName;
    }

    getGame() {
        return this.game;
    }
}
