import { test } from "node:test";
import assert from "node:assert/strict";

import { RoomService } from "../src/services/roomService.js";
import { parseRoomName } from "../src/utils/roomName.js";
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

test("parseRoomName returns an URL-safe room name", () => {
    assert.equal(parseRoomName("  drôle room !! / test  "), "drole-room-test");
    assert.equal(parseRoomName("___"), "");
    assert.equal(parseRoomName("a".repeat(40)), "a".repeat(32));
});

test("RoomService.isRoomNameValid checks the parsed room name", async () => {
    const service = new RoomService();
    const findByName = createSpy(async () => null);

    service.roomDao = {
        findByName,
    };

    const result = await service.isRoomNameValid("  weird room!!  ");

    assert.equal(result, true);
    assert.deepEqual(findByName.calls[0], ["weird-room"]);
});

test("RoomService.createRoom stores the parsed room name", async () => {
    const service = new RoomService();
    const findByName = createSpy(async name => (name === "nice-room" && findByName.calls.length > 1 ? createRoom({ name }) : null));
    const create = createSpy(async () => undefined);
    const findById = createSpy(async () => ({ id: "leader-1", name: "alice" }));

    service.roomDao = {
        findByName,
        create,
    };
    service.userDao = {
        findById,
    };

    const result = await service.createRoom("  nice room!!  ", "leader-1");

    assert.equal(result.name, "nice-room");
    assert.deepEqual(create.calls[0][0].name, "nice-room");
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
