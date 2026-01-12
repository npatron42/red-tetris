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
import { MatchDao } from "../dao/matchDao.js";
import userService from "./userService.js";

export class MatchHistoryService {
	constructor(matchDao, userServiceInstance) {
		this.matchDao = matchDao;
		this.userService = userServiceInstance;
	}

	async createMatchHistory(players, winner) {
		if (!Array.isArray(players) || players.length === 0) {
			throw new Error("Players array is required");
		}
		if (!winner) {
			throw new Error("Winner is required");
		}

		const [p1, p2] = players;
		const player1 = await this.userService.getUserByUsername(p1);
		const player2 = p2 ? await this.userService.getUserByUsername(p2) : player1;
		const winnerUser = await this.userService.getUserByUsername(winner);

		const match = await this.matchDao.create({
			id: uuidv4(),
			player1Id: player1.id,
			player2Id: player2.id,
			winnerId: winnerUser?.id ?? null,
			status: "FINISHED",
			rngSeed: Date.now()
		});

		for (const player of players) {
			await this.userService.updateStats(player, player === winner);
		}
		return match;
	}

	async getMatchHistoryByUsername(username) {
		if (!username) {
			throw new Error("Username is required");
		}
		return this.matchDao.findByUsername(username);
	}
}

const matchDao = new MatchDao();
const matchHistoryService = new MatchHistoryService(matchDao, userService);

export default matchHistoryService;
