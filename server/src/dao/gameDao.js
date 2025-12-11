/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gameDao.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 15:57:54 by npatron           #+#    #+#             */
/*   Updated: 2025/12/11 18:49:46 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { readJsonFile, writeJsonFile } from "../utils/fileStorage.js";

const dbPath = "./src/db/games.json";

export class GameDao {
	findAll() {
		return readJsonFile(dbPath);
	}

	findByName(name) {
		const games = readJsonFile(dbPath);
		return games.find((game) => game.name === name) || null;
	}

	create(game) {
		const games = readJsonFile(dbPath);
		games.push(game);
		writeJsonFile(dbPath, games);
		return game;
	}

	update(name, updates) {
		const games = readJsonFile(dbPath);
		const index = games.findIndex((game) => game.name === name);
		if (index === -1) {
			return null;
		}
		games[index] = { ...games[index], ...updates };
		writeJsonFile(dbPath, games);
		return games[index];
	}

	delete(name) {
		const games = readJsonFile(dbPath);
		const filtered = games.filter((game) => game.name !== name);
		writeJsonFile(dbPath, filtered);
		return true;
	}
}

export default new GameDao();
