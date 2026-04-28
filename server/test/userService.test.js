/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userService.test.js                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/12 03:02:02 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 15:25:48 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createSpy } from "./testUtils.js";

process.env.DATABASE_URL;

const { UserService } = await import("../src/services/userService.js");
const { parseUserName } = await import("../src/utils/userName.js");

test("parseUserName returns an URL-safe user name", () => {
    assert.equal(parseUserName("  drôle player !! / one  "), "drole-player-one");
    assert.equal(parseUserName("___"), "");
    assert.equal(parseUserName("a".repeat(24)), "a".repeat(16));
});

test("UserService.getUserByName requires a name", async () => {
    const userDao = { findByName: createSpy(async () => ({ id: "user-1" })) };
    const service = new UserService(userDao, {});

    await assert.rejects(() => service.getUserByName(), /name is required/);
});

test("UserService.getUserByName throws when user missing", async () => {
    const userDao = { findByName: createSpy(async () => null) };
    const service = new UserService(userDao, {});

    await assert.rejects(() => service.getUserByName("alice"), /User not found/);
});

test("UserService.getUserByName returns user", async () => {
    const user = { id: "user-1", name: "alice" };
    const userDao = { findByName: createSpy(async () => user) };
    const service = new UserService(userDao, {});

    const result = await service.getUserByName("alice");

    assert.equal(result, user);
});

test("UserService.getUserByName searches with the parsed user name", async () => {
    const user = { id: "user-1", name: "drole-player" };
    const findByName = createSpy(async () => user);
    const userDao = { findByName };
    const service = new UserService(userDao, {});

    const result = await service.getUserByName(" drôle player!! ");

    assert.equal(result, user);
    assert.deepEqual(findByName.calls[0], ["drole-player"]);
});

test("UserService.userExistsByName returns false for missing name", async () => {
    const userDao = { findByName: createSpy(async () => ({ id: "user-1" })) };
    const service = new UserService(userDao, {});

    const result = await service.userExistsByName();

    assert.equal(result, false);
    assert.equal(userDao.findByName.calls.length, 0);
});

test("UserService.userExistsByName returns true when user exists", async () => {
    const userDao = { findByName: createSpy(async () => ({ id: "user-1" })) };
    const service = new UserService(userDao, {});

    const result = await service.userExistsByName("alice");

    assert.equal(result, true);
});

test("UserService.userExistsByName returns false when user missing", async () => {
    const userDao = { findByName: createSpy(async () => null) };
    const service = new UserService(userDao, {});

    const result = await service.userExistsByName("alice");

    assert.equal(result, false);
});

test("UserService.getUserById requires an id", async () => {
    const userDao = { findById: createSpy(async () => ({ id: "user-1" })) };
    const service = new UserService(userDao, {}, {});

    await assert.rejects(() => service.getUserById(), /User id is required/);
});

test("UserService.getUserById throws when user missing", async () => {
    const userDao = { findById: createSpy(async () => null) };
    const matchDao = { findByPlayerId: createSpy(async () => []) };
    const soloGameDao = { findByUserId: createSpy(async () => []) };
    const service = new UserService(userDao, matchDao, soloGameDao);

    await assert.rejects(() => service.getUserById("user-1"), /User not found/);
});

test("UserService.getUserById returns user with history", async () => {
    const user = { id: "user-1", name: "alice" };
    const userDao = { findById: createSpy(async () => user) };
    const matchDao = { findByPlayerId: createSpy(async () => []) };
    const soloGameDao = { findByUserId: createSpy(async () => []) };
    const service = new UserService(userDao, matchDao, soloGameDao);

    const result = await service.getUserById("user-1");

    assert.equal(result.id, "user-1");
    assert.deepEqual(result.matchHistory, []);
    assert.deepEqual(result.soloGameHistory, []);
});

test("UserService.createUser rejects invalid names", async () => {
    const userDao = { findByName: createSpy(async () => null), create: createSpy(async () => ({})) };
    const service = new UserService(userDao, {});

    await assert.rejects(() => service.createUser(""), /Invalid name/);
    await assert.rejects(() => service.createUser("___"), /Invalid name/);
});

test("UserService.createUser rejects existing users", async () => {
    const userDao = { findByName: createSpy(async () => ({ id: "user-1" })) };
    const service = new UserService(userDao, {});

    await assert.rejects(() => service.createUser("alice"), /User already exists/);
});

