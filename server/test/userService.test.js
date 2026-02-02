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

test("UserService.getUserByUsername requires a name", async () => {
    const userDao = { findByName: createSpy(async () => ({ id: "user-1" })) };
    const service = new UserService(userDao, {});

    await assert.rejects(() => service.getUserByUsername(), /Username is required/);
});

test("UserService.getUserByUsername throws when user missing", async () => {
    const userDao = { findByName: createSpy(async () => null) };
    const service = new UserService(userDao, {});

    await assert.rejects(() => service.getUserByUsername("alice"), /User not found/);
});

test("UserService.getUserByUsername returns user", async () => {
    const user = { id: "user-1", name: "alice" };
    const userDao = { findByName: createSpy(async () => user) };
    const service = new UserService(userDao, {});

    const result = await service.getUserByUsername("alice");

    assert.equal(result, user);
});

test("UserService.userExists returns false for missing name", async () => {
    const userDao = { findByName: createSpy(async () => ({ id: "user-1" })) };
    const service = new UserService(userDao, {});

    const result = await service.userExists();

    assert.equal(result, false);
    assert.equal(userDao.findByName.calls.length, 0);
});

test("UserService.userExists returns true when user exists", async () => {
    const userDao = { findByName: createSpy(async () => ({ id: "user-1" })) };
    const service = new UserService(userDao, {});

    const result = await service.userExists("alice");

    assert.equal(result, true);
});

test("UserService.userExists returns false when user missing", async () => {
    const userDao = { findByName: createSpy(async () => null) };
    const service = new UserService(userDao, {});

    const result = await service.userExists("alice");

    assert.equal(result, false);
});

test("UserService.getUserById requires an id", async () => {
    const userDao = { findById: createSpy(async () => ({ id: "user-1" })) };
    const service = new UserService(userDao, {});

    await assert.rejects(() => service.getUserById(), /User id is required/);
});

test("UserService.getUserById throws when user missing", async () => {
    const userDao = { findById: createSpy(async () => null) };
    const service = new UserService(userDao, {});

    await assert.rejects(() => service.getUserById("user-1"), /User not found/);
});

test("UserService.getUserById returns user", async () => {
    const user = { id: "user-1", name: "alice" };
    const userDao = { findById: createSpy(async () => user) };
    const service = new UserService(userDao, {});

    const result = await service.getUserById("user-1");

    assert.equal(result, user);
});

test("UserService.createUser rejects invalid names", async () => {
    const userDao = { findByName: createSpy(async () => null), create: createSpy(async () => ({})) };
    const service = new UserService(userDao, {});

    await assert.rejects(() => service.createUser(""), /Invalid name/);
    await assert.rejects(() => service.createUser("this-name-is-way-too-long"), /Invalid name/);
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

test("UserService.addMatchHistory requires name and match", async () => {
    const userDao = { findByName: createSpy(async () => ({ id: "user-1" })) };
    const matchDao = { create: createSpy(async () => ({})) };
    const service = new UserService(userDao, matchDao);

    await assert.rejects(() => service.addMatchHistory(null, {}), /Username and match are required/);
    await assert.rejects(() => service.addMatchHistory("alice"), /Username and match are required/);
});

test("UserService.addMatchHistory throws when user missing", async () => {
    const userDao = { findByName: createSpy(async () => null) };
    const matchDao = { create: createSpy(async () => ({})) };
    const service = new UserService(userDao, matchDao);

    await assert.rejects(() => service.addMatchHistory("alice", { rngSeed: 1 }), /User not found/);
    assert.equal(matchDao.create.calls.length, 0);
});

test("UserService.addMatchHistory uses winner id when user wins", async () => {
    const user = { id: "user-1", name: "alice" };
    const userDao = { findByName: createSpy(async () => user) };
    const matchDao = { create: createSpy(async data => data) };
    const service = new UserService(userDao, matchDao);

    const result = await service.addMatchHistory("alice", { winner: "alice", rngSeed: 123, status: "FINISHED" });

    assert.equal(result.winnerId, "user-1");
    assert.equal(matchDao.create.calls[0][0].rngSeed, 123);
});

test("UserService.addMatchHistory sets winnerId to null when user loses", async () => {
    const user = { id: "user-1", name: "alice" };
    const userDao = { findByName: createSpy(async () => user) };
    const matchDao = { create: createSpy(async data => data) };
    const service = new UserService(userDao, matchDao);

    const result = await service.addMatchHistory("alice", { winner: "bob", rngSeed: 456 });

    assert.equal(result.winnerId, null);
});

test("UserService.addMatchHistory defaults winner and rngSeed", async () => {
    const user = { id: "user-1", name: "alice" };
    const userDao = { findByName: createSpy(async () => user) };
    const matchDao = { create: createSpy(async data => data) };
    const service = new UserService(userDao, matchDao);

    const result = await service.addMatchHistory("alice", { players: ["alice", "bob"] });

    assert.equal(result.winnerId, "user-1");
    assert.equal(typeof matchDao.create.calls[0][0].rngSeed, "number");
});

test("UserService.getMatchHistory requires name", async () => {
    const userDao = { findByName: createSpy(async () => ({ id: "user-1" })) };
    const matchDao = { findByUsername: createSpy(async () => []) };
    const service = new UserService(userDao, matchDao);

    await assert.rejects(() => service.getMatchHistory(), /Username is required/);
});

test("UserService.getMatchHistory returns matches", async () => {
    const matches = [{ id: "match-1" }];
    const userDao = { findByName: createSpy(async () => ({ id: "user-1" })) };
    const matchDao = { findByUsername: createSpy(async () => matches) };
    const service = new UserService(userDao, matchDao);

    const result = await service.getMatchHistory("alice");

    assert.equal(result, matches);
});

test("UserService.updateStats throws when user missing", async () => {
    const userDao = { findByName: createSpy(async () => null) };
    const service = new UserService(userDao, {});

    await assert.rejects(() => service.updateStats("alice", true), /User not found/);
});

test("UserService.updateStats increments wins for winners", async () => {
    const user = { name: "alice", multiplayerWins: 2, multiPlayerLosses: "3" };
    const update = createSpy(async (name, updates) => ({ name, ...updates }));
    const userDao = { findByName: createSpy(async () => user), update };
    const service = new UserService(userDao, {});

    const result = await service.updateStats("alice", true);

    assert.equal(result.multiplayerWins, 3);
    assert.equal(result.multiPlayerLosses, "3");
    assert.deepEqual(update.calls[0], ["alice", { multiplayerWins: 3, multiPlayerLosses: "3" }]);
});

test("UserService.updateStats increments losses for losers", async () => {
    const user = { name: "alice", multiplayerWins: 0, multiPlayerLosses: "nope" };
    const update = createSpy(async (name, updates) => ({ name, ...updates }));
    const userDao = { findByName: createSpy(async () => user), update };
    const service = new UserService(userDao, {});

    const result = await service.updateStats("alice", false);

    assert.equal(result.multiplayerWins, 0);
    assert.equal(result.multiPlayerLosses, "1");
    assert.deepEqual(update.calls[0], ["alice", { multiplayerWins: 0, multiPlayerLosses: "1" }]);
});
