import { test } from "node:test";
import assert from "node:assert/strict";

import { RoomService } from "../src/services/roomService.js";
import { createSpy } from "./testUtils.js";

const createRoom = overrides => ({
    id: "room-1",
    name: "room",
    status: "PENDING",
    leader: { id: "leader-1", name: "alice" },
    opponent: { id: "opponent-1", name: "bob" },
    leader_id: "leader-1",
    opponent_id: "opponent-1",
    ...overrides,
});

test("RoomService.removePlayer promotes opponent using Prisma column names", async () => {
    const service = new RoomService();
    const findByName = createSpy(async () => createRoom());
    const updateByName = createSpy(async () => undefined);

    service.roomDao = {
        findByName,
        updateByName,
    };

    const result = await service.removePlayer("room", "leader-1");

    assert.equal(updateByName.calls.length, 1);
    assert.deepEqual(updateByName.calls[0], ["room", { leader_id: "opponent-1", opponent_id: null }]);
    assert.equal(result.leaderId, "leader-1");
});

test("RoomService.removePlayer clears opponent using Prisma column names", async () => {
    const service = new RoomService();
    const findByName = createSpy(async () => createRoom());
    const updateByName = createSpy(async () => undefined);

    service.roomDao = {
        findByName,
        updateByName,
    };

    await service.removePlayer("room", "opponent-1");

    assert.equal(updateByName.calls.length, 1);
    assert.deepEqual(updateByName.calls[0], ["room", { opponent_id: null }]);
});
