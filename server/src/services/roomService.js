/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   roomService.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:10:49 by npatron           #+#    #+#             */
/*   Updated: 2026/01/19 16:29:05 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import pino from "pino";
import socketService from "./socket/socketService.js";
import multiGameService from "./multiGameService.js";
import { RoomDao } from "../dao/roomDao.js";
import { UserDao } from "../dao/userDao.js";

const logger = pino({
	level: "info"
});

logger.info("RoomService initialized");
export class RoomService {
	constructor() {
		this.roomDao = new RoomDao();
		this.userDao = new UserDao();
		this.activeRooms = new Map();
	}

	async getUserById(id) {
		if (!id) return null;
		return this.userDao.findById(id);
	}

	async getUserNameById(id) {
		if (!id) return null;
		const user = await this.userDao.findById(id);
		return user?.name ?? null;
	}

	buildRoomView(room, displayName) {
		const players = [];
		if (room.leader_id) {
			if (room.leaderUsername) {
				players.push(room.leaderUsername);
			}
		}
		if (room.opponent_id && room.opponentUsername) {
			players.push(room.opponentUsername);
		}
		return {
			id: room.id,
			name: displayName || room.name || room.id,
			leaderId: room.leader_id,
			opponentId: room.opponent_id,
			leaderUsername: room.leaderUsername,
			opponentUsername: room.opponentUsername,
			players,
			gameStatus: room.gameStatus || "PENDING",
			gameOnGoing: room.gameOnGoing || false
		};
	}

	async hydrateRoom(room, displayName) {
		if (!room) return null;
		const leaderUsername = room.leaderUsername || (await this.getUserNameById(room.leader_id));
		const opponentUsername = room.opponentUsername || (await this.getUserNameById(room.opponent_id));
		return this.buildRoomView({ ...room, leaderUsername, opponentUsername }, displayName);
	}

	async createRoom(roomName, leaderId) {
		if (!roomName || !leaderId) {
			throw new Error("Room name and leader ID are required");
		}
		const existingRoom = await this.roomDao.findByName(roomName);
		if (existingRoom) {
			throw new Error("Room already exists");
		}

		const leader = await this.userDao.findById(leaderId);
		if (!leader) {
			throw new Error("Leader user not found");
		}

		const savedRoom = await this.roomDao.create({
			name: roomName,
			leaderId: leader.id,
			createdAt: new Date()
		});
		const view = await this.hydrateRoom(savedRoom, roomName);
		this.activeRooms.set(savedRoom.id, view);
		return view;
	}

	async joinRoom(roomName, userId) {
		const room = await this.getRoomByName(roomName);
		if (!room) {
			throw new Error("Room not found");
		}
		if (room.opponentId) {
			return room;
		}

		const user = await this.userDao.findById(userId);
		if (!user) {
			throw new Error("User not found");
		}

		await this.roomDao.updateByName(roomName, { opponentId: user.id });
		const updated = await this.getRoomByName(roomName);
		this.notifyPlayersRoomUpdated(updated);
		return updated;
	}

	async getRoomByName(roomName) {
		logger.info("Getting room by name", { roomName });
		const persistedRoom = await this.roomDao.findByName(roomName);
		if (persistedRoom && this.activeRooms.has(persistedRoom.id)) {
			return this.activeRooms.get(persistedRoom.id);
		}
		if (persistedRoom) {
			const view = await this.hydrateRoom(persistedRoom, roomName);
			this.activeRooms.set(persistedRoom.id, view);
			logger.info("Room found in persisted rooms", { persistedRoom });
			return view;
		}
		logger.info("Room not found", { roomName });
		return null;
	}

	async getAllRooms() {
		const persistedRooms = await this.roomDao.findAll();
		const views = [];
		for (const room of persistedRooms) {
			const view = await this.hydrateRoom(room);
			if (view) {
				this.activeRooms.set(room.id, view);
				views.push(view);
			}
		}
		return views;
	}

	async addPlayer(roomName, userId) {
		logger.info("Adding player to room", { roomName, userId });
		const room = await this.getRoomByName(roomName);
		if (!room) {
			throw new Error("Room not found");
		}
		const user = await this.userDao.findById(userId);
		if (!user) {
			throw new Error("User not found");
		}
		if (room.players.includes(user.name)) {
			return room;
		}
		return this.joinRoom(roomName, userId);
	}

	async removePlayer(roomName, userId) {
		const room = await this.getRoomByName(roomName);
		if (!room) {
			return null;
		}
		if (!userId) {
			logger.warn("Invalid userId parameter in removePlayer", { userId, roomName });
			return room;
		}

		if (room.leaderId === userId) {
			if (room.opponentId) {
				await this.roomDao.updateByName(roomName, { leaderId: room.opponentId, opponentId: null });
				const updated = await this.getRoomByName(roomName);
				this.notifyPlayersRoomUpdated(updated);
				return updated;
			} else {
				await this.roomDao.deleteByName(roomName);
				this.activeRooms.delete(room.id);
				return null;
			}
		}

		if (room.opponentId === userId) {
			await this.roomDao.updateByName(roomName, { opponentId: null });
			const updated = await this.getRoomByName(roomName);
			this.notifyPlayersRoomUpdated(updated);
			return updated;
		}

		return room;
	}

	async startGame(roomName) {
		try {
			const roomData = await this.getRoomByName(roomName);
			if (!roomData) {
				throw new Error("Room not found");
			}
			roomData.gameOnGoing = true;
			roomData.gameStatus = "PLAYING";
			this.activeRooms.set(roomData.id, roomData);

			multiGameService.createMultiGame(roomData.name, roomData.leaderUsername, roomData.players);

			this.notifyPlayersRoomUpdated(roomData);
			return roomData;
		} catch (error) {
			console.error("Error starting game:", error);
			return null;
		}
	}

	async endGame(roomName) {
		const room = await this.getRoomByName(roomName);
		if (!room) {
			return null;
		}
		room.gameOnGoing = false;
		this.activeRooms.set(room.id, room);
		multiGameService.endMultiGame(roomName);
		return room;
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

const roomDao = new RoomDao();
const userDao = new UserDao();
const roomService = new RoomService(roomDao, userDao);

export default roomService;
