/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   classes.test.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/12 03:01:43 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 03:01:45 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { test } from "node:test";
import assert from "node:assert/strict";

import { Grid } from "../src/classes/grid.js";
import { Piece } from "../src/classes/piece.js";
import { Player } from "../src/classes/player.js";
import { TetrominosBag } from "../src/classes/tetrominosBag.js";
import { Difficulty, SoloGame, Status as SoloStatus } from "../src/classes/soloGame.js";
import { MultiPlayerGame, Status as MultiStatus } from "../src/classes/multiPlayerGame.js";
import { createSpy } from "./testUtils.js";

const createSocketService = () => ({
    emitToUsers: createSpy(() => undefined),
});

const createStartedGame = (pieceTypes = ["T", "O", "I", "L"]) => {
    const player = new Player("alice", "player-1", "socket-1");
    const game = new SoloGame(player, Difficulty.EASY);
    game.tetrominosBag.bag = [...pieceTypes];
    game.startGame();
    return { game, player };
};

const createRoom = (players, id = "room-1") => ({
    id,
    getPlayers: () => players,
});

const createStartedMultiPlayerGame = (pieceTypes = ["T", "O", "I", "L"]) => {
    const players = [new Player("alice", "player-1", "socket-1"), new Player("bob", "player-2", "socket-2")];
    const game = new MultiPlayerGame(createRoom(players));
    game.tetrominosBag.bag = [...pieceTypes];
    game.startGame();
    return { game, players };
};

const withMockedTimers = callback => {
    const originalSetInterval = global.setInterval;
    const originalClearInterval = global.clearInterval;
    const intervals = [];
    const cleared = [];

    global.setInterval = (fn, delay) => {
        const timer = { fn, delay };
        intervals.push(timer);
        return timer;
    };
    global.clearInterval = timer => {
        cleared.push(timer);
    };

    try {
        return callback({ intervals, cleared });
    } finally {
        global.setInterval = originalSetInterval;
        global.clearInterval = originalClearInterval;
    }
};

test("Piece moves and rotates through its shapes", () => {
    const piece = new Piece("T");

    assert.equal(piece.type, "T");
    assert.equal(piece.getX(), 3);
    assert.equal(piece.getY(), 0);
    assert.deepEqual(piece.getCurrentShape(), [
        [0, "T", 0],
        ["T", "T", "T"],
        [0, 0, 0],
    ]);

    piece.rotate();
    assert.equal(piece.rotationIndex, 1);
    assert.deepEqual(piece.getCurrentShape(), [
        [0, "T", 0],
        [0, "T", "T"],
        [0, "T", 0],
    ]);

    piece.moveLeft();
    piece.moveRight();
    piece.moveDown();
    piece.fallDown();
    piece.setPosition(5, 7);

    assert.equal(piece.getX(), 5);
    assert.equal(piece.getY(), 7);
});

test("Piece rotation wraps to the first shape", () => {
    const piece = new Piece("O");

    piece.rotate();

    assert.equal(piece.rotationIndex, 0);
    assert.deepEqual(piece.getCurrentShape(), [
        ["O", "O"],
        ["O", "O"],
    ]);
});

test("Grid resets, validates positions, and detects collisions", () => {
    const grid = new Grid(4, 4);
    const piece = new Piece("O");

    piece.setPosition(1, 1);
    assert.equal(grid.isValidPosition(piece, piece.getX(), piece.getY()), true);

    assert.equal(grid.isValidPosition(piece, -1, 1), false);
    assert.equal(grid.isValidPosition(piece, 3, 1), false);
    assert.equal(grid.isValidPosition(piece, 1, 3), false);

    grid.getGrid()[2][2] = "X";
    assert.equal(grid.isValidPosition(piece, 1, 1), false);

    grid.clearGrid();
    assert.deepEqual(grid.getGrid(), [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]);
});

