/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   room.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:11:28 by npatron           #+#    #+#             */
/*   Updated: 2025/12/29 13:50:15 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Player } from "./player.js";
import { MultiPlayerGame } from "./multiPlayerGame.js";

export class Room {
	constructor(roomName, leaderUsername, leaderSocketId) {
		this.roomName = roomName;
		this.leaderUsername = leaderUsername;
		this.players = [new Player(leaderUsername, leaderSocketId)];

		this.game = new MultiPlayerGame(this);
	}

	addPlayer(username, socketId) {
		if (this.game.isStarted) return { success: false, error: "Game in progress" };

		const newPlayer = new Player(username, socketId);
		this.players.push(newPlayer);
		return { success: true, player: newPlayer };
	}

	removePlayer(socketId) {
		this.players = this.players.filter((player) => player.socketId !== socketId);
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
