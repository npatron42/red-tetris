/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   matchHistoryService.js                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:10:54 by npatron           #+#    #+#             */
/*   Updated: 2025/12/09 17:59:44 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { v4 as uuidv4 } from "uuid";
import matchHistoryDao from "../dao/matchHistoryDao.js";
import userService from "./userService.js";

export class MatchHistoryService {
	async createMatchHistory(players, winner) {
		if (!Array.isArray(players) || players.length === 0) {
			throw new Error("Players array is required");
		}
		if (!winner) {
			throw new Error("Winner is required");
		}
		const match = {
			id: uuidv4(),
			players,
			winner,
			timestamp: new Date().toISOString()
		};
		matchHistoryDao.create(match);
		for (const player of players) {
			await userService.updateStats(player, player === winner);
		}
		return match;
	}

	async getMatchHistoryByUsername(username) {
		if (!username) {
			throw new Error("Username is required");
		}
		return matchHistoryDao.findByUsername(username);
	}
}

export default new MatchHistoryService();
