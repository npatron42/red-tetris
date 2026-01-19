/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userService.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:11:03 by npatron           #+#    #+#             */
/*   Updated: 2026/01/19 15:51:59 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { UserDao } from "../dao/userDao.js";
import { MatchDao } from "../dao/matchDao.js";
import { SoloGameDao } from "../dao/soloGameDao.js";

export class UserService {
	constructor(userDao, matchDao = new MatchDao()) {
		this.userDao = userDao;
		this.matchDao = matchDao;
		this.soloGameDao = soloGameDao;
	}

	async getUserById(id) {
		if (!id) {
			throw new Error("User id is required");
		}
		const user = await this.userDao.findById(id);
		const matchHistory = await this.matchDao.findByPlayerId(id);
		user.matchHistory = matchHistory;
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}

	async getUserByName(name) {
		if (!name) {
			throw new Error("name is required");
		}
		const user = await this.userDao.findByName(name);
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}

	async userExistsByName(name) {
		try {
			if (!name) {
				return false;
			}
			const user = await this.userDao.findByName(name);
			return !!user;
		} catch (error) {
			return false;
		}
	}

	async userExistsById(id) {
		try {
			if (!id) {
				return false;
			}
			const user = await this.userDao.findById(id);
			return !!user;
		} catch (error) {
			return false;
		}
	}

	async createUser(name) {
		if (!name || name.length > 16) {
			throw new Error("Invalid name");
		}
		const exists = await this.userExistsByName(name);
		if (exists) {
			throw new Error("User already exists");
		}
		const user = await this.userDao.create({
			name: name,
			multiplayerWins: 0,
			multiPlayerLosses: "0"
		});
		return user;
	}

	async addMatchHistory(userId, match) {
		if (!userId || !match) {
			throw new Error("userId and match are required");
		}
		const user = await this.userDao.findById(userId);
		if (!user) {
			throw new Error("User not found");
		}
		return this.matchDao.create({
			player1Id: user.id,
			player2Id: user.id,
			winnerId: match.winnerId || null,
			rngSeed: match.rngSeed ?? Date.now(),
			status: match.status
		});
	}

	async getMatchHistory(userId) {
		if (!userId) {
			throw new Error("userId is required");
		}
		return this.matchDao.findByPlayerId(userId);
	}

	async updateStatsById(userId, isWinner) {
		const user = await this.userDao.findById(userId);
		if (!user) {
			throw new Error("User not found");
		}
		const wins = user.multiplayerWins || 0;
		const lossesParsed = user.multiPlayerLosses ? parseInt(user.multiPlayerLosses, 10) || 0 : 0;
		const updates = {
			multiplayerWins: isWinner ? wins + 1 : wins,
			multiPlayerLosses: (!isWinner ? lossesParsed + 1 : lossesParsed).toString()
		};
		return this.userDao.updateById(user.id, updates);
	}
}

const userDao = new UserDao();
const userService = new UserService(userDao);

export default userService;
