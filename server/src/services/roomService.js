/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   roomService.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:10:49 by npatron           #+#    #+#             */
/*   Updated: 2026/01/31 10:49:27 by npatron          ###   ########.fr       */
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

export class RoomService {
	constructor() {
		this.roomDao = new RoomDao();
		this.userDao = new UserDao();
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
		const enrichedRoom = await this.getRoomByName(roomName);
		return enrichedRoom;
	}

	async joinRoom(roomName, userId) {
		console.log("ICI --> joinRoom", { roomName, userId });
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
		const updatedRoom = await this.getRoomByName(roomName);
		this.notifyPlayersRoomUpdated(updatedRoom);
		return updatedRoom;
	}

	async getRoomByName(roomName) {
		const room = await this.roomDao.findByName(roomName);
		if (room) {
			return this.enrichRoomData(room);
		}
		return null;
	}

	enrichRoomData(room) {
		if (!room) return null;
		
		const players = [];
		if (room.leader) {
			players.push(room.leader.name);
		}
		if (room.opponent) {
			players.push(room.opponent.name);
		}

		return {
			...room,
			leaderId: room.leader_id,
			opponentId: room.opponent_id,
			leaderUsername: room.leader?.name || null,
			opponentUsername: room.opponent?.name || null,
			players
		};
	}

	async getAllRooms() {
		const rooms = await this.roomDao.findAll();
		return rooms.map(room => this.enrichRoomData(room));
	}

	async addPlayer(roomName, userId) {
		const room = await this.getRoomByName(roomName);
		if (!room) {
			throw new Error("Room not found");
		}
		const user = await this.userDao.findById(userId);
		if (!user) {
			throw new Error("User not found");
		}
		if (room.leaderId === userId || room.opponentId === userId) {
			throw new Error("User already in room");
		}
		return this.joinRoom(roomName, userId);
	}

	async removePlayer(roomName, userId) {
		const room = await this.getRoomByName(roomName);
		if (!room) {
			return null;
		}
		if (!userId) {
			throw new Error("Invalid userId parameter in removePlayer");
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
		if (!room  || !socketService.launched) {
			return;
		}
        console.log("ICI --> room", room);
		const payload = {
			name: room.name,
			leaderId: room.leaderId,
			opponentId: room.opponentId,
			leaderUsername: room.leaderUsername,
			opponentUsername: room.opponentUsername,
			gameOnGoing: room.gameOnGoing,
			gameStatus: room.gameStatus,
			players: room.players.filter((player) => player !== null && player !== undefined)
		};
		socketService.emitToUsers([room.leaderId, room.opponentId], "roomUpdated", payload);
	}
}

const roomDao = new RoomDao();
const userDao = new UserDao();
const roomService = new RoomService(roomDao, userDao);

export default roomService;
