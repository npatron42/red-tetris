/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   roomDao.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 15:57:54 by npatron           #+#    #+#             */
/*   Updated: 2026/02/02 15:56:08 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { v4 as uuidv4 } from "uuid";
import { prismaClient } from "../db/mainDbClientPrisma.js";

export class RoomDao {
    constructor(dbClient = prismaClient) {
        this.db = dbClient;
    }

    async findAll() {
        try {
            return await this.db.room.findMany({
                include: {
                    leader: true,
                    opponent: true,
                },
            });
        } catch (error) {
            console.error("RoomDao.findAll error:", error.message);
            throw new Error(`Failed to fetch all rooms: ${error.message}`);
        }
    }

    async findByName(name) {
        try {
            if (!name) {
                return null;
            }
            const room = await this.db.room.findFirst({
                where: { name: name },
                include: {
                    leader: true,
                    opponent: true,
                },
            });
            return room;
        } catch (error) {
            console.error("RoomDao.findByName error:", error.message);
            throw new Error(`Failed to find room by id '${id}': ${error.message}`);
        }
    }

    async findById(id) {
        if (!id) {
            return null;
        }
        try {
            return await this.db.room.findUnique({
                where: { id: id },
                include: {
                    leader: true,
                    opponent: true,
                },
            });
        } catch (error) {
            console.error("RoomDao.findById error:", error.message);
            throw new Error(`Failed to find room by id '${id}': ${error.message}`);
        }
    }

    async getUserById(id) {
        if (!id) {
            return null;
        }
        try {
            const user = await this.db.user.findUnique({ where: { id: id } });
            return user;
        } catch (error) {
            console.error("RoomDao.getUserById error:", error.message);
            throw new Error(`Failed to get user by id '${id}': ${error.message}`);
        }
    }

    async create(room) {
        const { name, leaderId, createdAt } = room;
        try {
            const leader = await this.getUserById(leaderId);
            if (!leader) {
                throw new Error("leaderId (or leaderid) is required to create a room");
            }
            return await this.db.room.create({
                data: {
                    id: uuidv4(),
                    name,
                    leader_id: leader.id,
                    created_at: createdAt,
                },
            });
        } catch (error) {
            console.error("RoomDao.create error:", error.message);
            throw new Error(`Failed to create room '${id}': ${error.message}`);
        }
    }

    async updateByName(name, data) {
        try {
            const room = await this.findByName(name);
            if (!room) {
                return null;
            }
            return await this.db.room.update({
                where: { id: room.id },
                data: data,
            });
        } catch (error) {
            console.error("RoomDao.updateByName error:", error.message);
            throw new Error(`Failed to update room by name '${name}': ${error.message}`);
        }
    }

    async delete(roomId) {
        if (!roomId) {
            return false;
        }
        try {
            await this.db.room.delete({
                where: { id: roomId },
            });
            return true;
        } catch (error) {
            console.error("RoomDao.delete error:", error.message);
            return false;
        }
    }

    async deleteByName(name) {
        try {
            const room = await this.findByName(name);
            if (!room) {
                return false;
            }
            return await this.delete(room.id);
        } catch (error) {
            console.error("RoomDao.deleteByName error:", error.message);
            return false;
        }
    }
}

export default new RoomDao();
