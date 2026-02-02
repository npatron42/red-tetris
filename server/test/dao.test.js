/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   dao.test.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/12 02:56:25 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 15:25:48 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createSpy } from "./testUtils.js";

process.env.DATABASE_URL;

const { GameDao } = await import("../src/dao/gameDao.js");
const { UserDao } = await import("../src/dao/userDao.js");
const { RoomDao } = await import("../src/dao/roomDao.js");
const { MatchDao } = await import("../src/dao/matchDao.js");

test("GameDao.findAll returns all games", async () => {
    const expected = [{ id: "game-1" }];
    const findMany = createSpy(async () => expected);
    const dao = new GameDao({ soloGame: { findMany } });

    const result = await dao.findAll();

    assert.equal(result, expected);
    assert.equal(findMany.calls.length, 1);
});

test("GameDao.findById returns null when missing id", async () => {
    const findUnique = createSpy(async () => ({ id: "game-1" }));
    const dao = new GameDao({ soloGame: { findUnique } });

    const result = await dao.findById();

    assert.equal(result, null);
    assert.equal(findUnique.calls.length, 0);
});

test("GameDao.findById fetches by id", async () => {
    const expected = { id: "game-1" };
    const findUnique = createSpy(async () => expected);
    const dao = new GameDao({ soloGame: { findUnique } });

    const result = await dao.findById("game-1");

    assert.equal(result, expected);
    assert.deepEqual(findUnique.calls[0][0], { where: { id: "game-1" } });
});

test("GameDao.create prefers gameId when present", async () => {
    const create = createSpy(async args => args);
    const dao = new GameDao({ soloGame: { create } });

    const result = await dao.create({ gameId: "game-1", status: "IN_PROGRESS" });

    assert.equal(result.data.id, "game-1");
    assert.equal(result.data.status, "IN_PROGRESS");
});

test("GameDao.create falls back to id", async () => {
    const create = createSpy(async args => args);
    const dao = new GameDao({ soloGame: { create } });

    const result = await dao.create({ id: "game-2", status: "DONE" });

    assert.equal(result.data.id, "game-2");
    assert.equal(result.data.status, "DONE");
});

test("GameDao.create requires an id", async () => {
    const create = createSpy(async args => args);
    const dao = new GameDao({ soloGame: { create } });

    await assert.rejects(() => dao.create({ status: "IN_PROGRESS" }), /Game ID is required/);
    assert.equal(create.calls.length, 0);
});

test("GameDao.update returns updated game", async () => {
    const update = createSpy(async args => args);
    const dao = new GameDao({ soloGame: { update } });

    const result = await dao.update("game-1", { status: "DONE" });

    assert.equal(result.data.status, "DONE");
    assert.deepEqual(update.calls[0][0], { where: { id: "game-1" }, data: { status: "DONE" } });
});

test("GameDao.update returns null on errors", async () => {
    const update = createSpy(async () => {
        throw new Error("boom");
    });
    const dao = new GameDao({ soloGame: { update } });

    const result = await dao.update("game-1", { status: "DONE" });

    assert.equal(result, null);
});

test("GameDao.delete returns true on success", async () => {
    const del = createSpy(async () => undefined);
    const dao = new GameDao({ soloGame: { delete: del } });

    const result = await dao.delete("game-1");

    assert.equal(result, true);
    assert.deepEqual(del.calls[0][0], { where: { id: "game-1" } });
});

test("GameDao.delete returns false on errors", async () => {
    const del = createSpy(async () => {
        throw new Error("boom");
    });
    const dao = new GameDao({ soloGame: { delete: del } });

    const result = await dao.delete("game-1");

    assert.equal(result, false);
});

test("UserDao.findByName returns null when missing name", async () => {
    const findFirst = createSpy(async () => ({ id: "user-1" }));
    const dao = new UserDao({ user: { findFirst } });

    const result = await dao.findByName("");

    assert.equal(result, null);
    assert.equal(findFirst.calls.length, 0);
});

