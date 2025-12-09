/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   roomService.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:10:49 by npatron           #+#    #+#             */
/*   Updated: 2025/12/09 16:52:30 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import roomRepository from "../repositories/roomRepository.js";
import socketService from "./socket/socketService.js";
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
		if (!roomName || !leaderUsername) {
			throw new Error("Room name and leader username are required");
		}
		const existingRoom = roomRepository.findByName(roomName);
		if (existingRoom) {
			throw new Error("Room already exists");
		}
		const room = {
			name: roomName,
			leaderUsername: leaderUsername.toLowerCase(),
			createdAt: new Date(),
			players: [leaderUsername.toLowerCase()],
			gameOnGoing: false
		};
		const savedRoom = roomRepository.create(room);
		this.activeRooms.set(savedRoom.roomName, savedRoom);
		return savedRoom;
	}

	joinRoom(roomName, username) {
		const room = this.getRoomByName(roomName);
		if (!room) {
			throw new Error("Room not found");
		}
		const normalizedUsername = username.toLowerCase();
		const updatedRoom = this.addPlayer(roomName, normalizedUsername);
		this.notifyPlayersRoomUpdated(updatedRoom);
		return updatedRoom;
	}

	getRoomByName(roomName) {
		logger.info("Getting room by name", { roomName });
		const inMemoryRoom = this.activeRooms.get(roomName);
		if (inMemoryRoom) {
			const cleanedRoom = {
				...inMemoryRoom,
				players: inMemoryRoom.players.filter((player) => player !== null && player !== undefined)
			};
			return cleanedRoom;
		}
		const persistedRoom = roomRepository.findByName(roomName);
		if (persistedRoom) {
			const cleanedRoom = {
				...persistedRoom,
				players: persistedRoom.players.filter((player) => player !== null && player !== undefined)
			};
			this.activeRooms.set(roomName, cleanedRoom);
			logger.info("Room found in persisted rooms", { persistedRoom });
			return cleanedRoom;
		}
		logger.info("Room not found", { roomName });
		return null;
	}

	getAllRooms() {
		const persistedRooms = roomRepository.findAll();
		persistedRooms.forEach((room) => {
			if (!this.activeRooms.has(room.name)) {
				const cleanedRoom = {
					...room,
					players: room.players.filter((player) => player !== null && player !== undefined)
				};
				this.activeRooms.set(room.name, cleanedRoom);
			}
		});
		return Array.from(this.activeRooms.values()).map((room) => ({
			...room,
			players: room.players.filter((player) => player !== null && player !== undefined)
		}));
	}

	addPlayer(roomName, username) {
		logger.info("Adding player to room", { roomName, username });
		const room = this.getRoomByName(roomName);
		if (!room) {
			throw new Error("Room not found");
		}
		const filteredPlayers = room.players.filter((player) => player !== null && player !== undefined);
		if (filteredPlayers.includes(username)) {
			return room;
		}
		filteredPlayers.push(username);
		room.players = filteredPlayers;
		this.activeRooms.set(roomName, room);
		roomRepository.update(roomName, { players: filteredPlayers });
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

	notifyPlayersRoomUpdated(room) {
		if (!room || !room.players || !socketService.launched) {
			return;
		}
		const payload = {
			roomName: room.name,
			leaderUsername: room.leaderUsername,
			players: room.players.filter((player) => player !== null && player !== undefined)
		};
		socketService.emitToUsers(payload.players, "roomUpdated", payload);
	}
}

export default new RoomService();
