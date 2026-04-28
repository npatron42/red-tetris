/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   matchPlayerDao.test.js                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/28 00:00:00 by npatron           #+#    #+#             */
/*   Updated: 2026/04/28 00:00:00 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createSpy } from "./testUtils.js";

const { MatchPlayerDao } = await import("../src/dao/matchPlayerDao.js");

test("MatchPlayerDao.createMany returns empty when called with no rows", async () => {
    const dao = new MatchPlayerDao({ matchPlayer: { createMany: createSpy(async () => ({})) } });

    assert.deepEqual(await dao.createMany([]), []);
    assert.deepEqual(await dao.createMany(null), []);
});

test("MatchPlayerDao.createMany requires matchId", async () => {
    const dao = new MatchPlayerDao({ matchPlayer: { createMany: createSpy(async () => ({})) } });

    await assert.rejects(() => dao.createMany([{ playerId: "user-1" }]), /matchId is required/);
});

test("MatchPlayerDao.createMany requires playerId", async () => {
    const dao = new MatchPlayerDao({ matchPlayer: { createMany: createSpy(async () => ({})) } });

    await assert.rejects(() => dao.createMany([{ matchId: "match-1" }]), /playerId is required/);
});

test("MatchPlayerDao.createMany maps fields, defaults, and converts duration to bigint", async () => {
    const createMany = createSpy(async () => ({}));
    const dao = new MatchPlayerDao({ matchPlayer: { createMany } });

    await dao.createMany([
        { matchId: "m1", playerId: "u1", score: 500, level: 2, linesCleared: 7, durationMs: 30000 },
        { matchId: "m1", playerId: "u2" },
    ]);

    const arg = createMany.calls[0][0];
    assert.equal(arg.data.length, 2);
    assert.equal(arg.data[0].match_id, "m1");
    assert.equal(arg.data[0].player_id, "u1");
    assert.equal(arg.data[0].score, 500);
    assert.equal(arg.data[0].level, 2);
    assert.equal(arg.data[0].lines_cleared, 7);
    assert.equal(arg.data[0].duration_ms, 30000n);
    assert.equal(arg.data[1].score, 0);
    assert.equal(arg.data[1].level, 1);
    assert.equal(arg.data[1].lines_cleared, 0);
    assert.equal(arg.data[1].duration_ms, undefined);
    assert.ok(arg.data[0].id);
    assert.ok(arg.data[1].id);
});

test("MatchPlayerDao.findByMatchId returns empty array when missing id", async () => {
    const findMany = createSpy(async () => []);
    const dao = new MatchPlayerDao({ matchPlayer: { findMany } });

    assert.deepEqual(await dao.findByMatchId(null), []);
    assert.equal(findMany.calls.length, 0);
});

test("MatchPlayerDao.findByMatchId queries by match_id ordered by score desc", async () => {
    const rows = [{ id: "mp-1" }];
    const findMany = createSpy(async () => rows);
    const dao = new MatchPlayerDao({ matchPlayer: { findMany } });

    const result = await dao.findByMatchId("match-1");

    assert.equal(result, rows);
    assert.deepEqual(findMany.calls[0][0], { where: { match_id: "match-1" }, orderBy: { score: "desc" } });
});

test("MatchPlayerDao.findByPlayerId returns empty array when missing id", async () => {
    const findMany = createSpy(async () => []);
    const dao = new MatchPlayerDao({ matchPlayer: { findMany } });

    assert.deepEqual(await dao.findByPlayerId(null), []);
    assert.equal(findMany.calls.length, 0);
});

test("MatchPlayerDao.findByPlayerId queries by player_id", async () => {
    const rows = [{ id: "mp-1" }];
    const findMany = createSpy(async () => rows);
    const dao = new MatchPlayerDao({ matchPlayer: { findMany } });

    const result = await dao.findByPlayerId("user-1");

    assert.equal(result, rows);
    assert.deepEqual(findMany.calls[0][0], { where: { player_id: "user-1" } });
});
