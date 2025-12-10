/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   matchHistoryDao.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:00:15 by npatron           #+#    #+#             */
/*   Updated: 2025/12/09 18:00:02 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { readJsonFile, writeJsonFile } from "../utils/fileStorage.js";

const dbPath = "./src/db/matchs.json";

export class MatchHistoryDao {
	findAll() {
		return readJsonFile(dbPath);
	}

	findById(id) {
		const matchs = readJsonFile(dbPath);
		return matchs.find((match) => match.id === id) || null;
	}

	findByUsername(username) {
		const matchs = readJsonFile(dbPath);
		return matchs.filter((match) => match.players && match.players.includes(username));
	}

	create(match) {
		const matchs = readJsonFile(dbPath);
		matchs.push(match);
		writeJsonFile(dbPath, matchs);
		return match;
	}

	update(id, updates) {
		const matchs = readJsonFile(dbPath);
		const index = matchs.findIndex((match) => match.id === id);
		if (index === -1) {
			return null;
		}
		matchs[index] = { ...matchs[index], ...updates };
		writeJsonFile(dbPath, matchs);
		return matchs[index];
	}

	delete(id) {
		const matchs = readJsonFile(dbPath);
		const filtered = matchs.filter((match) => match.id !== id);
		writeJsonFile(dbPath, filtered);
		return true;
	}

}

export default new MatchHistoryDao();
