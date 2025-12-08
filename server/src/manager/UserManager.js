/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   UserManager.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/23 10:24:03 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 12:52:22 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const dbPath = "./src/db/db.json";

const userStructure = {
	id: "string",
	username: "string",
	numberOfWins: "number",
	numberOfLosses: "number",
	totalGames: "number"
};

export class UserManager {
	constructor() {
		this.db = fs.readFileSync(dbPath, "utf8");
	}

	getUserByUsername = async (username) => {
		if (username) {
			const data = fs.readFileSync(dbPath, "utf8");
			const trimmedData = data.trim();
			if (!trimmedData) {
				throw new Error("User not found");
			}
			const userData = JSON.parse(trimmedData);
			if (!Array.isArray(userData)) {
				throw new Error("User not found");
			}
			const user = userData.find((user) => user.username === username);
			if (!user) throw new Error("User not found");
			return user;
		}
		throw new Error("Username is required");
	};

	userAlreadyExists = async (username) => {
		try {
			const data = fs.readFileSync(dbPath, "utf8");
			const trimmedData = data.trim();
			if (!trimmedData) {
				return false;
			}
			const userData = JSON.parse(trimmedData);
			if (!Array.isArray(userData)) {
				return false;
			}
			const user = userData.find((user) => user.username === username);
			return !!user;
		} catch (error) {
			throw new Error("Error checking if user exists");
		}
	};

	create = async (username) => {
		console.log("create user", username);
		if (username.length <= 16) {
			const id = uuidv4();
			const data = fs.readFileSync(dbPath, "utf8");
			const trimmedData = data.trim();
			const userData = trimmedData ? JSON.parse(trimmedData) : [];
			userData.push({ id, username, numberOfWins: 0, numberOfLosses: 0, totalGames: 0, matchHistory: [] });
			fs.writeFileSync(dbPath, JSON.stringify(userData, null, 2));

			return id;
		} else {
			console.log("Invalid username/password");
			throw new Error("Invalid username/password");
		}
	};

	createHistoryMatch = async (username, historyMatch) => {
		if (username && historyMatch) {
			const data = fs.readFileSync(dbPath, "utf8");
			const trimmedData = data.trim();
			const userData = trimmedData ? JSON.parse(trimmedData) : [];
			userData.push({ id, username, numberOfWins: 0, numberOfLosses: 0, totalGames: 0, matchHistory: [] });
			fs.writeFileSync(dbPath, JSON.stringify(userData, null, 2));
		}
		throw new Error("Username and historyMatch are required");
	};

	getHistoryMatchByUsername = async (username) => {
		if (username) {
			const data = fs.readFileSync(dbPath, "utf8");
			const trimmedData = data.trim();
			const userData = trimmedData ? JSON.parse(trimmedData) : [];
			return userData.find((user) => user.username === username).matchHistory;
		}
		throw new Error("Username is required");
	};
}
