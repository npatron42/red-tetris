/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   matchHistoryService.test.js                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/12 03:01:54 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 15:25:48 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createSpy } from "./testUtils.js";

process.env.DATABASE_URL;

const { MatchHistoryService } = await import("../src/services/matchHistoryService.js");

test("MatchHistoryService.createMatchHistory requires player IDs array", async () => {
    const matchDao = { create: createSpy(async () => ({})) };
    const userService = { getUserById: createSpy(async () => ({})), updateStatsById: createSpy(async () => {}) };
    const service = new MatchHistoryService(matchDao, userService);

    await assert.rejects(() => service.createMatchHistory(), /Player IDs array is required/);
    await assert.rejects(() => service.createMatchHistory([]), /Player IDs array is required/);
});

test("MatchHistoryService.createMatchHistory requires winner", async () => {
    const matchDao = { create: createSpy(async () => ({})) };
    const userService = { getUserById: createSpy(async () => ({})), updateStatsById: createSpy(async () => {}) };
    const service = new MatchHistoryService(matchDao, userService);

    await assert.rejects(() => service.createMatchHistory(["user-1"], null, 123), /Winner ID is required/);
});

test("MatchHistoryService.createMatchHistory requires rngSeed", async () => {
    const matchDao = { create: createSpy(async () => ({})) };
    const userService = { getUserById: createSpy(async () => ({})), updateStatsById: createSpy(async () => {}) };
    const service = new MatchHistoryService(matchDao, userService);

    await assert.rejects(() => service.createMatchHistory(["user-1"], "user-1"), /RNG seed is required/);
});

test("MatchHistoryService.createMatchHistory creates match and updates stats", async () => {
    const users = new Map([
        ["user-1", { id: "user-1", name: "alice" }],
        ["user-2", { id: "user-2", name: "bob" }],
    ]);
    const userService = {
        getUserById: createSpy(async id => users.get(id)),
        updateStatsById: createSpy(async () => {}),
    };
    const matchDao = { create: createSpy(async data => data) };
    const service = new MatchHistoryService(matchDao, userService);

    const result = await service.createMatchHistory(["user-1", "user-2"], "user-2", 67890);

    assert.equal(result.player1Id, "user-1");
    assert.equal(result.player2Id, "user-2");
    assert.equal(result.winnerId, "user-2");
    assert.equal(result.rngSeed, 67890);
    assert.equal(result.status, "COMPLETED");
    assert.equal(userService.updateStatsById.calls.length, 2);
});

test("MatchHistoryService.createMatchHistory forwards provided rngSeed", async () => {
    const users = new Map([
        ["user-1", { id: "user-1", name: "alice" }],
        ["user-2", { id: "user-2", name: "bob" }],
    ]);
    const userService = {
        getUserById: createSpy(async id => users.get(id)),
        updateStatsById: createSpy(async () => {}),
    };
    const matchDao = { create: createSpy(async data => data) };
    const service = new MatchHistoryService(matchDao, userService);

    const result = await service.createMatchHistory(["user-1", "user-2"], "user-1", 12345);

    assert.equal(result.rngSeed, 12345);
    assert.equal(matchDao.create.calls[0][0].rngSeed, 12345);
});

test("MatchHistoryService.createMatchHistory uses player1 as player2 when missing", async () => {
    const users = new Map([["user-1", { id: "user-1", name: "alice" }]]);
    const userService = {
        getUserById: createSpy(async id => users.get(id)),
        updateStatsById: createSpy(async () => {}),
    };
    const matchDao = { create: createSpy(async data => data) };
    const service = new MatchHistoryService(matchDao, userService);

    const result = await service.createMatchHistory(["user-1"], "user-1", 12345);

    assert.equal(result.player1Id, "user-1");
    assert.equal(result.player2Id, "user-1");
});

test("MatchHistoryService.getMatchHistoryByUserId requires userId", async () => {
    const matchDao = { findByPlayerId: createSpy(async () => []) };
    const userService = { getUserById: createSpy(async () => ({})), updateStatsById: createSpy(async () => {}) };
    const service = new MatchHistoryService(matchDao, userService);

    await assert.rejects(() => service.getMatchHistoryByUserId(), /User ID is required/);
});

test("MatchHistoryService.getMatchHistoryByUserId returns matches", async () => {
    const matches = [{ id: "match-1" }];
    const matchDao = { findByPlayerId: createSpy(async () => matches) };
    const userService = { getUserById: createSpy(async () => ({})), updateStatsById: createSpy(async () => {}) };
    const service = new MatchHistoryService(matchDao, userService);

    const result = await service.getMatchHistoryByUserId("user-1");

    assert.equal(result, matches);
});

test("MatchHistoryService.createMatchHistory persists match_players when stats provided", async () => {
    const users = new Map([
        ["user-1", { id: "user-1", name: "alice" }],
        ["user-2", { id: "user-2", name: "bob" }],
    ]);
    const userService = {
        getUserById: createSpy(async id => users.get(id)),
        updateStatsById: createSpy(async () => {}),
    };
    const matchDao = { create: createSpy(async data => ({ ...data, id: "match-1" })) };
    const matchPlayerDao = { createMany: createSpy(async () => []) };
    const service = new MatchHistoryService(matchDao, userService, matchPlayerDao);

    const playerStats = [
        { playerId: "user-1", score: 1200, level: 3, linesCleared: 14, durationMs: 60000 },
        { playerId: "user-2", score: 800, level: 3, linesCleared: 9, durationMs: 60000 },
    ];

    await service.createMatchHistory(["user-1", "user-2"], "user-1", 99, playerStats);

    assert.equal(matchPlayerDao.createMany.calls.length, 1);
    const rows = matchPlayerDao.createMany.calls[0][0];
    assert.equal(rows.length, 2);
    assert.equal(rows[0].matchId, "match-1");
    assert.equal(rows[0].playerId, "user-1");
    assert.equal(rows[0].score, 1200);
    assert.equal(rows[0].linesCleared, 14);
    assert.equal(rows[1].playerId, "user-2");
    assert.equal(rows[1].score, 800);
});

test("MatchHistoryService.createMatchHistory skips match_players when stats omitted", async () => {
    const users = new Map([
        ["user-1", { id: "user-1", name: "alice" }],
        ["user-2", { id: "user-2", name: "bob" }],
    ]);
    const userService = {
        getUserById: createSpy(async id => users.get(id)),
        updateStatsById: createSpy(async () => {}),
    };
    const matchDao = { create: createSpy(async data => ({ ...data, id: "match-1" })) };
    const matchPlayerDao = { createMany: createSpy(async () => []) };
    const service = new MatchHistoryService(matchDao, userService, matchPlayerDao);

    await service.createMatchHistory(["user-1", "user-2"], "user-1", 42);

    assert.equal(matchPlayerDao.createMany.calls.length, 0);
});