test("Grid locks pieces inside bounds and ignores offscreen cells", () => {
    const grid = new Grid(4, 4);
    const piece = new Piece("T");
    piece.setPosition(0, -1);

    grid.lockPiece(piece);

    assert.deepEqual(grid.getGrid()[0], ["T", "T", "T", 0]);
    assert.deepEqual(grid.getGrid()[1], [0, 0, 0, 0]);
});

test("Grid clears only full destructible lines", () => {
    const grid = new Grid(4, 4);
    grid.getGrid()[1] = ["X", "X", "X", "X"];
    grid.getGrid()[2] = ["I", "I", "I", "I"];
    grid.getGrid()[3] = ["O", "O", "O", "O"];

    const linesCleared = grid.clearLines();

    assert.equal(linesCleared, 2);
    assert.deepEqual(grid.getGrid(), [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        ["X", "X", "X", "X"],
    ]);
});

test("Grid paints the current piece and its ghost without mutating the base grid", () => {
    const grid = new Grid(5, 4);
    const piece = new Piece("O");
    piece.setPosition(1, 0);

    const gridWithPiece = grid.getGridWithPiece(piece);

    assert.equal(gridWithPiece[0][1], "O");
    assert.equal(gridWithPiece[0][2], "O");
    assert.equal(gridWithPiece[3][1], "O-ghost");
    assert.equal(gridWithPiece[3][2], "O-ghost");
    assert.equal(grid.getGrid()[0][1], 0);
});

test("Grid applies wall kicks and reports when no offset works", () => {
    const grid = new Grid(5, 4);
    const piece = new Piece("I");
    piece.rotate();
    piece.setPosition(-1, 0);

    assert.equal(grid.applyWallKick(piece), true);
    assert.equal(piece.getX(), 0);

    grid.getGrid()[0] = ["X", "X", "X", "X"];
    grid.getGrid()[1] = ["X", "X", "X", "X"];
    grid.getGrid()[2] = ["X", "X", "X", "X"];
    grid.getGrid()[3] = ["X", "X", "X", "X"];
    piece.setPosition(-1, 0);

    assert.equal(grid.applyWallKick(piece), false);
    assert.equal(piece.getX(), -1);
});

test("Grid detects loss and adds indestructible lines", () => {
    const grid = new Grid(4, 4);

    assert.equal(grid.gameIsLost(), false);
    grid.addIndestructibleLines(0);
    assert.deepEqual(grid.getGrid()[3], [0, 0, 0, 0]);

    grid.addIndestructibleLines(2);
    assert.deepEqual(grid.getGrid()[2], ["X", "X", "X", "X"]);
    assert.deepEqual(grid.getGrid()[3], ["X", "X", "X", "X"]);
    assert.equal(grid.gameIsLost(), false);

    grid.getGrid()[0][0] = "T";
    assert.equal(grid.gameIsLost(), true);
});

test("TetrominosBag creates shuffled bags with all piece types", () => {
    const bag = new TetrominosBag();

    const shuffled = bag._createShuffledBag();

    assert.equal(shuffled.length, Piece.TYPES.length);
    assert.deepEqual([...shuffled].sort(), [...Piece.TYPES].sort());
});

test("TetrominosBag serves pieces from the current bag and then nextBag", () => {
    const bag = new TetrominosBag();
    bag.bag = ["I"];
    bag.nextBag = ["O"];

    const firstPiece = bag.getNextPiece();
    const secondPiece = bag.getNextPiece();

    assert.equal(firstPiece.type, "I");
    assert.equal(secondPiece.type, "O");
    assert.deepEqual(bag.nextBag, []);
});

test("TetrominosBag refills an empty bag before serving a piece", () => {
    const bag = new TetrominosBag();
    bag._createShuffledBag = createSpy(() => ["T", "Z"]);

    const piece = bag.getNextPiece();

    assert.equal(piece.type, "Z");
    assert.deepEqual(bag.bag, ["T"]);
    assert.equal(bag._createShuffledBag.calls.length, 1);
});

