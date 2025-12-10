/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userService.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:11:03 by npatron           #+#    #+#             */
/*   Updated: 2025/12/09 17:59:00 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { v4 as uuidv4 } from "uuid";
import userDao from "../dao/UserDao.js";

export class UserService {
	async getUserByUsername(username) {
		if (!username) {
			throw new Error("Username is required");
		}
		const user = userDao.findByUsername(username);
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}

	async userExists(username) {
		if (!username) {
			return false;
		}
		const user = userDao.findByUsername(username);
		return !!user;
	}

	async createUser(username) {
		if (!username || username.length > 16) {
			throw new Error("Invalid username");
		}
		const exists = await this.userExists(username);
		if (exists) {
			throw new Error("User already exists");
		}
		const user = {
			id: uuidv4(),
			username,
			numberOfWins: 0,
			numberOfLosses: 0,
			totalGames: 0,
			matchHistory: []
		};
		userDao.create(user);
		return user.id;
	}

	async addMatchHistory(username, match) {
		if (!username || !match) {
			throw new Error("Username and match are required");
		}
		const user = userDao.findByUsername(username);
		if (!user) {
			throw new Error("User not found");
		}
		if (!user.matchHistory) {
			user.matchHistory = [];
		}
		user.matchHistory.push(match);
		userDao.update(username, { matchHistory: user.matchHistory });
		return match;
	}

	async getMatchHistory(username) {
		if (!username) {
			throw new Error("Username is required");
		}
		const user = userDao.findByUsername(username);
		if (!user || !user.matchHistory) {
			return [];
		}
		return user.matchHistory;
	}

	async updateStats(username, isWinner) {
		const user = userDao.findByUsername(username);
		if (!user) {
			throw new Error("User not found");
		}
		const updates = {
			totalGames: (user.totalGames || 0) + 1,
			numberOfWins: isWinner ? (user.numberOfWins || 0) + 1 : user.numberOfWins || 0,
			numberOfLosses: !isWinner ? (user.numberOfLosses || 0) + 1 : user.numberOfLosses || 0
		};
		return userDao.update(username, updates);
	}
}

export default new UserService();
