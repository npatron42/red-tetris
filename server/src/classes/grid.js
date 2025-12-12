/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   grid.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/11 15:17:51 by npatron           #+#    #+#             */
/*   Updated: 2025/12/12 16:36:40 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export class Grid {
	constructor() {
		this.grid = Array.from({ length: 20 }, () => Array(10).fill(0));
	}

	updateGrid(row, column, value) {
		this.grid[row][column] = value;
		return this.grid;
	}

	getGrid() {
		return this.grid;
	}

	clearGrid() {
		this.grid = Array.from({ length: 20 }, () => Array(10).fill(0));
	}

	isValidPosition(piece, x, y) {
		const tetrominoShape = piece.getCurrentShape();
		for (let row = 0; row < tetrominoShape.length; row++) {
			for (let col = 0; col < tetrominoShape[row].length; col++) {
				if (tetrominoShape[row][col] !== 0) {
					const newY = y + row;
					const newX = x + col;
					if (newX < 0 || newX >= 10 || newY >= 20) {
						return false;
					}
					if (newY >= 0 && this.grid[newY][newX] !== 0) {
						return false;
					}
				}
			}
		}
		return true;
	}

	lockPiece(piece) {
		const shape = piece.getCurrentShape();
		const type = piece.type;
		for (let row = 0; row < shape.length; row++) {
			for (let col = 0; col < shape[row].length; col++) {
				if (shape[row][col] !== 0) {
					const y = piece.y + row;
					const x = piece.x + col;
					if (y >= 0 && y < 20 && x >= 0 && x < 10) {
						this.grid[y][x] = type;
					}
				}
			}
		}
	}

	getGridWithPiece(piece) {
		const gridCopy = this.grid.map((row) => [...row]);
		const shape = piece.getCurrentShape();
		const type = piece.type;
		for (let row = 0; row < shape.length; row++) {
			for (let col = 0; col < shape[row].length; col++) {
				if (shape[row][col] !== 0) {
					const y = piece.y + row;
					const x = piece.x + col;
					if (y >= 0 && y < 20 && x >= 0 && x < 10) {
						    gridCopy[y][x] = type;
					}
				}
			}
		}
		return gridCopy;
	}

    gameIsLost() {
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 10; col++) {
                if (this.grid[row][col] !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    printGrid() {
        console.log("--------------------------------");
        for (let row = 0; row < this.grid.length; row++) {
            console.log(this.grid[row]);
        }
        console.log("--------------------------------");
    }


}