test("TetrominosBag peeks without consuming and prepares the next bag", () => {
    const bag = new TetrominosBag();
    bag.bag = ["I", "O"];
    bag._createShuffledBag = createSpy(() => ["T", "S", "Z"]);

    const preview = bag.peekNextPieces(4);

    assert.deepEqual(preview, ["O", "I", "Z", "S"]);
    assert.deepEqual(bag.bag, ["I", "O"]);
    assert.deepEqual(bag.nextBag, ["T", "S", "Z"]);
    assert.equal(bag._createShuffledBag.calls.length, 1);
});

test("TetrominosBag peeks from an existing nextBag", () => {
    const bag = new TetrominosBag();
    bag.nextBag = ["J", "L"];

    const preview = bag.peekNextPieces(2);

    assert.deepEqual(preview, ["L", "J"]);
    assert.deepEqual(bag.nextBag, ["J", "L"]);
});

test("SoloGame starts and ends a game", () => {
    const { game, player } = createStartedGame(["T"]);

    assert.equal(game.isStarted, true);
    assert.equal(game.getStatus(), SoloStatus.IN_PROGRESS);
    assert.equal(game.level, 1);
    assert.equal(player.numberOfGamesPlayed, 1);
    assert.equal(player.currentPiece.type, "T");
    assert.ok(game.gameStartTime);

    game.endGame();

    assert.equal(game.isStarted, false);
    assert.equal(game.getStatus(), SoloStatus.COMPLETED);
});

test("SoloGame ignores moves before start, from another player, or without a piece", () => {
    const player = new Player("alice", "player-1", "socket-1");
    const game = new SoloGame(player, Difficulty.EASY);
    const socketService = createSocketService();

    assert.equal(game.movePiece(player.id, "LEFT", socketService), null);

    game.isStarted = true;
    assert.equal(game.movePiece("other-player", "LEFT", socketService), null);
    assert.equal(game.movePiece(player.id, "LEFT", socketService), null);
    assert.equal(socketService.emitToUsers.calls.length, 0);
});

test("SoloGame moves pieces and rolls back invalid horizontal moves", () => {
    const { game, player } = createStartedGame(["O"]);
    const socketService = createSocketService();

    game.movePiece(player.id, "LEFT", socketService);
    assert.equal(player.currentPiece.getX(), 2);

    player.currentPiece.setPosition(0, 0);
    game.movePiece(player.id, "LEFT", socketService);
    assert.equal(player.currentPiece.getX(), 0);

    game.movePiece(player.id, "RIGHT", socketService);
    assert.equal(player.currentPiece.getX(), 1);

    player.currentPiece.setPosition(8, 0);
    game.movePiece(player.id, "RIGHT", socketService);
    assert.equal(player.currentPiece.getX(), 8);
    assert.equal(socketService.emitToUsers.calls.length, 4);
});

test("SoloGame moves down or locks when blocked", () => {
    const { game, player } = createStartedGame(["I", "O"]);
    const socketService = createSocketService();

    game.movePiece(player.id, "DOWN", socketService);
    assert.equal(player.currentPiece.getY(), 1);

    player.currentPiece.setPosition(1, 18);
    game.movePiece(player.id, "DOWN", socketService);
    assert.equal(player.currentPiece.type, "O");
    game.movePiece(player.id, "DOWN", socketService);

    assert.equal(player.currentPiece.type, "I");
    assert.deepEqual(player.getGrid().getGrid()[18].slice(1, 3), ["O", "O"]);
});

test("SoloGame rotates with wall kicks and rolls back blocked rotations", () => {
    const { game, player } = createStartedGame(["I"]);
    const socketService = createSocketService();

    player.currentPiece.setPosition(3, 0);
    game.movePiece(player.id, "ROTATE", socketService);
    assert.equal(player.currentPiece.rotationIndex, 1);

    player.currentPiece.setPosition(-1, 0);
    game.movePiece(player.id, "ROTATE", socketService);
    assert.equal(player.currentPiece.rotationIndex, 2);
    assert.equal(player.currentPiece.getX(), 0);

    for (let y = 2; y < 6; y++) {
        player.getGrid().getGrid()[y][0] = "X";
        player.getGrid().getGrid()[y][1] = "X";
        player.getGrid().getGrid()[y][2] = "X";
    }
    player.currentPiece.setPosition(-1, 2);
    game.movePiece(player.id, "ROTATE", socketService);
    assert.equal(player.currentPiece.rotationIndex, 2);
});

