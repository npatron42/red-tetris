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

import React from "react";

import "./css/TetrominosGenerator.css";
import {
    TetrominoJ,
    TetrominoL,
    TetrominoS,
    TetrominoI,
    TetrominoO,
    TetrominoT,
    TetrominoZ,
} from "../classes/Tetrominos";

const TetrominosGenerator = ({ tetrominosGenerated, it, userOrEnemy }) => {

    const chooseClass = (tetromino) => {
        switch (tetromino) {
            case "J":
                return new TetrominoJ();
            case "L":
                return new TetrominoL();
            case "I":
                return new TetrominoI();
            case "S":
                return new TetrominoS();
            case "O":
                return new TetrominoO();
            case "T":
                return new TetrominoT();
            case "Z":
                return new TetrominoZ();
            default:
                return null;
        }
    };

    const drawTetromino = (tetromino) => {

        const tetrominoClass = chooseClass(tetromino);

        if (!tetrominoClass)
            return null; 

        const rotation = tetrominoClass.form[0];
        return (
            <div className="tetromino">
                {rotation.map((row, rowIndex) => (
                    <div key={rowIndex} className="tetromino-row">
                        {row.map((cell, cellIndex) => (
                            <div
                                key={cellIndex}
                                className={`tetromino-cell ${
                                    cell === 1 ? "active" : "inactive"
                                }`}
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={`tetrominosGenerator-${userOrEnemy}`}>
            {drawTetromino(tetrominosGenerated[it])}
        </div>
    );
};

export default TetrominosGenerator;
