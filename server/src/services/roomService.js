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

export class RoomService {
    constructor() {
        this.roomDao = new RoomDao();
        this.userDao = new UserDao();
    }

    async isRoomNameValid(roomName) {
        if (!roomName || roomName.length < 1) {
            return false;
        }
        const existingRoom = await this.roomDao.findByName(roomName);
        if (existingRoom) {
            return false;
        }
        return true;
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

        await this.roomDao.create({
            name: roomName,
            leaderId: leader.id,
            createdAt: new Date(),
            
        });
        const enrichedRoom = await this.getRoomByName(roomName);
        return enrichedRoom;
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

        await this.roomDao.updateByName(roomName, { opponent_id: user.id });
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
            if (roomData.status !== "PENDING") {
                throw new Error("Room is not in a waiting state");
            }
                await this.roomDao.updateByName(roomName, { status: "PROCESSING" });
            const updatedRoom = await this.getRoomByName(roomName);
            this.notifyPlayersRoomUpdated(updatedRoom);
            console.log("roomName. leaderId, player Ids", roomName, roomData.leaderId, roomData.playerIds);
            multiGameService.createMultiGame(roomData.id, roomData.leaderId, roomData.playerIds);
            this.notifyPlayersRoomUpdated(updatedRoom);
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
        await this.roomDao.updateByName(roomName, { gameOnGoing: false, gameStatus: "WAITING" });
        multiGameService.endMultiGame(room.id);
        const updatedRoom = await this.getRoomByName(roomName);
        this.notifyPlayersRoomUpdated(updatedRoom);
        return updatedRoom;
    }

    notifyPlayersRoomUpdated(room) {
        if (!room || !socketService.launched) {
            return;
        }
        const payload = this.enrichRoomData(room);
        socketService.emitToUsers([room.leaderId, room.opponentId], "roomUpdated", payload);
    }
}

const roomDao = new RoomDao();
const userDao = new UserDao();
const roomService = new RoomService(roomDao, userDao);

export default roomService;