test("SoloGame hard drops and scores line clears", () => {
    const { game, player } = createStartedGame(["O", "I"]);
    const socketService = createSocketService();
    const grid = player.getGrid().getGrid();
    grid[19] = ["Z", "Z", "Z", "Z", "Z", "Z", 0, 0, 0, 0];
    player.currentPiece.setPosition(6, 0);

    game.movePiece(player.id, "DROP", socketService);

    assert.equal(player.currentScore, 100);
    assert.equal(player.currentPiece.type, "O");
    assert.deepEqual(player.getGrid().getGrid()[19], Array(10).fill(0));
});

test("SoloGame ends and emits when the grid is already lost", () => {
    const { game, player } = createStartedGame(["O"]);
    const socketService = createSocketService();
    player.getGrid().getGrid()[0][0] = "X";

    game.movePiece(player.id, "LEFT", socketService);

    assert.equal(game.getStatus(), SoloStatus.COMPLETED);
    assert.equal(socketService.emitToUsers.calls.length, 1);
    assert.equal(socketService.emitToUsers.calls[0][1], "soloGameUpdated");
});

test("SoloGame emits the current state with fallback grid when there is no current piece", () => {
    const { game, player } = createStartedGame(["O"]);
    const socketService = createSocketService();
    player.currentPiece = null;

    game.sendUpdatedGridToPlayer(socketService);

    const [users, eventName, payload] = socketService.emitToUsers.calls[0];
    assert.deepEqual(users, [player.id]);
    assert.equal(eventName, "soloGameUpdated");
    assert.equal(payload.playerId, player.id);
    assert.equal(payload.state[0].grid, player.getGrid().getGrid());
    assert.equal(payload.state[0].status, SoloStatus.IN_PROGRESS);
});

test("SoloGame swallows socket emission errors", () => {
    const { game } = createStartedGame(["O"]);
    const originalConsoleError = console.error;
    const consoleError = createSpy(() => undefined);
    console.error = consoleError;

    try {
        game.sendUpdatedGridToPlayer({
            emitToUsers: () => {
                throw new Error("socket down");
            },
        });
    } finally {
        console.error = originalConsoleError;
    }

    assert.equal(consoleError.calls.length, 1);
});

test("SoloGame manages game loop timers", () => {
    const { game } = createStartedGame(["O"]);
    const socketService = createSocketService();

    game.startGameLoop(socketService);
    const interval = game.interval;
    const levelInterval = game.levelInterval;
    game.startGameLoop(socketService);

    assert.equal(game.interval, interval);
    assert.equal(game.levelInterval, levelInterval);

    game.stopGameLoop();

    assert.equal(game.interval, null);
    assert.equal(game.levelInterval, null);
});

test("SoloGame restarts loops and protects duplicate level timers", () => {
    const { game } = createStartedGame(["O"]);
    const socketService = createSocketService();

    game.startLevelTimer(socketService);
    const levelInterval = game.levelInterval;
    game.startLevelTimer(socketService);
    assert.equal(game.levelInterval, levelInterval);

    game._restartGameLoop(socketService);
    const interval = game.interval;
    game._restartGameLoop(socketService);
    assert.notEqual(game.interval, interval);

    game.stopGameLoop();
});

