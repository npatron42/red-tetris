/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   roomService.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:10:49 by npatron           #+#    #+#             */
/*   Updated: 2025/12/11 18:50:09 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import roomDao from "../dao/roomDao.js";
import socketService from "./socket/socketService.js";
import pino from "pino";
import { GameService } from "./gameService.js";
import { Room } from "../classes/room.js";
import { Player } from "../classes/player.js";

const logger = pino({
	level: "info"
});

logger.info("RoomService initialized");
export class RoomService {
	constructor() {
		this.activeRooms = new Map();
		this.gameServices = new Map();
		socketService.setMoveHandler(this.handleMovePiece.bind(this));
	}

	createRoom(roomName, leaderUsername) {
		if (!roomName || !leaderUsername) {
			throw new Error("Room name and leader username are required");
		}
		const existingRoom = roomDao.findByName(roomName);
		if (existingRoom) {
			throw new Error("Room already exists");
		}
		const room = {
			name: roomName,
			leaderUsername: leaderUsername.toLowerCase(),
			createdAt: new Date(),
			players: [leaderUsername.toLowerCase()],
			gameStatus: "PENDING",
			gameOnGoing: false
		};
		const savedRoom = roomDao.create(room);
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
		const persistedRoom = roomDao.findByName(roomName);
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
		const persistedRooms = roomDao.findAll();
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
		roomDao.update(roomName, { players: filteredPlayers });
		return room;
	}

	removePlayer(roomName, username) {
		const room = this.getRoomByName(roomName);
		if (!room) {
			return null;
		}
		const normalizedUsername = username.toLowerCase();
		const filteredPlayers = room.players
			.filter((player) => player !== null && player !== undefined)
			.filter((player) => player.toLowerCase() !== normalizedUsername);

		if (filteredPlayers.length === room.players.length) {
			return room;
		}

		if (filteredPlayers.length === 0) {
			this.activeRooms.delete(roomName);
			roomDao.delete(roomName);
			return null;
		}

		const newLeaderUsername =
			room.leaderUsername && room.leaderUsername.toLowerCase() === normalizedUsername
				? filteredPlayers[0]
				: room.leaderUsername;

		const updatedRoom = {
			...room,
			leaderUsername: newLeaderUsername,
			players: filteredPlayers
		};

		this.activeRooms.set(roomName, updatedRoom);
		roomDao.update(roomName, { players: filteredPlayers, leaderUsername: newLeaderUsername });
		this.notifyPlayersRoomUpdated(updatedRoom);
		return updatedRoom;
	}

	startGame(roomName) {
		try {
			const roomData = this.getRoomByName(roomName);
			if (!roomData) {
				throw new Error("Room not found");
			}
			roomData.gameOnGoing = true;
			roomData.gameStatus = "PLAYING";
			this.activeRooms.set(roomName, roomData);
			roomDao.update(roomName, { gameOnGoing: true, gameStatus: "PLAYING" });

			const roomInstance = new Room(roomData.name, roomData.leaderUsername, null);
			roomInstance.players = roomData.players.map((username) => {
				const socketId = socketService.getUserSocketId(username);
				return new Player(username, socketId);
			});

			const gameService = new GameService();
			gameService.startGame(roomInstance);
			this.gameServices.set(roomName, gameService);
			this.notifyPlayersRoomUpdated(roomData);
			return roomData;
		} catch (error) {
			console.error("Error starting game:", error);
			return null;
		}
	}

	endGame(roomName) {
		const room = this.getRoomByName(roomName);
		if (!room) {
			return null;
		}
		room.gameOnGoing = false;
		this.activeRooms.set(roomName, room);
		roomDao.update(roomName, { gameOnGoing: false });
		const gameService = this.gameServices.get(roomName);
		if (gameService) {
			gameService.endGame();
			this.gameServices.delete(roomName);
		}
		return room;
	}

	handleMovePiece(roomName, username, direction) {
		const gameService = this.gameServices.get(roomName);
		if (!gameService) {
			return;
		}
		gameService.movePiece(roomName, username, direction);
	}

	notifyPlayersRoomUpdated(room) {
		if (!room || !room.players || !socketService.launched) {
			return;
		}
		const payload = {
			roomName: room.name,
			leaderUsername: room.leaderUsername,
			gameOnGoing: room.gameOnGoing,
			gameStatus: room.gameStatus,
			players: room.players.filter((player) => player !== null && player !== undefined)
		};
		socketService.emitToUsers(payload.players, "roomUpdated", payload);
	}
}

export default new RoomService();