test("UserDao.findAll returns users", async () => {
    const expected = [{ id: "user-1" }];
    const findMany = createSpy(async () => expected);
    const dao = new UserDao({ user: { findMany } });

    const result = await dao.findAll();

    assert.equal(result, expected);
    assert.equal(findMany.calls.length, 1);
});

test("UserDao.findByName fetches by name", async () => {
    const expected = { id: "user-1", name: "alice" };
    const findFirst = createSpy(async () => expected);
    const dao = new UserDao({ user: { findFirst } });

    const result = await dao.findByName("alice");

    assert.equal(result, expected);
    assert.deepEqual(findFirst.calls[0][0], { where: { name: "alice" } });
});

test("UserDao.findByUsername delegates to findByName", async () => {
    const expected = { id: "user-1", name: "alice" };
    const findFirst = createSpy(async () => expected);
    const dao = new UserDao({ user: { findFirst } });

    const result = await dao.findByUsername("alice");

    assert.equal(result, expected);
});

test("UserDao.findById returns null when missing id", async () => {
    const findUnique = createSpy(async () => ({ id: "user-1" }));
    const dao = new UserDao({ user: { findUnique } });

    const result = await dao.findById();

    assert.equal(result, null);
    assert.equal(findUnique.calls.length, 0);
});

test("UserDao.findById fetches by id", async () => {
    const expected = { id: "user-1" };
    const findUnique = createSpy(async () => expected);
    const dao = new UserDao({ user: { findUnique } });

    const result = await dao.findById("user-1");

    assert.equal(result, expected);
    assert.deepEqual(findUnique.calls[0][0], { where: { id: "user-1" } });
});

test("UserDao.create requires a name", async () => {
    const create = createSpy(async args => args);
    const dao = new UserDao({ user: { create } });

    await assert.rejects(() => dao.create({}), /User name is required/);
    assert.equal(create.calls.length, 0);
});

test("UserDao.create sets id when provided", async () => {
    const create = createSpy(async args => args);
    const dao = new UserDao({ user: { create } });

    const result = await dao.create({ id: "user-1", name: "alice", email: "a@example.com" });

    assert.equal(result.data.id, "user-1");
    assert.equal(result.data.name, "alice");
    assert.equal(result.data.email, "a@example.com");
});

test("UserDao.create generates an id when missing", async () => {
    const create = createSpy(async args => args);
    const dao = new UserDao({ user: { create } });

    const result = await dao.create({ name: "alice" });

    assert.equal(typeof result.data.id, "string");
    assert.ok(result.data.id.length > 0);
    assert.equal(result.data.name, "alice");
});

test("UserDao.updateById returns null when missing id", async () => {
    const update = createSpy(async args => args);
    const dao = new UserDao({ user: { update } });

    const result = await dao.updateById();

    assert.equal(result, null);
    assert.equal(update.calls.length, 0);
});

test("UserDao.updateById updates by id", async () => {
    const update = createSpy(async args => args);
    const dao = new UserDao({ user: { update } });

    const result = await dao.updateById("user-1", { score: 10 });

    assert.equal(result.data.score, 10);
    assert.deepEqual(update.calls[0][0], { where: { id: "user-1" }, data: { score: 10 } });
});

test("UserDao.updateByName returns null when user missing", async () => {
    const findFirst = createSpy(async () => null);
    const update = createSpy(async args => args);
    const dao = new UserDao({ user: { findFirst, update } });

    const result = await dao.updateByName("missing", { score: 10 });

    assert.equal(result, null);
    assert.equal(update.calls.length, 0);
});

test("UserDao.updateByName updates when user exists", async () => {
    const findFirst = createSpy(async () => ({ id: "user-1" }));
    const update = createSpy(async args => args);
    const dao = new UserDao({ user: { findFirst, update } });

    const result = await dao.updateByName("alice", { score: 10 });

    assert.equal(result.data.score, 10);
    assert.deepEqual(update.calls[0][0], { where: { id: "user-1" }, data: { score: 10 } });
});