test("UserService.createUser creates a new user", async () => {
    const create = createSpy(async user => user);
    const userDao = {
        findByName: createSpy(async () => null),
        create,
    };
    const service = new UserService(userDao, {});

    const result = await service.createUser("alice");

    assert.equal(result.name, "alice");
    assert.deepEqual(create.calls[0][0], {
        name: "alice",
        multiplayerWins: 0,
        multiPlayerLosses: "0",
    });
});

test("UserService.createUser stores the parsed user name", async () => {
    const create = createSpy(async user => user);
    const userDao = {
        findByName: createSpy(async () => null),
        create,
    };
    const service = new UserService(userDao, {});

    const result = await service.createUser("  drôle player!!  ");

    assert.equal(result.name, "drole-player");
    assert.deepEqual(create.calls[0][0], {
        name: "drole-player",
        multiplayerWins: 0,
        multiPlayerLosses: "0",
    });
});

test("UserService.addMatchHistory requires userId and match", async () => {
    const userDao = { findById: createSpy(async () => ({ id: "user-1" })) };
    const matchDao = { create: createSpy(async () => ({})) };
    const service = new UserService(userDao, matchDao);

    await assert.rejects(() => service.addMatchHistory(null, {}), /userId and match are required/);
    await assert.rejects(() => service.addMatchHistory("user-1"), /userId and match are required/);
});

test("UserService.addMatchHistory throws when user missing", async () => {
    const userDao = { findById: createSpy(async () => null) };
    const matchDao = { create: createSpy(async () => ({})) };
    const service = new UserService(userDao, matchDao);

    await assert.rejects(() => service.addMatchHistory("user-1", { rngSeed: 1 }), /User not found/);
    assert.equal(matchDao.create.calls.length, 0);
});

test("UserService.addMatchHistory creates a match record", async () => {
    const user = { id: "user-1", name: "alice" };
    const userDao = { findById: createSpy(async () => user) };
    const matchDao = { create: createSpy(async data => data) };
    const service = new UserService(userDao, matchDao);

    const result = await service.addMatchHistory("user-1", { winnerId: "user-1", rngSeed: 123, status: "COMPLETED" });

    assert.equal(result.player1Id, "user-1");
    assert.equal(matchDao.create.calls[0][0].rngSeed, 123);
});

test("UserService.getMatchHistory requires userId", async () => {
    const userDao = { findById: createSpy(async () => ({ id: "user-1" })) };
    const matchDao = { findByPlayerId: createSpy(async () => []) };
    const service = new UserService(userDao, matchDao);

    await assert.rejects(() => service.getMatchHistory(), /userId is required/);
});

test("UserService.getMatchHistory returns matches", async () => {
    const matches = [{ id: "match-1" }];
    const userDao = { findById: createSpy(async () => ({ id: "user-1" })) };
    const matchDao = { findByPlayerId: createSpy(async () => matches) };
    const service = new UserService(userDao, matchDao);

    const result = await service.getMatchHistory("user-1");

    assert.equal(result, matches);
});

test("UserService.updateStatsById throws when user missing", async () => {
    const userDao = { findById: createSpy(async () => null) };
    const service = new UserService(userDao, {});

    await assert.rejects(() => service.updateStatsById("user-1", true), /User not found/);
});

test("UserService.updateStatsById increments wins for winners", async () => {
    const user = { id: "user-1", name: "alice", multiplayerWins: 2, multiPlayerLosses: "3" };
    const updateById = createSpy(async (id, updates) => ({ id, ...updates }));
    const userDao = { findById: createSpy(async () => user), updateById };
    const service = new UserService(userDao, {});

    const result = await service.updateStatsById("user-1", true);

    assert.equal(result.multiplayerWins, 3);
    assert.equal(result.multiPlayerLosses, "3");
    assert.deepEqual(updateById.calls[0], ["user-1", { multiplayerWins: 3, multiPlayerLosses: "3" }]);
});

test("UserService.updateStatsById increments losses for losers", async () => {
    const user = { id: "user-1", name: "alice", multiplayerWins: 0, multiPlayerLosses: "2" };
    const updateById = createSpy(async (id, updates) => ({ id, ...updates }));
    const userDao = { findById: createSpy(async () => user), updateById };
    const service = new UserService(userDao, {});

    const result = await service.updateStatsById("user-1", false);

    assert.equal(result.multiplayerWins, 0);
    assert.equal(result.multiPlayerLosses, "3");
    assert.deepEqual(updateById.calls[0], ["user-1", { multiplayerWins: 0, multiPlayerLosses: "3" }]);
});
