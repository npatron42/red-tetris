/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userService.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:11:03 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 14:27:52 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { UserDao } from "../dao/UserDao.js";
import { MatchDao } from "../dao/matchDao.js";

export class UserService {
	constructor(userDao, matchDao = new MatchDao()) {
		this.userDao = userDao;
		this.matchDao = matchDao;
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

	async userExists(name) {
		try {
			if (!name) {
				return false;
			}
			const user = await this.userDao.findByName(name);
			if (!user) {
				return false;
			}
			return true;
		} catch (error) {
			return false;
		}
	}

	async getUserById(id) {
		if (!id) {
			throw new Error("User id is required");
		}
		const user = await this.userDao.findById(id);
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}

	async createUser(name) {
		if (!name || name.length > 16) {
			throw new Error("Invalid name");
		}
		const exists = await this.userExists(name);
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

	async addMatchHistory(name, match) {
		if (!name || !match) {
			throw new Error("name and match are required");
		}
		const user = await this.userDao.findByName(name);
		if (!user) {
			throw new Error("User not found");
		}
		const players = Array.isArray(match.players) ? match.players : [name];
		const winner = match.winner ?? name;
		return this.matchDao.create({
			player1Id: user.id,
			player2Id: user.id,
			winnerId: winner === name ? user.id : null,
			rngSeed: match.rngSeed ?? Date.now(),
			status: match.status
		});
	}

	async getMatchHistory(name) {
		if (!name) {
			throw new Error("name is required");
		}
		return this.matchDao.findByname(name);
	}

	async updateStats(name, isWinner) {
		const user = await this.userDao.findByName(name);
		if (!user) {
			throw new Error("User not found");
		}
		const wins = user.multiplayerWins || 0;
		const lossesParsed = user.multiPlayerLosses ? parseInt(user.multiPlayerLosses, 10) || 0 : 0;
		const updates = {
			multiplayerWins: isWinner ? wins + 1 : wins,
			multiPlayerLosses: (!isWinner ? lossesParsed + 1 : lossesParsed).toString()
		};
		return this.userDao.update(name, updates);
	}
}

const userDao = new UserDao();
const userService = new UserService(userDao);

export default userService;
