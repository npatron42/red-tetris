/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   grid.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/11 15:17:51 by npatron           #+#    #+#             */
/*   Updated: 2025/12/23 17:35:14 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const INDESTRUCTIBLE_CELL = "X";

export class Grid {
	constructor(rows = 20, cols = 10) {
		this.rows = rows;
		this.cols = cols;
		this._resetGrid();
	}

	_resetGrid() {
		this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
	}

	clearGrid() {
		this._resetGrid();
	}

	getGrid() {
		return this.grid;
	}

	isValidPosition(piece, x, y) {
		const shape = piece.getCurrentShape();

		for (let row = 0; row < shape.length; row++) {
			for (let col = 0; col < shape[row].length; col++) {
				if (shape[row][col] !== 0) {
					const targetX = x + col;
					const targetY = y + row;

					if (targetX < 0 || targetX >= this.cols || targetY >= this.rows) {
						return false;
					}
					if (targetY >= 0 && this.grid[targetY][targetX] !== 0) {
						return false;
					}
				}
			}
		}
		return true;
	}

	getGhostY(piece) {
		let ghostY = piece.y;
		while (this.isValidPosition(piece, piece.x, ghostY + 1)) {
			ghostY++;
		}
		return ghostY;
	}

	lockPiece(piece) {
		const shape = piece.getCurrentShape();

		shape.forEach((row, r) => {
			row.forEach((val, c) => {
				if (val !== 0) {
					const y = piece.y + r;
					const x = piece.x + c;
					if (y >= 0 && y < this.rows && x >= 0 && x < this.cols) {
						this.grid[y][x] = piece.type;
					}
				}
			});
		});
	}

	clearLines() {
		let linesCleared = 0;
		for (let row = this.rows - 1; row >= 0; row--) {
			const rowData = this.grid[row];
			const isIndestructibleRow = rowData.some((cell) => cell === INDESTRUCTIBLE_CELL);
			const isRowFull = rowData.every((cell) => cell !== 0);

			if (isRowFull && !isIndestructibleRow) {
				this.grid.splice(row, 1);
				this.grid.unshift(Array(this.cols).fill(0));
				linesCleared++;
				row++;
			}
		}
		return linesCleared;
	}

	getGridWithPiece(piece) {
		const gridCopy = this.grid.map((row) => [...row]);
		const ghostY = this.getGhostY(piece);

		const paint = (y, x, value) => {
			const shape = piece.getCurrentShape();
			shape.forEach((row, r) => {
				row.forEach((val, c) => {
					if (val !== 0) {
						const targetY = y + r;
						const targetX = x + c;
						if (targetY >= 0 && targetY < this.rows) {
							gridCopy[targetY][targetX] = value;
						}
					}
				});
			});
		};

		if (ghostY !== piece.y) {
			paint(ghostY, piece.x, `${piece.type}-ghost`);
		}

		paint(piece.y, piece.x, piece.type);

		return gridCopy;
	}
	gameIsLost() {
		return this.grid.slice(0, 2).some((row) => row.some((cell) => cell !== 0));
	}

	addIndestructibleLines(count) {
		if (count <= 0) {
			return;
		}

		for (let i = 0; i < count; i++) {
			this.grid.shift();
			this.grid.push(Array(this.cols).fill(INDESTRUCTIBLE_CELL));
		}
	}
}
