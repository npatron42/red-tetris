/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   matchHistoryManager.js                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 12:58:25 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 12:58:26 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import fs from "fs";

const dbPath = "./src/db/db.json";

export class MatchHistoryManager {
	createMatchHistory = async (players, winner) => {
		if (!Array.isArray(players) || players.length === 0) {
			throw new Error("Players array is required");
		}
		if (!winner) {
			throw new Error("Winner is required");
		}
		const match = {
			players,
			winner,
			timestamp: new Date().toISOString()
		};
		const data = fs.readFileSync(dbPath, "utf8");
		const trimmedData = data.trim();
		const userData = trimmedData ? JSON.parse(trimmedData) : [];
		for (const player of players) {
			const user = userData.find((u) => u.username === player);
			if (user) {
				if (!user.matchHistory) {
					user.matchHistory = [];
				}
				user.matchHistory.push(match);
				if (user.username === winner) {
					user.numberOfWins = (user.numberOfWins || 0) + 1;
				} else {
					user.numberOfLosses = (user.numberOfLosses || 0) + 1;
				}
				user.totalGames = (user.totalGames || 0) + 1;
			}
		}
		fs.writeFileSync(dbPath, JSON.stringify(userData, null, 2));
		return match;
	};

	getMatchHistoryByUsername = async (username) => {
		if (!username) {
			throw new Error("Username is required");
		}
		const data = fs.readFileSync(dbPath, "utf8");
		const trimmedData = data.trim();
		if (!trimmedData) {
			return [];
		}
		const userData = JSON.parse(trimmedData);
		if (!Array.isArray(userData)) {
			return [];
		}
		const user = userData.find((u) => u.username === username);
		if (!user || !user.matchHistory) {
			return [];
		}
		return user.matchHistory;
	};
}
