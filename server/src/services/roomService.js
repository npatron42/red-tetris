/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   roomService.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:10:49 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 16:27:35 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import roomRepository from "../repositories/roomRepository.js";
import pino from "pino";

const logger = pino({
	level: "info"
});

logger.info("RoomService initialized");
export class RoomService {
	constructor() {
		this.activeRooms = new Map();
	}

	createRoom(roomName, leaderUsername) {
		logger.info("Creating room", { roomName, leaderUsername });
		if (!roomName || !leaderUsername) {
			throw new Error("Room name and leader username are required");
		}
		const existingRoom = roomRepository.findByName(roomName);
		if (existingRoom) {
			throw new Error("Room already exists");
		}
        logger.info("Leader username", { leaderUsername: leaderUsername.toLowerCase() });
		const room = {
			name: roomName,
			leaderUsername: leaderUsername.toLowerCase(),
			createdAt: new Date(),
			players: [leaderUsername.toLowerCase()],
			gameOnGoing: false
		};
        logger.info("Room", { room });
		const savedRoom = roomRepository.create(room);
		this.activeRooms.set(savedRoom.roomName, savedRoom);
		logger.info("Room created", { savedRoom });
        console.log("Active rooms", this.activeRooms);
		return savedRoom;
	}

	getRoomByName(roomName) {
		const inMemoryRoom = this.activeRooms.get(roomName);
		if (inMemoryRoom) {
			return inMemoryRoom;
		}
		const persistedRoom = roomRepository.findByName(roomName);
		if (persistedRoom) {
			this.activeRooms.set(roomName, persistedRoom);
			return persistedRoom;
		}
		return null;
	}

	getAllRooms() {
		const persistedRooms = roomRepository.findAll();
		persistedRooms.forEach((room) => {
			if (!this.activeRooms.has(room.name)) {
				this.activeRooms.set(room.name, room);
			}
		});
		return Array.from(this.activeRooms.values());
	}

	addPlayer(roomName, username) {
		logger.info("Adding player to room", { roomName, username });
		const room = this.getRoomByName(roomName);
		if (!room) {
			throw new Error("Room not found");
		}
		if (room.players.includes(username)) {
			return room;
		}
		room.players.push(username);
		this.activeRooms.set(roomName, room);
		roomRepository.update(roomName, { players: room.players });
		logger.info("Player added to room", { roomName, username });
		logger.info("Active rooms", { activeRooms: this.activeRooms });
		return room;
	}

	removePlayer(roomName, username) {
		logger.info("Removing player from room", { roomName, username });
		const room = this.getRoomByName(roomName);
		if (!room) {
			return null;
		}
		room.players = room.players.filter((player) => player !== username);
		if (room.players.length === 0) {
			this.activeRooms.delete(roomName);
			roomRepository.delete(roomName);
			return null;
		}
		this.activeRooms.set(roomName, room);
		roomRepository.update(roomName, { players: room.players });
		logger.info("Player removed from room", { roomName, username });
		logger.info("Active rooms", { activeRooms: this.activeRooms });
		return room;
	}

	startGame(roomName) {
		const room = this.getRoomByName(roomName);
		if (!room) {
			throw new Error("Room not found");
		}
		room.gameOnGoing = true;
		this.activeRooms.set(roomName, room);
		roomRepository.update(roomName, { gameOnGoing: true });
		return room;
	}

	endGame(roomName) {
		const room = this.getRoomByName(roomName);
		if (!room) {
			return null;
		}
		room.gameOnGoing = false;
		this.activeRooms.set(roomName, room);
		roomRepository.update(roomName, { gameOnGoing: false });
		return room;
	}
}

export default new RoomService();
