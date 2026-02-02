/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   UserDao.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 15:58:08 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 14:25:07 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { v4 as uuidv4 } from "uuid";
import { prismaClient } from "../db/mainDbClientPrisma.js";

export class UserDao {
    constructor(dbClient = prismaClient) {
        this.db = dbClient;
    }

    async findAll() {
        try {
            return await this.db.user.findMany();
        } catch (error) {
            console.error("UserDao.findAll error:", error.message);
            throw new Error(`Failed to fetch all users: ${error.message}`);
        }
    }

    async findByName(name) {
        if (!name) {
            return null;
        }
        try {
            return await this.db.user.findFirst({
                where: { name },
            });
        } catch (error) {
            console.error("UserDao.findByName error:", error.message);
            throw new Error(`Failed to find user by name '${name}': ${error.message}`);
        }
    }

    async findByname(name) {
        return this.findByName(name);
    }

    async findById(id) {
        if (!id) {
            return null;
        }
        try {
            return await this.db.user.findUnique({
                where: { id },
            });
        } catch (error) {
            console.error("UserDao.findById error:", error.message);
            throw new Error(`Failed to find user by id '${id}': ${error.message}`);
        }
    }

    async create(user) {
        const { name, ...rest } = user;
        if (!name) {
            throw new Error("User name is required");
        }
        try {
            return await this.db.user.create({
                data: {
                    id: user.id || uuidv4(),
                    name,
                    ...rest,
                },
            });
        } catch (error) {
            console.error("UserDao.create error:", error.message);
            throw new Error(`Failed to create user '${name}': ${error.message}`);
        }
    }

    async updateById(id, updates) {
        if (!id) {
            return null;
        }
        try {
            return await this.db.user.update({
                where: { id },
                data: updates,
            });
        } catch (error) {
            console.error("UserDao.updateById error:", error.message);
            throw new Error(`Failed to update user '${id}': ${error.message}`);
        }
    }

    async updateByName(name, updates) {
        try {
            const existing = await this.findByName(name);
            if (!existing) {
                return null;
            }
            return await this.updateById(existing.id, updates);
        } catch (error) {
            console.error("UserDao.updateByName error:", error.message);
            throw new Error(`Failed to update user by name '${name}': ${error.message}`);
        }
    }

    async update(name, updates) {
        return this.updateByName(name, updates);
    }

    async delete(id) {
        if (!id) {
            return false;
        }
        try {
            await this.db.user.delete({
                where: { id },
            });
            return true;
        } catch (error) {
            console.error("UserDao.delete error:", error.message);
            return false;
        }
    }

    async deleteByName(name) {
        try {
            const existing = await this.findByName(name);
            if (!existing) {
                return false;
            }
            return await this.delete(existing.id);
        } catch (error) {
            console.error("UserDao.deleteByName error:", error.message);
            return false;
        }
    }
}

export default new UserDao();
