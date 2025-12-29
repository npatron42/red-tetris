/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   TetrominosBag.jsx                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/29 14:49:22 by npatron           #+#    #+#             */
/*   Updated: 2025/12/29 16:13:55 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "./TetrominosBag.css";

const PIECE_SHAPES = {
	I: [["I", "I", "I", "I"]],
	O: [
		["O", "O"],
		["O", "O"]
	],
	T: [
		[0, "T", 0],
		["T", "T", "T"]
	],
	J: [
		["J", 0, 0],
		["J", "J", "J"]
	],
	L: [
		[0, 0, "L"],
		["L", "L", "L"]
	],
	S: [
		[0, "S", "S"],
		["S", "S", 0]
	],
	Z: [
		["Z", "Z", 0],
		[0, "Z", "Z"]
	]
};

const COLORS = {
	I: "#00F0FF",
	J: "#0051FF",
	L: "#FF7B00",
	O: "#FFEA00",
	S: "#00FF48",
	T: "#BC13FE",
	Z: "#FF003C"
};

export const TetrominosBag = ({ nextPieces = [] }) => {
	const renderPiece = (pieceType, index) => {
		if (!pieceType || !PIECE_SHAPES[pieceType]) {
			return null;
		}

		const shape = PIECE_SHAPES[pieceType];
		const color = COLORS[pieceType];

		return (
			<div key={index} className="next-piece-container">
				<div className="next-piece-grid">
					{shape.map((row, rowIndex) => (
						<div key={rowIndex} className="next-piece-row">
							{row.map((cell, cellIndex) => (
								<div
									key={`${rowIndex}-${cellIndex}`}
									className={`next-piece-cell ${cell ? "filled" : "empty"}`}
									style={{
										backgroundColor: cell ? color : "transparent"
									}}
								/>
							))}
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<div className="tetrominos-bag">
			<div className="tetrominos-bag-title">NEXT</div>
			<div className="tetrominos-bag-pieces">
				{nextPieces.slice(0, 3).map((pieceType, index) => renderPiece(pieceType, index))}
			</div>
		</div>
	);
};
