/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   SoloGameDao.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 15:57:54 by npatron           #+#    #+#             */
/*   Updated: 2026/01/19 16:10:51 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { prismaClient } from "../db/mainDbClientPrisma.js";

export class SoloGameDao {
	constructor(dbClient = prismaClient) {
		this.db = dbClient;
	}

	async findAll() {
		try {
			return await this.db.soloGame.findMany();
		} catch (error) {
			console.error("SoloGameDao.findAll error:", error.message);
			throw new Error(`Failed to fetch all games: ${error.message}`);
		}
	}

	async findById(gameId) {
		if (!gameId) {
			return null;
		}
		try {
			return await this.db.soloGame.findUnique({
				where: { id: gameId }
			});
		} catch (error) {
			console.error("SoloGameDao.findById error:", error.message);
			throw new Error(`Failed to find game by id '${gameId}': ${error.message}`);
		}
	}

	async create(game) {
		const { gameId, id, ...rest } = game;
		const persistedId = gameId || id;

		if (!persistedId) {
			throw new Error("Game ID is required");
		}

		try {
			return await this.db.soloGame.create({
				data: {
					id: persistedId,
					...rest
				}
			});
		} catch (error) {
			console.error("SoloGameDao.create error:", error.message);
			throw new Error(`Failed to create game '${persistedId}': ${error.message}`);
		}
	}

	async update(gameId, updates) {
		if (!gameId) {
			return null;
		}
		try {
			return await this.db.soloGame.update({
				where: { id: gameId },
				data: updates
			});
		} catch (error) {
			console.error("SoloGameDao.update error:", error.message);
			return null;
		}
	}

	async delete(gameId) {
		if (!gameId) {
			return false;
		}
		try {
			await this.db.soloGame.delete({
				where: { id: gameId }
			});
			return true;
		} catch (error) {
			console.error("SoloGameDao.delete error:", error.message);
			return false;
		}
	}

	async findByUserId(userId) {
		if (!userId) {
			return null;
		}
		try {
			return await this.db.soloGame.findMany({
				where: { player_id: userId }
			});
		} catch (error) {
			console.error("SoloGameDao.findByUserId error:", error.message);
			throw new Error(`Failed to find games by user id '${userId}': ${error.message}`);
		}
	}
}

export default new SoloGameDao();
