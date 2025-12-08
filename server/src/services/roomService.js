/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   roomService.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:10:49 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 16:10:51 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


import { v4 as uuidv4 } from "uuid";
import roomRepository from "../repositories/roomRepository.js";

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
			leaderUsername,
			createdAt: new Date(),
			players: [leaderUsername],
			gameOnGoing: false
		};
		const savedRoom = roomRepository.create(room);
		this.activeRooms.set(savedRoom.roomName, savedRoom);
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
		return room;
	}

	removePlayer(roomName, username) {
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
