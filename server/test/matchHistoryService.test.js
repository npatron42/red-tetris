/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   matchHistoryService.test.js                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/12 03:01:54 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 03:02:44 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


import { test } from "node:test";
import assert from "node:assert/strict";
import { createSpy } from "./testUtils.js";

process.env.DATABASE_URL

const { MatchHistoryService } = await import("../src/services/matchHistoryService.js");

test("MatchHistoryService.createMatchHistory requires players array", async () => {
	const matchDao = { create: createSpy(async () => ({})) };
	const userService = { getUserByUsername: createSpy(async () => ({})), updateStats: createSpy(async () => {}) };
	const service = new MatchHistoryService(matchDao, userService);

	await assert.rejects(() => service.createMatchHistory(), /Players array is required/);
	await assert.rejects(() => service.createMatchHistory([]), /Players array is required/);
});

test("MatchHistoryService.createMatchHistory requires winner", async () => {
	const matchDao = { create: createSpy(async () => ({})) };
	const userService = { getUserByUsername: createSpy(async () => ({})), updateStats: createSpy(async () => {}) };
	const service = new MatchHistoryService(matchDao, userService);

	await assert.rejects(() => service.createMatchHistory(["alice"]), /Winner is required/);
});

test("MatchHistoryService.createMatchHistory creates match and updates stats", async () => {
	const users = new Map([
		["alice", { id: "user-1", name: "alice" }],
		["bob", { id: "user-2", name: "bob" }]
	]);
	const userService = {
		getUserByUsername: createSpy(async (name) => users.get(name)),
		updateStats: createSpy(async () => {})
	};
	const matchDao = { create: createSpy(async (data) => data) };
	const service = new MatchHistoryService(matchDao, userService);

	const result = await service.createMatchHistory(["alice", "bob"], "bob");

	assert.equal(result.player1Id, "user-1");
	assert.equal(result.player2Id, "user-2");
	assert.equal(result.winnerId, "user-2");
	assert.equal(result.status, "FINISHED");
	assert.equal(userService.updateStats.calls.length, 2);
});

test("MatchHistoryService.createMatchHistory uses player1 as player2 when missing", async () => {
	const users = new Map([["alice", { id: "user-1", name: "alice" }]]);
	const userService = {
		getUserByUsername: createSpy(async (name) => users.get(name)),
		updateStats: createSpy(async () => {})
	};
	const matchDao = { create: createSpy(async (data) => data) };
	const service = new MatchHistoryService(matchDao, userService);

	const result = await service.createMatchHistory(["alice"], "alice");

	assert.equal(result.player1Id, "user-1");
	assert.equal(result.player2Id, "user-1");
});

test("MatchHistoryService.getMatchHistoryByUsername requires username", async () => {
	const matchDao = { findByUsername: createSpy(async () => []) };
	const userService = { getUserByUsername: createSpy(async () => ({})), updateStats: createSpy(async () => {}) };
	const service = new MatchHistoryService(matchDao, userService);

	await assert.rejects(() => service.getMatchHistoryByUsername(), /Username is required/);
});

test("MatchHistoryService.getMatchHistoryByUsername returns matches", async () => {
	const matches = [{ id: "match-1" }];
	const matchDao = { findByUsername: createSpy(async () => matches) };
	const userService = { getUserByUsername: createSpy(async () => ({})), updateStats: createSpy(async () => {}) };
	const service = new MatchHistoryService(matchDao, userService);

	const result = await service.getMatchHistoryByUsername("alice");

	assert.equal(result, matches);
});
