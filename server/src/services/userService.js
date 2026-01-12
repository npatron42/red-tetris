/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userService.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:11:03 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 03:06:33 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { UserDao } from "../dao/userDao.js";
import { MatchDao } from "../dao/matchDao.js";

export class UserService {
	constructor(userDao, matchDao = new MatchDao()) {
		this.userDao = userDao;
		this.matchDao = matchDao;
	}

	async getUserByUsername(username) {
		if (!username) {
			throw new Error("Username is required");
		}
		const user = await this.userDao.findByName(username);
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}

	async userExists(username) {
		try {
			if (!username) {
				return false;
			}
			const user = await this.userDao.findByName(username);
			if (!user) {
				return false;
			}
			return true;
		} catch (error) {
			console.log("userExists ICI 0", error);
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

	async createUser(username) {
		console.log("createUser ICI", username);
		if (!username || username.length > 16) {
			throw new Error("Invalid username");
		}
		const exists = await this.userExists(username);
		if (exists) {
			throw new Error("User already exists");
		}
		const user = await this.userDao.create({
			name: username,
			multiplayerWins: 0,
			multiPlayerLosses: "0"
		});
		return user;
	}

	async addMatchHistory(username, match) {
		if (!username || !match) {
			throw new Error("Username and match are required");
		}
		const user = await this.userDao.findByName(username);
		if (!user) {
			throw new Error("User not found");
		}
		const players = Array.isArray(match.players) ? match.players : [username];
		const winner = match.winner ?? username;
		return this.matchDao.create({
			player1Id: user.id,
			player2Id: user.id,
			winnerId: winner === username ? user.id : null,
			rngSeed: match.rngSeed ?? Date.now(),
			status: match.status
		});
	}

	async getMatchHistory(username) {
		if (!username) {
			throw new Error("Username is required");
		}
		return this.matchDao.findByUsername(username);
	}

	async updateStats(username, isWinner) {
		const user = await this.userDao.findByName(username);
		if (!user) {
			throw new Error("User not found");
		}
		const wins = user.multiplayerWins || 0;
		const lossesParsed = user.multiPlayerLosses ? parseInt(user.multiPlayerLosses, 10) || 0 : 0;
		const updates = {
			multiplayerWins: isWinner ? wins + 1 : wins,
			multiPlayerLosses: (!isWinner ? lossesParsed + 1 : lossesParsed).toString()
		};
		return this.userDao.update(username, updates);
	}
}

const userDao = new UserDao();
const userService = new UserService(userDao);

export default userService;
