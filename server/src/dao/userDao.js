/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   UserDao.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 15:58:08 by npatron           #+#    #+#             */
/*   Updated: 2025/12/09 17:59:55 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { readJsonFile, writeJsonFile } from "../utils/fileStorage.js";

const dbPath = "./src/db/users.json";

export class UserDao {
	findAll() {
		return readJsonFile(dbPath);
	}

	findByUsername(username) {
		const users = readJsonFile(dbPath);
		return users.find((user) => user.username === username) || null;
	}

	create(user) {
		const users = readJsonFile(dbPath);
		users.push(user);
		writeJsonFile(dbPath, users);
		return user;
	}

	update(username, updates) {
		const users = readJsonFile(dbPath);
		const index = users.findIndex((user) => user.username === username);
		if (index === -1) {
			return null;
		}
		users[index] = { ...users[index], ...updates };
		writeJsonFile(dbPath, users);
		return users[index];
	}

	updateAll(users) {
		writeJsonFile(dbPath, users);
	}
}

export default new UserDao();
