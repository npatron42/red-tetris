/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   matchDao.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:00:15 by npatron           #+#    #+#             */
/*   Updated: 2025/12/30 15:46:17 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { v4 as uuidv4 } from "uuid";
import { prismaClient } from "../db/mainDbClientPrisma.js";

const toBigInt = (value) => {
	if (value === undefined || value === null) {
		return undefined;
	}
	return typeof value === "bigint" ? value : BigInt(value);
};

export class MatchDao {
	constructor(dbClient = prismaClient) {
		this.db = dbClient;
	}

	async findAll() {
		return this.db.match.findMany({
			orderBy: { created_at: "desc" }
		});
	}

	async findById(id) {
		if (!id) {
			return null;
		}
		return this.db.match.findUnique({
			where: { id }
		});
	}

	async findByPlayerId(playerId) {
		if (!playerId) {
			return [];
		}
		return this.db.match.findMany({
			where: {
				OR: [{ player1_id: playerId }, { player2_id: playerId }]
			},
			orderBy: { created_at: "desc" }
		});
	}

	async findByUsername(username) {
		if (!username) {
			return [];
		}
		const user = await this.db.user.findFirst({ where: { name: username } });
		if (!user) {
			return [];
		}
		return this.findByPlayerId(user.id);
	}

	async create(match) {
		const { player1Id, player2Id, winnerId = null, status, rngSeed, createdAt, endedAt } = match;

		if (!player1Id || !player2Id) {
			throw new Error("player1Id and player2Id are required");
		}
		if (rngSeed === undefined || rngSeed === null) {
			throw new Error("rngSeed is required");
		}

		return this.db.match.create({
			data: {
				id: match.id || uuidv4(),
				player1_id: player1Id,
				player2_id: player2Id,
				winner_id: winnerId,
				status: status || "PENDING",
				rng_seed: toBigInt(rngSeed),
				created_at: createdAt,
				ended_at: endedAt
			}
		});
	}

	async update(id, updates) {
		if (!id) {
			return null;
		}

		const { player1Id, player2Id, winnerId, rngSeed, ...rest } = updates ?? {};

		return this.db.match.update({
			where: { id },
			data: {
				...rest,
				player1_id: player1Id ?? undefined,
				player2_id: player2Id ?? undefined,
				winner_id: winnerId ?? undefined,
				rng_seed: rngSeed !== undefined ? toBigInt(rngSeed) : undefined
			}
		});
	}

	async delete(id) {
		if (!id) {
			return false;
		}
		try {
			await this.db.match.delete({
				where: { id }
			});
			return true;
		} catch {
			return false;
		}
	}
}

// Preserve legacy import name to avoid breaking callers before services are updated.
export { MatchDao as MatchHistoryDao };

export default new MatchDao();
