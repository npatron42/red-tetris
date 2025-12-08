/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   roomRepository.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 15:57:54 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 16:08:07 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { readJsonFile, writeJsonFile } from "../utils/fileStorage.js";

const dbPath = "./src/db/rooms.json";

export class RoomRepository {
	findAll() {
		return readJsonFile(dbPath);
	}

	findByName(name) {
		const rooms = readJsonFile(dbPath);
		return rooms.find((room) => room.name === name) || null;
	}

	create(room) {
		const rooms = readJsonFile(dbPath);
		rooms.push(room);
		writeJsonFile(dbPath, rooms);
		return room;
	}

	update(name, updates) {
		const rooms = readJsonFile(dbPath);
		const index = rooms.findIndex((room) => room.name === name);
		if (index === -1) {
			return null;
		}
		rooms[index] = { ...rooms[index], ...updates };
		writeJsonFile(dbPath, rooms);
		return rooms[index];
	}

	delete(name) {
		const rooms = readJsonFile(dbPath);
		const filtered = rooms.filter((room) => room.name !== name);
		writeJsonFile(dbPath, filtered);
		return true;
	}
}

export default new RoomRepository();