test("UserDao.update delegates to updateByName", async () => {
    const findFirst = createSpy(async () => ({ id: "user-1" }));
    const update = createSpy(async args => args);
    const dao = new UserDao({ user: { findFirst, update } });

    const result = await dao.update("alice", { score: 20 });

    assert.equal(result.data.score, 20);
});

test("RoomDao.findAll returns rooms", async () => {
    const expected = [{ id: "room-1" }];
    const findMany = createSpy(async () => expected);
    const dao = new RoomDao({ room: { findMany } });

    const result = await dao.findAll();

    assert.equal(result, expected);
    assert.equal(findMany.calls.length, 1);
});

test("RoomDao.findById returns null when missing id", async () => {
    const findUnique = createSpy(async () => ({ id: "room-1" }));
    const dao = new RoomDao({ room: { findUnique } });

    const result = await dao.findById();

    assert.equal(result, null);
    assert.equal(findUnique.calls.length, 0);
});

test("RoomDao.findById fetches by id", async () => {
    const expected = { id: "room-1" };
    const findUnique = createSpy(async () => expected);
    const dao = new RoomDao({ room: { findUnique } });

    const result = await dao.findById("room-1");

    assert.equal(result, expected);
    assert.deepEqual(findUnique.calls[0][0], { where: { id: "room-1" } });
});

test("RoomDao.findByName returns null when missing name", async () => {
    const findFirst = createSpy(async () => ({ id: "room-1" }));
    const dao = new RoomDao({ room: { findFirst } });

    const result = await dao.findByName("");

    assert.equal(result, null);
    assert.equal(findFirst.calls.length, 0);
});

test("RoomDao.findByName fetches by name", async () => {
    const expected = { id: "room-1", name: "Room One" };
    const findFirst = createSpy(async () => expected);
    const dao = new RoomDao({ room: { findFirst } });

    const result = await dao.findByName("Room One");

    assert.equal(result, expected);
    assert.deepEqual(findFirst.calls[0][0], { where: { name: "Room One" } });
});

test("RoomDao.resolveUserIdFromName returns null for missing name", async () => {
    const findFirst = createSpy(async () => ({ id: "user-1" }));
    const dao = new RoomDao({ user: { findFirst } });

    const result = await dao.resolveUserIdFromName();

    assert.equal(result, null);
    assert.equal(findFirst.calls.length, 0);
});

test("RoomDao.resolveUserIdFromName resolves user id", async () => {
    const findFirst = createSpy(async () => ({ id: "user-1" }));
    const dao = new RoomDao({ user: { findFirst } });

    const result = await dao.resolveUserIdFromName("alice");

    assert.equal(result, "user-1");
    assert.deepEqual(findFirst.calls[0][0], { where: { name: "alice" } });
});

test("RoomDao.resolveUserIdFromName returns null when user not found", async () => {
    const findFirst = createSpy(async () => null);
    const dao = new RoomDao({ user: { findFirst } });

    const result = await dao.resolveUserIdFromName("ghost");

    assert.equal(result, null);
    assert.equal(findFirst.calls.length, 1);
});

test("RoomDao.create requires a name", async () => {
    const create = createSpy(async args => args);
    const dao = new RoomDao({ room: { create } });

    await assert.rejects(() => dao.create({ leaderId: "leader-1" }), /name is required to create a room/);
    assert.equal(create.calls.length, 0);
});

test("RoomDao.create requires a leader", async () => {
    const findFirst = createSpy(async () => null);
    const create = createSpy(async args => args);
    const dao = new RoomDao({ user: { findFirst }, room: { create } });

    await assert.rejects(() => dao.create({ name: "room-1" }), /leaderId .* required/);
    assert.equal(create.calls.length, 0);
});

