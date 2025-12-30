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
		return this.db.room.findMany();
	}

	async findById(id) {
		if (!id) {
			return null;
		}
		return this.db.room.findUnique({
			where: { id }
		});
	}

	async findByName(name) {
		if (!name) {
			return null;
		}
		return this.db.room.findFirst({
			where: { name }
		});
	}

	async resolveUserIdFromName(username) {
		if (!username) {
			return null;
		}
		const user = await this.db.user.findFirst({ where: { name: username } });
		return user ? user.id : null;
	}

	async create(room) {
		const { leaderId, leaderName, opponentId = null, opponentName = null, name, createdAt } = room;

		const resolvedLeaderId = leaderId || (await this.resolveUserIdFromName(leaderName));
		const resolvedOpponentId = opponentId || (opponentName ? await this.resolveUserIdFromName(opponentName) : null);

		if (!name) {
			throw new Error("name is required to create a room");
		}
		if (!resolvedLeaderId) {
			throw new Error("leaderId (or leaderName) is required to create a room");
		}

		return this.db.room.create({
			data: {
				id: room.id || uuidv4(),
				name,
				leader_id: resolvedLeaderId,
				opponent_id: resolvedOpponentId,
				created_at: createdAt
			}
		});
	}

	async update(id, updates) {
		if (!id) {
			return null;
		}
		const { leaderId, leaderName, opponentId, opponentName, createdAt, name, ...rest } = updates ?? {};

		const resolvedLeaderId = leaderId || (leaderName ? await this.resolveUserIdFromName(leaderName) : undefined);
		const resolvedOpponentId =
			opponentId !== undefined
				? opponentId
				: opponentName
				? await this.resolveUserIdFromName(opponentName)
				: undefined;

		return this.db.room.update({
			where: { id },
			data: {
				...rest,
				name: name ?? undefined,
				leader_id: resolvedLeaderId,
				opponent_id: resolvedOpponentId,
				created_at: createdAt ?? undefined
			}
		});
	}

	async updateByName(name, updates) {
		const existing = await this.findByName(name);
		if (!existing) {
			return null;
		}
		return this.update(existing.id, updates);
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
		} catch {
			return false;
		}
	}

	async deleteByName(name) {
		const existing = await this.findByName(name);
		if (!existing) {
			return false;
		}
		return this.delete(existing.id);
	}
}

export default new RoomDao();
