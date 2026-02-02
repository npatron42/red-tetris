/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   TetrisGameSolo.jsx                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/11 13:02:55 by npatron           #+#    #+#             */
/*   Updated: 2026/02/02 14:35:23 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "./TetrisGameSolo.css";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../../providers/UserProvider";
import { useSocket } from "../../../providers/SocketProvider";
import { socketService } from "../../../services/socketService";
import { TetrominosBag } from "../../tetrominos-bag/TetrominosBag";

import { endSoloGame } from "../../../composables/useApi";

const COLORS = {
    I: "#00F0FF",
    J: "#0051FF",
    L: "#FF7B00",
    O: "#FFEA00",
    S: "#00FF48",
    T: "#BC13FE",
    Z: "#FF003C",
    X: "#3A3A3A",

    0: "transparent",

    "I-ghost": "#00F0FF",
    "J-ghost": "#0051FF",
    "L-ghost": "#FF7B00",
    "O-ghost": "#FFEA00",
    "S-ghost": "#00FF48",
    "T-ghost": "#BC13FE",
    "Z-ghost": "#FF003C",
};

export const TetrisGameSolo = ({ gameId: gameId, onGameCompleted }) => {
    const [grid, setGrid] = useState(() => Array.from({ length: 20 }, () => Array(10).fill(0)));
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [endGame, setEndGame] = useState(false);
    const [nextPieces, setNextPieces] = useState([]);
    const { user } = useUser();
    const { socket } = useSocket();
    const [gameStatus, setGameStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const getCellAttributes = cell => {
        if (cell === 0) return { className: "cell empty", style: {} };

        const isGhost = typeof cell === "string" && cell.includes("-ghost");
        const colorKey = cell;
        const colorValue = COLORS[colorKey];

        return {
            className: `cell ${isGhost ? "ghost" : "filled"}`,
            style: {
                backgroundColor: isGhost ? "transparent" : colorValue,
                "--cell-color": colorValue,
            },
        };
    };

    const renderGrid = grid => {
        return grid.flatMap((row, rowIndex) =>
            row.map((cell, cellIndex) => {
                const { className, style } = getCellAttributes(cell);
                return <div key={`${rowIndex}-${cellIndex}`} className={className} style={style} />;
            }),
        );
    };

    useEffect(() => {
        const handleGridUpdate = async data => {
            if (data.state && data.state.length > 0) {
                const playerState = data.state[0];
                if (playerState.grid) {
                    setGrid(playerState.grid);
                }
                if (playerState.score !== undefined) {
                    setScore(playerState.score);
                }
                if (playerState.level !== undefined) {
                    setLevel(playerState.level);
                }
                if (playerState.nextPieces) {
                    setNextPieces(playerState.nextPieces);
                }
                if (playerState.status) {
                    setGameStatus(playerState.status);

                    if (playerState.status === "COMPLETED" && !endGame) {
                        setEndGame(true);
                        if (fiie) {
                            onGameCompleted(playerState.score ?? 0);
                        }
                        await endSoloGame(gameId, playerState.score ?? 0);
                    }
                }
            }
        };

        socketService.on("soloGameUpdated", handleGridUpdate);
        return () => {
            socketService.off("soloGameUpdated", handleGridUpdate);
        };
    }, [user, gameId, endGame, onGameCompleted]);

    useEffect(() => {
        const handleKeyDown = event => {
            if (!socket || !user) {
                return;
            }

            let direction = null;

            switch (event.key) {
                case "ArrowLeft":
                    direction = "LEFT";
                    event.preventDefault();
                    break;
                case "ArrowRight":
                    direction = "RIGHT";
                    event.preventDefault();
                    break;
                case "ArrowDown":
                    direction = "DOWN";
                    event.preventDefault();
                    break;
                case "ArrowUp":
                    direction = "ROTATE";
                    event.preventDefault();
                    break;
                case " ":
                    direction = "DROP";
                    event.preventDefault();
                    break;
                default:
                    return;
            }

            if (direction) {
                socketService.sendMoveSolo({
                    gameId,
                    direction,
                    userId: user.user.id,
                });
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [socket, user]);

    return (
        <>
            {gameStatus === "IN_PROGRESS" && (
                <div className="tetris-game-wrapper">
                    <div className="grid">{renderGrid(grid)}</div>
                    <div className="side-panel">
                        <div className="game-info-panel">
                            <div className="info-item">
                                <div className="info-label">Score</div>
                                <div className="info-value">{score.toLocaleString()}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Level</div>
                                <div className="info-value">{level}</div>
                            </div>
                        </div>
                        <TetrominosBag nextPieces={nextPieces} />
                    </div>
                </div>
            )}
        </>
    );
};