test("RoomDao.create resolves leader and opponent ids", async () => {
    const findFirst = createSpy(async ({ where }) => {
        if (where.name === "leader") return { id: "leader-1" };
        if (where.name === "opponent") return { id: "opponent-1" };
        return null;
    });
    const create = createSpy(async args => args);
    const dao = new RoomDao({ user: { findFirst }, room: { create } });

    const createdAt = new Date("2024-01-01T00:00:00Z");
    const result = await dao.create({
        id: "room-1",
        name: "Room One",
        leaderName: "leader",
        opponentName: "opponent",
        createdAt,
    });

    assert.equal(result.data.id, "room-1");
    assert.equal(result.data.leader_id, "leader-1");
    assert.equal(result.data.opponent_id, "opponent-1");
    assert.equal(result.data.created_at, createdAt);
});

test("RoomDao.update returns null when missing id", async () => {
    const update = createSpy(async args => args);
    const dao = new RoomDao({ room: { update } });

    const result = await dao.update();

    assert.equal(result, null);
    assert.equal(update.calls.length, 0);
});

test("RoomDao.update resolves leader name and uses opponentId", async () => {
    const findFirst = createSpy(async ({ where }) => {
        if (where.name === "leader") return { id: "leader-1" };
        return null;
    });
    const update = createSpy(async args => args);
    const dao = new RoomDao({ user: { findFirst }, room: { update } });

    const createdAt = new Date("2024-02-01T00:00:00Z");
    const result = await dao.update("room-1", {
        name: "Room One",
        leaderName: "leader",
        opponentId: "opponent-1",
        createdAt,
        gameStatus: "PLAYING",
    });

    assert.equal(result.data.leader_id, "leader-1");
    assert.equal(result.data.opponent_id, "opponent-1");
    assert.equal(result.data.name, "Room One");
    assert.equal(result.data.created_at, createdAt);
    assert.equal(result.data.gameStatus, "PLAYING");
});

test("RoomDao.update resolves opponent name when opponentId is undefined", async () => {
    const findFirst = createSpy(async ({ where }) => {
        if (where.name === "opponent") return { id: "opponent-1" };
        return null;
    });
    const update = createSpy(async args => args);
    const dao = new RoomDao({ user: { findFirst }, room: { update } });

    const result = await dao.update("room-1", { leaderId: "leader-1", opponentName: "opponent" });

    assert.equal(result.data.leader_id, "leader-1");
    assert.equal(result.data.opponent_id, "opponent-1");
});

test("RoomDao.updateByName returns null when room missing", async () => {
    const findFirst = createSpy(async () => null);
    const update = createSpy(async args => args);
    const dao = new RoomDao({ room: { findFirst, update } });

    const result = await dao.updateByName("missing", { name: "Room" });

    assert.equal(result, null);
    assert.equal(update.calls.length, 0);
});

test("RoomDao.updateByName updates when room exists", async () => {
    const findFirst = createSpy(async () => ({ id: "room-1" }));
    const update = createSpy(async args => args);
    const dao = new RoomDao({ room: { findFirst, update } });

    const result = await dao.updateByName("Room One", { name: "Room Two" });

    assert.equal(result.data.name, "Room Two");
});

test("RoomDao.delete returns false when missing id", async () => {
    const del = createSpy(async () => undefined);
    const dao = new RoomDao({ room: { delete: del } });

    const result = await dao.delete();

    assert.equal(result, false);
    assert.equal(del.calls.length, 0);
});

test("RoomDao.delete returns true on success", async () => {
    const del = createSpy(async () => undefined);
    const dao = new RoomDao({ room: { delete: del } });

    const result = await dao.delete("room-1");

    assert.equal(result, true);
});

test("RoomDao.delete returns false on errors", async () => {
    const del = createSpy(async () => {
        throw new Error("boom");
    });
    const dao = new RoomDao({ room: { delete: del } });

    const result = await dao.delete("room-1");

    assert.equal(result, false);
});

