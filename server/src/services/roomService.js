/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   roomService.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:10:49 by npatron           #+#    #+#             */
/*   Updated: 2026/02/02 16:13:51 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import socketService from "./socket/socketService.js";
import multiGameService from "./multiGameService.js";
import { RoomDao } from "../dao/roomDao.js";
import { UserDao } from "../dao/userDao.js";
import { isRoomNameFormatValid, parseRoomName } from "../utils/roomName.js";

export class RoomService {
    constructor() {
        this.roomDao = new RoomDao();
        this.userDao = new UserDao();
    }

    async isRoomNameValid(roomName) {
        const parsedRoomName = parseRoomName(roomName);
        if (!isRoomNameFormatValid(parsedRoomName)) {
            return false;
        }
        const existingRoom = await this.roomDao.findByName(parsedRoomName);
        if (existingRoom) {
            return false;
        }
        return true;
    }

    async createRoom(roomName, leaderId) {
        const parsedRoomName = parseRoomName(roomName);
        if (!isRoomNameFormatValid(parsedRoomName) || !leaderId) {
            throw new Error("Room name and leader ID are required");
        }
        const existingRoom = await this.roomDao.findByName(parsedRoomName);
        if (existingRoom) {
            throw new Error("Room already exists");
        }

        const leader = await this.userDao.findById(leaderId);
        if (!leader) {
            throw new Error("Leader user not found");
        }

        await this.roomDao.create({
            name: parsedRoomName,
            leaderId: leader.id,
            createdAt: new Date(),
        });
        const enrichedRoom = await this.getRoomByName(parsedRoomName);
        return enrichedRoom;
    }

    async joinRoom(roomName, userId) {
        const parsedRoomName = parseRoomName(roomName);
        const room = await this.getRoomByName(parsedRoomName);
        if (!room) {
            throw new Error("Room not found");
        }
        if (room.leaderId === userId || room.opponentId === userId) {
            throw new Error("User already in room");
        }
        if (!["PENDING", "WAITING"].includes(room.status)) {
            throw new Error("Room is not joinable");
        }
        if (room.opponentId) {
            throw new Error("Room is full");
        }

        const user = await this.userDao.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        await this.roomDao.updateByName(parsedRoomName, { opponent_id: user.id });
        const updatedRoom = await this.getRoomByName(parsedRoomName);
        this.notifyPlayersRoomUpdated(updatedRoom);
        return updatedRoom;
    }

    async getRoomByName(roomName) {
        const parsedRoomName = parseRoomName(roomName);
        const room = await this.roomDao.findByName(parsedRoomName);
        if (room) {
            return this.enrichRoomData(room);
        }
        return null;
    }

    enrichRoomData(room) {
        if (!room) return null;

        const players = [];
        const playerIds = [];
        const playerNames = [];

        if (room.leader) {
            players.push({ id: room.leader.id, name: room.leader.name });
            playerIds.push(room.leader.id);
            playerNames.push(room.leader.name);
        }
        if (room.opponent) {
            players.push({ id: room.opponent.id, name: room.opponent.name });
            playerIds.push(room.opponent.id);
            playerNames.push(room.opponent.name);
        }

        return {
            ...room,
            status: room.status,
            leaderId: room.leader_id,
            opponentId: room.opponent_id,
            leaderUsername: room.leader?.name || null,
            opponentUsername: room.opponent?.name || null,
            players,
            playerIds,
            playerNames,
        };
    }

    async getAllRooms() {
        const rooms = await this.roomDao.findAll();
        return rooms.map(room => this.enrichRoomData(room));
    }

    async addPlayer(roomName, userId) {
        const parsedRoomName = parseRoomName(roomName);
        const room = await this.getRoomByName(parsedRoomName);
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
        return this.joinRoom(parsedRoomName, userId);
    }

    async removePlayer(roomName, userId) {
        const parsedRoomName = parseRoomName(roomName);
        const room = await this.getRoomByName(parsedRoomName);
        if (!room) {
            return null;
        }
        if (!userId) {
            throw new Error("Invalid userId parameter in removePlayer");
        }

        if (room.leaderId === userId) {
            if (room.opponentId) {
                await this.roomDao.updateByName(parsedRoomName, { leader_id: room.opponentId, opponent_id: null });
                const updated = await this.getRoomByName(parsedRoomName);
                this.notifyPlayersRoomUpdated(updated);
                return updated;
            } else {
                await this.roomDao.deleteByName(parsedRoomName);
                return null;
            }
        }

        if (room.opponentId === userId) {
            await this.roomDao.updateByName(parsedRoomName, { opponent_id: null });
            const updated = await this.getRoomByName(parsedRoomName);
            this.notifyPlayersRoomUpdated(updated);
            return updated;
        }

        return room;
    }

    async startGame(roomName, userId) {
        const parsedRoomName = parseRoomName(roomName);
        const roomData = await this.getRoomByName(parsedRoomName);
        if (!roomData) {
            throw new Error("Room not found");
        }
        if (roomData.leaderId !== userId) {
            throw new Error("Only room host can start the game");
        }
        if (roomData.playerIds.length < 2) {
            throw new Error("Cannot start game alone");
        }
        if (!["PENDING", "WAITING"].includes(roomData.status)) {
            throw new Error("Room is not in a waiting state");
        }
        await this.roomDao.updateByName(parsedRoomName, { status: "PROCESSING" });
        const updatedRoom = await this.getRoomByName(parsedRoomName);
        this.notifyPlayersRoomUpdated(updatedRoom);
        multiGameService.createMultiGame(roomData.id, roomData.leaderId, roomData.playerIds);
        this.notifyPlayersRoomUpdated(updatedRoom);
        return updatedRoom;
    }

    async restartRoom(roomName, userId) {
        const parsedRoomName = parseRoomName(roomName);
        const roomData = await this.getRoomByName(parsedRoomName);
        if (!roomData) {
            throw new Error("Room not found");
        }
        if (roomData.leaderId !== userId) {
            throw new Error("Only room host can restart the game");
        }
        if (roomData.status !== "COMPLETED") {
            throw new Error("Room is not completed");
        }

        const previousPlayerIds = roomData.playerIds;
        await this.roomDao.updateByName(parsedRoomName, { status: "PENDING", opponent_id: null });
        const updatedRoom = await this.getRoomByName(parsedRoomName);
        this.notifyUsersRoomUpdated(previousPlayerIds, updatedRoom);
        return updatedRoom;
    }

    async endGame(roomName) {
        const parsedRoomName = parseRoomName(roomName);
        const room = await this.getRoomByName(parsedRoomName);
        if (!room) {
            return null;
        }
        await this.roomDao.updateByName(parsedRoomName, { gameOnGoing: false, gameStatus: "WAITING" });
        multiGameService.endMultiGame(room.id);
        const updatedRoom = await this.getRoomByName(parsedRoomName);
        this.notifyPlayersRoomUpdated(updatedRoom);
        return updatedRoom;
    }

    notifyPlayersRoomUpdated(room) {
        if (!room || !socketService.launched) {
            return;
        }
        const payload = room.players ? room : this.enrichRoomData(room);
        this.notifyUsersRoomUpdated([payload.leaderId, payload.opponentId], payload);
    }

    notifyUsersRoomUpdated(userIds, room) {
        if (!room || !socketService.launched) {
            return;
        }
        const payload = room.players ? room : this.enrichRoomData(room);
        socketService.emitToUsers(userIds, "roomUpdated", payload);
    }
}

const roomDao = new RoomDao();
const userDao = new UserDao();
const roomService = new RoomService(roomDao, userDao);

export default roomService;