test("SoloGame timer callbacks stop or advance the game loop", () => {
    withMockedTimers(({ intervals }) => {
        const { game } = createStartedGame(["O", "I", "T"]);
        const socketService = createSocketService();

        game.startGameLoop(socketService);
        assert.equal(intervals[0].delay, 10000);
        assert.equal(intervals[1].delay, 1000);

        intervals[1].fn();
        assert.equal(game.player.currentPiece.getY(), 1);

        intervals[0].fn();
        assert.equal(game.level, 2);
        assert.equal(socketService.emitToUsers.calls.length, 2);

        intervals.at(-1).fn();
        assert.equal(game.player.currentPiece.getY(), 2);

        game.isStarted = false;
        intervals.at(-1).fn();
        intervals[1].fn();
        assert.equal(game.interval, null);

        game.startLevelTimer(socketService);
        intervals.at(-1).fn();
        assert.equal(game.levelInterval, null);
    });
});

test("SoloGame difficulty speed covers all levels and difficulties", () => {
    const player = new Player("alice", "player-1", "socket-1");
    const expectations = [
        [Difficulty.EASY, 1000],
        [Difficulty.MEDIUM, 500],
        [Difficulty.HARD, 250],
        [Difficulty.VERY_HARD, 100],
        [Difficulty.IMPOSSIBLE, 50],
        [Difficulty.EXTREME, 25],
        [Difficulty.ULTRA, 10],
        [Difficulty.NINJA, 5],
        [Difficulty.GOD, 1],
        ["UNKNOWN", 1000],
    ];

    for (const [difficulty, speed] of expectations) {
        const game = new SoloGame(player, difficulty);
        assert.equal(game._getDifficultySpeed(), speed);
    }

    const game = new SoloGame(player, Difficulty.EASY);
    game.level = 3;
    assert.equal(game._getDifficultySpeed(), 900);

    game.level = 1000;
    assert.equal(game._getDifficultySpeed(), 1);
});

test("MultiPlayerGame does not start without players", () => {
    const game = new MultiPlayerGame(createRoom([]));

    game.startGame();

    assert.equal(game.isStarted, false);
    assert.equal(game.getStatus(), MultiStatus.PENDING);
    assert.equal(game.getPlayersCount(), 0);
});

test("MultiPlayerGame starts all players with pieces", () => {
    const { game, players } = createStartedMultiPlayerGame(["I", "O"]);

    assert.equal(game.isStarted, true);
    assert.equal(game.getStatus(), MultiStatus.IN_PROGRESS);
    assert.equal(game.getPlayersCount(), 2);
    assert.ok(game.gameStartTime);
    assert.equal(players[0].numberOfGamesPlayed, 1);
    assert.equal(players[1].numberOfGamesPlayed, 1);
    assert.equal(players[0].currentPiece.type, "O");
    assert.equal(players[1].currentPiece.type, "O");

    game.endGame();

    assert.equal(game.isStarted, false);
    assert.equal(game.getStatus(), MultiStatus.COMPLETED);
});

test("MultiPlayerGame ignores invalid move requests", () => {
    const players = [new Player("alice", "player-1", "socket-1")];
    const game = new MultiPlayerGame(createRoom(players));
    const socketService = createSocketService();

    assert.equal(game.movePiece(players[0].id, "LEFT", socketService), null);

    game.isStarted = true;
    assert.equal(game.movePiece("missing-player", "LEFT", socketService), null);
    assert.equal(game.movePiece(players[0].id, "LEFT", socketService), null);
    assert.equal(socketService.emitToUsers.calls.length, 0);
});

test("MultiPlayerGame moves pieces and rolls back invalid horizontal moves", () => {
    const { game, players } = createStartedMultiPlayerGame(["I", "O", "O"]);
    const socketService = createSocketService();
    const player = players[0];

    game.movePiece(player.id, "LEFT", socketService);
    assert.equal(player.currentPiece.getX(), 2);

    player.currentPiece.setPosition(0, 0);
    game.movePiece(player.id, "LEFT", socketService);
    assert.equal(player.currentPiece.getX(), 0);

    game.movePiece(player.id, "RIGHT", socketService);
    assert.equal(player.currentPiece.getX(), 1);

    player.currentPiece.setPosition(8, 0);
    game.movePiece(player.id, "RIGHT", socketService);
    assert.equal(player.currentPiece.getX(), 8);
    assert.equal(socketService.emitToUsers.calls.length, 4);
});