test("RoomDao.deleteByName returns false when room missing", async () => {
    const findFirst = createSpy(async () => null);
    const del = createSpy(async () => undefined);
    const dao = new RoomDao({ room: { findFirst, delete: del } });

    const result = await dao.deleteByName("missing");

    assert.equal(result, false);
    assert.equal(del.calls.length, 0);
});

test("RoomDao.deleteByName deletes when room exists", async () => {
    const findFirst = createSpy(async () => ({ id: "room-1" }));
    const del = createSpy(async () => undefined);
    const dao = new RoomDao({ room: { findFirst, delete: del } });

    const result = await dao.deleteByName("Room One");

    assert.equal(result, true);
});

test("MatchDao.findAll orders by created_at desc", async () => {
    const findMany = createSpy(async () => []);
    const dao = new MatchDao({ match: { findMany } });

    await dao.findAll();

    assert.deepEqual(findMany.calls[0][0], { orderBy: { created_at: "desc" } });
});

test("MatchDao.findById returns null when missing id", async () => {
    const findUnique = createSpy(async () => ({ id: "match-1" }));
    const dao = new MatchDao({ match: { findUnique } });

    const result = await dao.findById();

    assert.equal(result, null);
    assert.equal(findUnique.calls.length, 0);
});

test("MatchDao.findById fetches by id", async () => {
    const expected = { id: "match-1" };
    const findUnique = createSpy(async () => expected);
    const dao = new MatchDao({ match: { findUnique } });

    const result = await dao.findById("match-1");

    assert.equal(result, expected);
    assert.deepEqual(findUnique.calls[0][0], { where: { id: "match-1" } });
});

test("MatchDao.findByPlayerId returns empty array when missing id", async () => {
    const findMany = createSpy(async () => [{ id: "match-1" }]);
    const dao = new MatchDao({ match: { findMany } });

    const result = await dao.findByPlayerId();

    assert.deepEqual(result, []);
    assert.equal(findMany.calls.length, 0);
});

test("MatchDao.findByPlayerId fetches by player id", async () => {
    const expected = [{ id: "match-1" }];
    const findMany = createSpy(async () => expected);
    const dao = new MatchDao({ match: { findMany } });

    const result = await dao.findByPlayerId("player-1");

    assert.equal(result, expected);
    assert.deepEqual(findMany.calls[0][0], {
        where: { OR: [{ player1_id: "player-1" }, { player2_id: "player-1" }] },
        orderBy: { created_at: "desc" },
    });
});

test("MatchDao.findByUsername returns empty array when missing name", async () => {
    const findFirst = createSpy(async () => ({ id: "user-1" }));
    const dao = new MatchDao({ user: { findFirst } });

    const result = await dao.findByUsername();

    assert.deepEqual(result, []);
    assert.equal(findFirst.calls.length, 0);
});

test("MatchDao.findByUsername returns empty array when user missing", async () => {
    const findFirst = createSpy(async () => null);
    const findMany = createSpy(async () => [{ id: "match-1" }]);
    const dao = new MatchDao({ user: { findFirst }, match: { findMany } });

    const result = await dao.findByUsername("missing");

    assert.deepEqual(result, []);
    assert.equal(findMany.calls.length, 0);
});

test("MatchDao.findByUsername fetches matches for user", async () => {
    const findFirst = createSpy(async () => ({ id: "user-1" }));
    const findMany = createSpy(async () => [{ id: "match-1" }]);
    const dao = new MatchDao({ user: { findFirst }, match: { findMany } });

    const result = await dao.findByUsername("alice");

    assert.equal(result.length, 1);
    assert.equal(findMany.calls.length, 1);
});

test("MatchDao.create requires player ids", async () => {
    const create = createSpy(async args => args);
    const dao = new MatchDao({ match: { create } });

    await assert.rejects(() => dao.create({ player1Id: null, player2Id: "player-2", rngSeed: 1 }), /player1Id and player2Id are required/);
    assert.equal(create.calls.length, 0);
});

