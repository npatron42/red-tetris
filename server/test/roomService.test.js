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

test("RoomService.joinRoom rejects new players while a game is running", async () => {
    const service = new RoomService();
    const findByName = createSpy(async () => createRoom({ status: "PROCESSING", opponent_id: null, opponent: null }));

    service.roomDao = {
        findByName,
    };

    await assert.rejects(() => service.joinRoom("room", "new-player"), /Room is not joinable/);
});

test("RoomService.joinRoom rejects users already in the room", async () => {
    const service = new RoomService();
    const findByName = createSpy(async () => createRoom());

    service.roomDao = {
        findByName,
    };

    await assert.rejects(() => service.joinRoom("room", "leader-1"), /User already in room/);
    await assert.rejects(() => service.joinRoom("room", "opponent-1"), /User already in room/);
});

test("RoomService.startGame rejects non-host users", async () => {
    const service = new RoomService();
    const findByName = createSpy(async () => createRoom({ status: "PENDING", opponent_id: null, opponent: null }));

    service.roomDao = {
        findByName,
    };

    await assert.rejects(() => service.startGame("room", "opponent-1"), /Only room host can start the game/);
});

test("RoomService.startGame rejects rooms with only the host", async () => {
    const service = new RoomService();
    const findByName = createSpy(async () => createRoom({ status: "PENDING", opponent_id: null, opponent: null }));

    service.roomDao = {
        findByName,
    };

    await assert.rejects(() => service.startGame("room", "leader-1"), /Cannot start game alone/);
});

test("RoomService.restartRoom rejects non-host users", async () => {
    const service = new RoomService();
    const findByName = createSpy(async () => createRoom({ status: "COMPLETED" }));

    service.roomDao = {
        findByName,
    };

    await assert.rejects(() => service.restartRoom("room", "opponent-1"), /Only room host can restart the game/);
});

test("RoomService.restartRoom resets completed room for the next round", async () => {
    const service = new RoomService();
    const findByName = createSpy(async () => {
        if (findByName.calls.length > 1) {
            return createRoom({ status: "PENDING", opponent_id: null, opponent: null });
        }
        return createRoom({ status: "COMPLETED" });
    });
    const updateByName = createSpy(async () => undefined);

    service.roomDao = {
        findByName,
        updateByName,
    };

    const result = await service.restartRoom("room", "leader-1");

    assert.equal(result.status, "PENDING");
    assert.equal(result.opponentId, null);
    assert.deepEqual(updateByName.calls[0], ["room", { status: "PENDING", opponent_id: null }]);
});

test("RoomService keeps promoted host start-ready after another user joins", async () => {
    const service = new RoomService();
    const users = {
        "leader-1": { id: "leader-1", name: "alice" },
        "opponent-1": { id: "opponent-1", name: "bob" },
        "player-3": { id: "player-3", name: "charlie" },
    };
    const roomState = {
        id: "room-1",
        name: "room",
        status: "PENDING",
        leader_id: "leader-1",
        opponent_id: "opponent-1",
    };
    const hydrateRoom = () =>
        createRoom({
            ...roomState,
            leader: users[roomState.leader_id],
            opponent: roomState.opponent_id ? users[roomState.opponent_id] : null,
        });

    service.roomDao = {
        findByName: createSpy(async () => hydrateRoom()),
        updateByName: createSpy(async (name, updates) => {
            Object.assign(roomState, updates);
            return hydrateRoom();
        }),
    };
    service.userDao = {
        findById: createSpy(async id => users[id] || null),
    };

    await service.removePlayer("room", "leader-1");
    const updatedRoom = await service.joinRoom("room", "player-3");

    assert.equal(updatedRoom.leaderId, "opponent-1");
    assert.equal(updatedRoom.opponentId, "player-3");
    assert.deepEqual(
        updatedRoom.players.map(player => player.id),
        ["opponent-1", "player-3"],
    );
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
