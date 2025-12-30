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

import { v4 as uuidv4 } from "uuid";
import { prismaClient } from "../db/mainDbClientPrisma.js";

export class UserDao {
	constructor(dbClient = prismaClient) {
		this.db = dbClient;
	}

	async findAll() {
		return this.db.user.findMany();
	}

	async findByName(name) {
		if (!name) {
			return null;
		}
		return this.db.user.findFirst({
			where: { name }
		});
	}

	async findByUsername(username) {
		return this.findByName(username);
	}

	async findById(id) {
		if (!id) {
			return null;
		}
		return this.db.user.findUnique({
			where: { id }
		});
	}

	async create(user) {
		const { name, ...rest } = user;
		if (!name) {
			throw new Error("User name is required");
		}
		return this.db.user.create({
			data: {
				id: user.id || uuidv4(),
				name,
				...rest
			}
		});
	}

	async updateById(id, updates) {
		if (!id) {
			return null;
		}
		return this.db.user.update({
			where: { id },
			data: updates
		});
	}

	async updateByName(name, updates) {
		const existing = await this.findByName(name);
		if (!existing) {
			return null;
		}
		return this.updateById(existing.id, updates);
	}

	async update(username, updates) {
		return this.updateByName(username, updates);
	}
}

export default new UserDao();