test("MultiPlayerGame moves down, locks pieces, and scores clears", () => {
    const { game, players } = createStartedMultiPlayerGame(["T", "I", "O"]);
    const socketService = createSocketService();
    const player = players[0];
    const grid = player.getGrid().getGrid();

    game.movePiece(player.id, "DOWN", socketService);
    assert.equal(player.currentPiece.getY(), 1);

    grid[19] = ["Z", "Z", "Z", "Z", "Z", "Z", 0, 0, "Z", "Z"];
    player.currentPiece.setPosition(6, 18);
    game.movePiece(player.id, "DOWN", socketService); // grace frame: touchingBottom = true
    assert.equal(player.currentPiece.type, "O");      // piece not locked yet
    game.movePiece(player.id, "DOWN", socketService); // actual lock

    assert.equal(player.currentScore, 100);
    assert.equal(player.currentPiece.type, "I");
    assert.deepEqual(player.getGrid().getGrid()[19].slice(6, 8), ["O", "O"]);
});

test("MultiPlayerGame rotates with wall kicks and rolls back blocked rotations", () => {
    const { game, players } = createStartedMultiPlayerGame(["O", "I"]);
    const socketService = createSocketService();
    const player = players[0];

    player.currentPiece.setPosition(3, 0);
    game.movePiece(player.id, "ROTATE", socketService);
    assert.equal(player.currentPiece.rotationIndex, 1);

    player.currentPiece.setPosition(-1, 0);
    game.movePiece(player.id, "ROTATE", socketService);
    assert.equal(player.currentPiece.rotationIndex, 2);
    assert.equal(player.currentPiece.getX(), 0);

    for (let y = 2; y < 6; y++) {
        player.getGrid().getGrid()[y][0] = "X";
        player.getGrid().getGrid()[y][1] = "X";
        player.getGrid().getGrid()[y][2] = "X";
    }
    player.currentPiece.setPosition(-1, 2);
    game.movePiece(player.id, "ROTATE", socketService);
    assert.equal(player.currentPiece.rotationIndex, 2);
});

test("MultiPlayerGame hard drops pieces", () => {
    const { game, players } = createStartedMultiPlayerGame(["T", "I", "O"]);
    const socketService = createSocketService();
    const player = players[0];

    game.movePiece(player.id, "DROP", socketService);

    assert.equal(player.currentPiece.type, "I");
    assert.deepEqual(player.getGrid().getGrid()[18].slice(3, 5), ["O", "O"]);
});

test("MultiPlayerGame applies n minus one penalty lines to opponents", () => {
    const { game, players } = createStartedMultiPlayerGame(["I", "O"]);
    const [sourcePlayer, opponent] = players;

    game.applyPenaltyLinesToOpponents(sourcePlayer, 1);
    assert.deepEqual(opponent.getGrid().getGrid()[19], Array(10).fill(0));

    game.applyPenaltyLinesToOpponents(sourcePlayer, 3);

    assert.deepEqual(sourcePlayer.getGrid().getGrid()[19], Array(10).fill(0));
    assert.deepEqual(opponent.getGrid().getGrid()[18], Array(10).fill("X"));
    assert.deepEqual(opponent.getGrid().getGrid()[19], Array(10).fill("X"));
});

