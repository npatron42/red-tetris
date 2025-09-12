/**
 * Copyright (c) 2024 - Indigen Solutions
 * Authors:
 *   - Nicolas Patron <nicolas.patron@indigen.com>
 * NOTICE: All information contained herein is, and remains
 * the property of Indigen Solutions and its suppliers, if any.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Indigen Solutions.
 */


import { TetrominoI, TetrominoJ, TetrominoL, TetrominoO, TetrominoS, TetrominoT, TetrominoZ, Tetrominos } from "./tetrominos.js";
import { getRoom, sendToPlayer } from "../socket/socket.js";
import "../socket/socket.js"
import { allSockets } from "../socket/socket.js";


const piecesInMovement = new Map()

export class Game {

    constructor() {
        this.tetrominosGenerated = []
        this.tetrominos = new Tetrominos();

    }


    generateTetrominos() {

        const max = 6;
        const min = 0;

        const tetrominosGenerated = 100;
        for (let i = 0; i <= tetrominosGenerated; i++) {
            
            let pieceChoice = Math.floor(Math.random() * (max - min + 1)) + min;
            const tetromino = new this.tetrominos.pieces[pieceChoice];

            this.tetrominosGenerated.push(tetromino.getName());
        }

        return ;

    }

}
