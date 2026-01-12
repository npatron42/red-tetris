/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   matchHistoryService.js                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:10:54 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 15:25:48 by npatron          ###   ########.fr       */
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

	async createMatchHistory(playerIds, winnerId) {
		if (!Array.isArray(playerIds) || playerIds.length === 0) {
			throw new Error("Player IDs array is required");
		}
		if (!winnerId) {
			throw new Error("Winner ID is required");
		}

		const [player1Id, player2Id] = playerIds;

		const player1 = await this.userService.getUserById(player1Id);
		const player2 = player2Id ? await this.userService.getUserById(player2Id) : player1;

		const match = await this.matchDao.create({
			id: uuidv4(),
			player1Id: player1.id,
			player2Id: player2.id,
			winnerId: winnerId,
			status: "FINISHED",
			rngSeed: Date.now()
		});

		for (const playerId of playerIds) {
			await this.userService.updateStatsById(playerId, playerId === winnerId);
		}
		return match;
	}

	async getMatchHistoryByUserId(userId) {
		if (!userId) {
			throw new Error("User ID is required");
		}
		return this.matchDao.findByPlayerId(userId);
	}
}

const matchDao = new MatchDao();
const matchHistoryService = new MatchHistoryService(matchDao, userService);

export default matchHistoryService;
