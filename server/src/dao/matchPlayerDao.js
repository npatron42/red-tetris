/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   matchPlayerDao.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/28 00:00:00 by npatron           #+#    #+#             */
/*   Updated: 2026/04/28 00:00:00 by npatron          ###   ########.fr       */
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

export class MatchPlayerDao {
    constructor(dbClient = prismaClient) {
        this.db = dbClient;
    }

    async createMany(rows) {
        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const data = rows.map(row => {
            if (!row.matchId) {
                throw new Error("matchId is required");
            }
            if (!row.playerId) {
                throw new Error("playerId is required");
            }
            return {
                id: row.id || uuidv4(),
                match_id: row.matchId,
                player_id: row.playerId,
                score: row.score ?? 0,
                level: row.level ?? 1,
                lines_cleared: row.linesCleared ?? 0,
                duration_ms: toBigInt(row.durationMs),
            };
        });

        try {
            await this.db.matchPlayer.createMany({ data });
            return data;
        } catch (error) {
            console.error("MatchPlayerDao.createMany error:", error.message);
            throw new Error(`Failed to create match players: ${error.message}`);
        }
    }

    async findByMatchId(matchId) {
        if (!matchId) {
            return [];
        }
        try {
            return await this.db.matchPlayer.findMany({
                where: { match_id: matchId },
                orderBy: { score: "desc" },
            });
        } catch (error) {
            console.error("MatchPlayerDao.findByMatchId error:", error.message);
            throw new Error(`Failed to find match players for match '${matchId}': ${error.message}`);
        }
    }

    async findByPlayerId(playerId) {
        if (!playerId) {
            return [];
        }
        try {
            return await this.db.matchPlayer.findMany({
                where: { player_id: playerId },
            });
        } catch (error) {
            console.error("MatchPlayerDao.findByPlayerId error:", error.message);
            throw new Error(`Failed to find match players for player '${playerId}': ${error.message}`);
        }
    }
}

export default new MatchPlayerDao();