test("MultiPlayerGame ends and emits when a player grid is lost", () => {
    const { game, players } = createStartedMultiPlayerGame(["I", "O"]);
    const socketService = createSocketService();
    players[0].getGrid().getGrid()[0][0] = "X";

    const result = game.movePiece(players[0].id, "LEFT", socketService);

    assert.equal(result.completed, true);
    assert.equal(result.winnerId, players[1].id);
    assert.equal(result.loserId, players[0].id);
    assert.equal(game.getStatus(), MultiStatus.COMPLETED);
    assert.equal(game.winnerId, players[1].id);
    assert.equal(game.loserId, players[0].id);
    assert.equal(socketService.emitToUsers.calls.length, 1);
    assert.equal(socketService.emitToUsers.calls[0][1], "multiGridUpdate");
    assert.equal(socketService.emitToUsers.calls[0][2].winnerId, players[1].id);
    assert.equal(socketService.emitToUsers.calls[0][2].loserId, players[0].id);
    assert.equal(socketService.emitToUsers.calls[0][2].gameState[0].isLoser, true);
    assert.equal(socketService.emitToUsers.calls[0][2].gameState[1].isWinner, true);
});

test("MultiPlayerGame emits game state to connected player ids", () => {
    const players = [new Player("alice", "player-1", "socket-1"), new Player("spectator", "", "socket-2")];
    const game = new MultiPlayerGame(createRoom(players));
    const socketService = createSocketService();
    game.tetrominosBag.bag = ["I", "O"];
    game.startGame();
    players[1].currentPiece = null;

    game.sendUpdatedGridToPlayers(socketService);

    const [userIds, eventName, payload] = socketService.emitToUsers.calls[0];
    assert.deepEqual(userIds, ["player-1"]);
    assert.equal(eventName, "multiGridUpdate");
    assert.equal(payload.roomId, "room-1");
    assert.equal(payload.gameState.length, 2);
    assert.equal(payload.gameState[0].status, MultiStatus.IN_PROGRESS);
    assert.equal(payload.gameState[1].grid, players[1].getGrid().getGrid());
});

test("MultiPlayerGame swallows socket emission errors", () => {
    const { game } = createStartedMultiPlayerGame(["I", "O"]);
    const originalConsoleError = console.error;
    const consoleError = createSpy(() => undefined);
    console.error = consoleError;

    try {
        game.sendUpdatedGridToPlayers({
            emitToUsers: () => {
                throw new Error("socket down");
            },
        });
    } finally {
        console.error = originalConsoleError;
    }

    assert.equal(consoleError.calls.length, 1);
});

test("MultiPlayerGame timer callbacks move players and stop inactive loops", () => {
    withMockedTimers(({ intervals }) => {
        const { game, players } = createStartedMultiPlayerGame(["I", "O", "T", "S"]);
        const socketService = createSocketService();

        game.startGameLoop(socketService);
        const firstInterval = game.interval;
        game.startGameLoop(socketService);
        game.startLevelTimer(socketService);
        assert.equal(game.interval, firstInterval);
        assert.equal(intervals.length, 2);
        assert.equal(intervals[0].delay, 10000);
        assert.equal(intervals[1].delay, 1000);

        intervals[1].fn();
        assert.equal(players[0].currentPiece.getY(), 1);
        assert.equal(players[1].currentPiece.getY(), 1);

        intervals[0].fn();
        assert.equal(game.level, 2);
        assert.equal(socketService.emitToUsers.calls.at(-1)[1], "multiGridUpdate");

        intervals.at(-1).fn();
        assert.equal(players[0].currentPiece.getY(), 2);
        assert.equal(players[1].currentPiece.getY(), 2);

        game.isStarted = false;
        intervals.at(-1).fn();
        intervals[1].fn();
        assert.equal(game.interval, null);

        game.startLevelTimer(socketService);
        intervals.at(-1).fn();
        assert.equal(game.levelInterval, null);
    });
});

test("MultiPlayerGame restarts loop with a floor speed", () => {
    withMockedTimers(({ intervals }) => {
        const { game } = createStartedMultiPlayerGame(["I", "O"]);
        const socketService = createSocketService();

        game._restartGameLoop(socketService);
        assert.equal(intervals[0].delay, 1000);

        game.level = 1000;
        game._restartGameLoop(socketService);
        assert.equal(intervals[1].delay, 100);

        game.stopGameLoop();
        assert.equal(game.interval, null);
        assert.equal(game.levelInterval, null);
    });
});
