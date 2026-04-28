/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userService.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:11:03 by npatron           #+#    #+#             */
/*   Updated: 2026/02/09 09:56:25 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { UserDao } from "../dao/userDao.js";
import { MatchDao } from "../dao/matchDao.js";
import { MatchPlayerDao } from "../dao/matchPlayerDao.js";
import { SoloGameDao } from "../dao/soloGameDao.js";
import { isUserNameFormatValid, parseUserName } from "../utils/userName.js";

export class UserService {
    constructor(userDao, matchDao, soloGameDao, matchPlayerDao) {
        this.userDao = userDao || new UserDao();
        this.matchDao = matchDao || new MatchDao();
        this.soloGameDao = soloGameDao || new SoloGameDao();
        this.matchPlayerDao = matchPlayerDao || new MatchPlayerDao();
    }

    async getUserById(id) {
        if (!id) {
            throw new Error("User id is required");
        }
        const user = await this.userDao.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        const [matchHistory, soloGameHistory, matchPlayers] = await Promise.all([
            this.matchDao.findByPlayerId(id),
            this.soloGameDao.findByUserId(id),
            this.matchPlayerDao.findByPlayerId(id),
        ]);
        user.matchHistory = matchHistory;
        user.soloGameHistory = soloGameHistory;
        user.matchPlayers = matchPlayers;
        return user;
    }

    async getUserByName(name) {
        const parsedName = parseUserName(name);
        if (!parsedName) {
            throw new Error("name is required");
        }
        const user = await this.userDao.findByName(parsedName);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }

    async userExistsByName(name) {
        try {
            const parsedName = parseUserName(name);
            if (!parsedName) {
                return false;
            }
            const user = await this.userDao.findByName(parsedName);
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
        const parsedName = parseUserName(name);
        if (!isUserNameFormatValid(parsedName)) {
            throw new Error("Invalid name");
        }
        const exists = await this.userExistsByName(parsedName);
        if (exists) {
            throw new Error("User already exists");
        }
        const user = await this.userDao.create({
            name: parsedName,
            multiplayerWins: 0,
            multiPlayerLosses: "0",
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
        if (match.rngSeed === undefined || match.rngSeed === null) {
            throw new Error("rngSeed is required");
        }
        return this.matchDao.create({
            player1Id: user.id,
            player2Id: user.id,
            winnerId: match.winnerId || null,
            rngSeed: match.rngSeed,
            status: match.status,
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
            multiPlayerLosses: (!isWinner ? lossesParsed + 1 : lossesParsed).toString(),
        };
        return this.userDao.updateById(user.id, updates);
    }
}

const userService = new UserService();

export default userService;
