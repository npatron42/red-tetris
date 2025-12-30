/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gameDao.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 15:57:54 by npatron           #+#    #+#             */
/*   Updated: 2025/12/30 15:46:24 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { prismaClient } from "../db/mainDbClientPrisma.js";

export class GameDao {
	constructor(dbClient = prismaClient) {
		this.db = dbClient;
	}

	async findAll() {
		return this.db.soloGame.findMany();
	}

	async findById(gameId) {
		if (!gameId) {
			return null;
		}
		return this.db.soloGame.findUnique({
			where: { id: gameId }
		});
	}

	async create(game) {
		const { gameId, id, ...rest } = game;
		const persistedId = gameId || id;

		if (!persistedId) {
			throw new Error("Game ID is required");
		}

		return this.db.soloGame.create({
			data: {
				id: persistedId,
				...rest
			}
		});
	}

	async update(gameId, updates) {
		try {
			return await this.db.soloGame.update({
				where: { id: gameId },
				data: updates
			});
		} catch (error) {
			return null;
		}
	}

	async delete(gameId) {
		try {
			await this.db.soloGame.delete({
				where: { id: gameId }
			});
			return true;
		} catch (error) {
			return false;
		}
	}
}

export default new GameDao();
