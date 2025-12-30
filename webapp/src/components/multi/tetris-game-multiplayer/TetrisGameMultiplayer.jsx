/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   TetrisGameMultiplayer.jsx                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/11 13:02:55 by npatron           #+#    #+#             */
/*   Updated: 2025/12/29 16:31:57 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "./TetrisGameMultiplayer.css";

import { useState, useEffect } from "react";
import { useUser } from "../../../providers/UserProvider";
import { useSocket } from "../../../providers/SocketProvider";
import { socketService } from "../../../services/socketService";
import { TetrominosBag } from "../../tetrominos-bag/TetrominosBag";

const COLOR_MAP = {
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
	"Z-ghost": "#FF003C"
};

export const TetrisGameMultiplayer = ({ roomInfo, currentUser }) => {
	const [playersState, setPlayersState] = useState([]);
	const { user } = useUser();
	const { socket } = useSocket();

	const getCellAttributes = (cell) => {
		if (cell === 0) return { className: "cell empty", style: {} };

		const isGhost = typeof cell === "string" && cell.includes("-ghost");
		const colorKey = cell;
		const colorValue = COLOR_MAP[colorKey];

		return {
			className: `cell ${isGhost ? "ghost" : "filled"}`,
			style: {
				backgroundColor: isGhost ? "transparent" : colorValue,
				"--cell-color": colorValue
			}
		};
	};

	useEffect(() => {
		const handleMultiGridUpdate = (data) => {
			console.log("handleMultiGridUpdate", data);
			if (data.roomName !== roomInfo.name) {
				return;
			}
			setPlayersState(data.gameState);
		};

		socketService.on("multiGridUpdate", handleMultiGridUpdate);
		return () => {
			socketService.off("multiGridUpdate", handleMultiGridUpdate);
		};
	}, [roomInfo.name]);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (!socket || !user) return;

			if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
				event.preventDefault();
			}

			let direction = null;
			switch (event.key) {
				case "ArrowLeft":
					direction = "LEFT";
					break;
				case "ArrowRight":
					direction = "RIGHT";
					break;
				case "ArrowDown":
					direction = "DOWN";
					break;
				case "ArrowUp":
					direction = "ROTATE";
					break;
				case " ":
					direction = "DROP";
					break;
				default:
					return;
			}

			if (direction) {
				socketService.sendMoveMultiplayer({
					roomName: roomInfo.name,
					direction,
					username: user
				});
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [socket, user, roomInfo.name]);

	const renderGrid = (grid) => {
		return grid.flatMap((row, rowIndex) =>
			row.map((cell, cellIndex) => {
				const { className, style } = getCellAttributes(cell);
				return <div key={`${rowIndex}-${cellIndex}`} className={className} style={style} />;
			})
		);
	};

	const renderPlayerBoard = (playerState, isCurrentUser) => {
		const defaultGrid = Array.from({ length: 20 }, () => Array(10).fill(0));
		const grid = playerState?.grid || defaultGrid;
		const nextPieces = playerState?.nextPieces || [];

		return (
			<div className="player-board">
				<h3 className="player-title">{playerState?.username || "Waiting..."}</h3>
				<div className="game-layout">
					<div className={`grid ${isCurrentUser ? "active-border" : ""}`}>{renderGrid(grid)}</div>
					{isCurrentUser && (
						<div className="side-panel">
							<div className="player-info">
								{playerState && (
									<div className="game-stats">
										<div className="stat-item">
											<div className="stat-label">Score</div>
											<div className="stat-value">{playerState.score || 0}</div>
										</div>
										<div className="stat-item">
											<div className="stat-label">Level</div>
											<div className="stat-value">{playerState.level || 1}</div>
										</div>
									</div>
								)}
							</div>
							<TetrominosBag nextPieces={nextPieces} />
						</div>
					)}
				</div>
			</div>
		);
	};

	return (
		<div className="multiplayer-game-container">
			<div className="players-boards">
				{playersState.length > 0 ? (
					playersState.map((playerState) => (
						<div key={playerState.username}>
							{renderPlayerBoard(playerState, playerState.username === user)}
						</div>
					))
				) : (
					<>
						{renderPlayerBoard(null, false)}
						{renderPlayerBoard(null, false)}
					</>
				)}
			</div>
		</div>
	);
};