test("MatchDao.create requires player2Id", async () => {
    const create = createSpy(async args => args);
    const dao = new MatchDao({ match: { create } });

    await assert.rejects(() => dao.create({ player1Id: "player-1", player2Id: null, rngSeed: 1 }), /player1Id and player2Id are required/);
    assert.equal(create.calls.length, 0);
});

test("MatchDao.create requires rngSeed", async () => {
    const create = createSpy(async args => args);
    const dao = new MatchDao({ match: { create } });

    await assert.rejects(() => dao.create({ player1Id: "player-1", player2Id: "player-2", rngSeed: null }), /rngSeed is required/);
    assert.equal(create.calls.length, 0);
});

test("MatchDao.create rejects when rngSeed is undefined", async () => {
    const create = createSpy(async args => args);
    const dao = new MatchDao({ match: { create } });

    await assert.rejects(() => dao.create({ player1Id: "player-1", player2Id: "player-2" }), /rngSeed is required/);
    assert.equal(create.calls.length, 0);
});

test("MatchDao.create converts rngSeed to bigint and defaults status", async () => {
    const create = createSpy(async args => args);
    const dao = new MatchDao({ match: { create } });

    const result = await dao.create({ player1Id: "p1", player2Id: "p2", rngSeed: "42" });

    assert.equal(result.data.status, "PENDING");
    assert.equal(typeof result.data.rng_seed, "bigint");
    assert.equal(result.data.rng_seed, 42n);
});

test("MatchDao.create respects provided status and bigint rngSeed", async () => {
    const create = createSpy(async args => args);
    const dao = new MatchDao({ match: { create } });

    const result = await dao.create({
        player1Id: "p1",
        player2Id: "p2",
        rngSeed: 7n,
        status: "FINISHED",
    });

    assert.equal(result.data.status, "FINISHED");
    assert.equal(result.data.rng_seed, 7n);
});

test("MatchDao.update returns null when missing id", async () => {
    const update = createSpy(async args => args);
    const dao = new MatchDao({ match: { update } });

    const result = await dao.update();

    assert.equal(result, null);
    assert.equal(update.calls.length, 0);
});

test("MatchDao.update leaves rngSeed undefined when not provided", async () => {
    const update = createSpy(async args => args);
    const dao = new MatchDao({ match: { update } });

    const result = await dao.update("match-1", { status: "FINISHED" });

    assert.equal(result.data.status, "FINISHED");
    assert.equal(result.data.rng_seed, undefined);
});

test("MatchDao.update converts rngSeed to bigint", async () => {
    const update = createSpy(async args => args);
    const dao = new MatchDao({ match: { update } });

    const result = await dao.update("match-1", { rngSeed: 99 });

    assert.equal(result.data.rng_seed, 99n);
});

test("MatchDao.update drops null rngSeed", async () => {
    const update = createSpy(async args => args);
    const dao = new MatchDao({ match: { update } });

    const result = await dao.update("match-1", { rngSeed: null });

    assert.equal(result.data.rng_seed, undefined);
});

test("MatchDao.delete returns false when missing id", async () => {
    const del = createSpy(async () => undefined);
    const dao = new MatchDao({ match: { delete: del } });

    const result = await dao.delete();

    assert.equal(result, false);
    assert.equal(del.calls.length, 0);
});

test("MatchDao.delete returns true on success", async () => {
    const del = createSpy(async () => undefined);
    const dao = new MatchDao({ match: { delete: del } });

    const result = await dao.delete("match-1");

    assert.equal(result, true);
});

test("MatchDao.delete returns false on errors", async () => {
    const del = createSpy(async () => {
        throw new Error("boom");
    });
    const dao = new MatchDao({ match: { delete: del } });

    const result = await dao.delete("match-1");

    assert.equal(result, false);
});
