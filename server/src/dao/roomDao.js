/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   roomDao.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 15:57:54 by npatron           #+#    #+#             */
/*   Updated: 2025/12/30 15:46:31 by npatron          ###   ########.fr       */
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
			return await this.db.room.findMany();
		} catch (error) {
			console.error("RoomDao.findAll error:", error.message);
			throw new Error(`Failed to fetch all rooms: ${error.message}`);
		}
	}

	async findById(id) {
		if (!id) {
			return null;
		}
		try {
			return await this.db.room.findUnique({
				where: { id }
			});
		} catch (error) {
			console.error("RoomDao.findById error:", error.message);
			throw new Error(`Failed to find room by id '${id}': ${error.message}`);
		}
	}

	async findByName(name) {
		if (!name) {
			return null;
		}
		try {
			return await this.db.room.findFirst({
				where: { name }
			});
		} catch (error) {
			console.error("RoomDao.findByName error:", error.message);
			throw new Error(`Failed to find room by name '${name}': ${error.message}`);
		}
	}

	async resolveUserIdFromName(username) {
		if (!username) {
			return null;
		}
		try {
			const user = await this.db.user.findFirst({ where: { name: username } });
			return user ? user.id : null;
		} catch (error) {
			console.error("RoomDao.resolveUserIdFromName error:", error.message);
			throw new Error(`Failed to resolve user id from name '${username}': ${error.message}`);
		}
	}

	async create(room) {
		const { leaderId, leaderName, opponentId = null, opponentName = null, name, createdAt } = room;

		if (!name) {
			throw new Error("name is required to create a room");
		}

		try {
			const resolvedLeaderId = leaderId || (await this.resolveUserIdFromName(leaderName));
			const resolvedOpponentId = opponentId || (opponentName ? await this.resolveUserIdFromName(opponentName) : null);

			if (!resolvedLeaderId) {
				throw new Error("leaderId (or leaderName) is required to create a room");
			}

			return await this.db.room.create({
				data: {
					id: room.id || uuidv4(),
					name,
					leader_id: resolvedLeaderId,
					opponent_id: resolvedOpponentId,
					created_at: createdAt
				}
			});
		} catch (error) {
			console.error("RoomDao.create error:", error.message);
			throw new Error(`Failed to create room '${name}': ${error.message}`);
		}
	}

	async update(id, updates) {
		if (!id) {
			return null;
		}

		try {
			const { leaderId, leaderName, opponentId, opponentName, createdAt, name, ...rest } = updates ?? {};

			const resolvedLeaderId = leaderId || (leaderName ? await this.resolveUserIdFromName(leaderName) : undefined);
			const resolvedOpponentId =
				opponentId !== undefined
					? opponentId
					: opponentName
					? await this.resolveUserIdFromName(opponentName)
					: undefined;

			return await this.db.room.update({
				where: { id },
				data: {
					...rest,
					name: name ?? undefined,
					leader_id: resolvedLeaderId,
					opponent_id: resolvedOpponentId,
					created_at: createdAt ?? undefined
				}
			});
		} catch (error) {
			console.error("RoomDao.update error:", error.message);
			throw new Error(`Failed to update room '${id}': ${error.message}`);
		}
	}

	async updateByName(name, updates) {
		try {
			const existing = await this.findByName(name);
			if (!existing) {
				return null;
			}
			return await this.update(existing.id, updates);
		} catch (error) {
			console.error("RoomDao.updateByName error:", error.message);
			throw new Error(`Failed to update room by name '${name}': ${error.message}`);
		}
	}

	async delete(id) {
		if (!id) {
			return false;
		}
		try {
			await this.db.room.delete({
				where: { id }
			});
			return true;
		} catch (error) {
			console.error("RoomDao.delete error:", error.message);
			return false;
		}
	}

	async deleteByName(name) {
		try {
			const existing = await this.findByName(name);
			if (!existing) {
				return false;
			}
			return await this.delete(existing.id);
		} catch (error) {
			console.error("RoomDao.deleteByName error:", error.message);
			return false;
		}
	}
}

export default new RoomDao();
