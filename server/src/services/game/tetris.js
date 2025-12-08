/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tetris.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 15:31:01 by npatron           #+#    #+#             */
/*   Updated: 2025/11/17 16:01:07 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
	TetrominoI,
	TetrominoJ,
	TetrominoL,
	TetrominoO,
	TetrominoS,
	TetrominoT,
	TetrominoZ,
	Tetrominos,
} from './tetrominos.js';

import { getRoom, sendToPlayer } from '../socket/socket.js';

import { allSockets } from '../socket/socket.js';

const piecesInMovement = new Map();

export class Game {
	constructor() {
		this.tetrominosGenerated = [];
		this.tetrominos = new Tetrominos();
	}

	generateTetrominos() {
		const max = 6;
		const min = 0;
		const tetrominosGenerated = 100;

		for (let i = 0; i <= tetrominosGenerated; i++) {
			let pieceChoice = Math.floor(Math.random() * (max - min + 1)) + min;
			const tetromino = new this.tetrominos.pieces[pieceChoice]();

			this.tetrominosGenerated.push(tetromino.getName());
		}
		return;
	}
}
