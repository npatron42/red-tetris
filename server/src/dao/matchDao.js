/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   matchDao.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:00:15 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 15:25:48 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { v4 as uuidv4 } from "uuid";
import { prismaClient } from "../db/mainDbClientPrisma.js";

const toBigInt = value => {
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
        try {
            return await this.db.match.findMany({
                orderBy: { created_at: "desc" },
            });
        } catch (error) {
            console.error("MatchDao.findAll error:", error.message);
            throw new Error(`Failed to fetch all matches: ${error.message}`);
        }
    }

    async findById(id) {
        if (!id) {
            return null;
        }
        try {
            return await this.db.match.findUnique({
                where: { id },
            });
        } catch (error) {
            console.error("MatchDao.findById error:", error.message);
            throw new Error(`Failed to find match by id '${id}': ${error.message}`);
        }
    }

    async findByPlayerId(playerId) {
        if (!playerId) {
            return [];
        }
        try {
            return await this.db.match.findMany({
                where: {
                    OR: [{ player1_id: playerId }, { player2_id: playerId }],
                },
                orderBy: { created_at: "desc" },
            });
        } catch (error) {
            console.error("MatchDao.findByPlayerId error:", error.message);
            throw new Error(`Failed to find matches for player '${playerId}': ${error.message}`);
        }
    }

    async findByUsername(name) {
        if (!name) {
            return [];
        }
        try {
            const user = await this.db.user.findFirst({ where: { name: name } });
            if (!user) {
                return [];
            }
            return await this.findByPlayerId(user.id);
        } catch (error) {
            console.error("MatchDao.findByUsername error:", error.message);
            throw new Error(`Failed to find matches for name '${name}': ${error.message}`);
        }
    }

    async create(match) {
        const { player1Id, player2Id, winnerId = null, status, rngSeed, createdAt, endedAt } = match;

        if (!player1Id || !player2Id) {
            throw new Error("player1Id and player2Id are required");
        }
        if (rngSeed === undefined || rngSeed === null) {
            throw new Error("rngSeed is required");
        }

        try {
            return await this.db.match.create({
                data: {
                    id: match.id || uuidv4(),
                    player1_id: player1Id,
                    player2_id: player2Id,
                    winner_id: winnerId,
                    status: status || "PENDING",
                    rng_seed: toBigInt(rngSeed),
                    created_at: createdAt,
                    ended_at: endedAt,
                },
            });
        } catch (error) {
            console.error("MatchDao.create error:", error.message);
            throw new Error(`Failed to create match: ${error.message}`);
        }
    }

    async update(id, updates) {
        if (!id) {
            return null;
        }

        try {
            const { player1Id, player2Id, winnerId, rngSeed, ...rest } = updates ?? {};

            return await this.db.match.update({
                where: { id },
                data: {
                    ...rest,
                    player1_id: player1Id ?? undefined,
                    player2_id: player2Id ?? undefined,
                    winner_id: winnerId ?? undefined,
                    rng_seed: rngSeed !== undefined ? toBigInt(rngSeed) : undefined,
                },
            });
        } catch (error) {
            console.error("MatchDao.update error:", error.message);
            throw new Error(`Failed to update match '${id}': ${error.message}`);
        }
    }

    async delete(id) {
        if (!id) {
            return false;
        }
        try {
            await this.db.match.delete({
                where: { id },
            });
            return true;
        } catch (error) {
            console.error("MatchDao.delete error:", error.message);
            return false;
        }
    }
}

// Preserve legacy import name to avoid breaking callers before services are updated.
export { MatchDao as MatchHistoryDao };

export default new MatchDao();
