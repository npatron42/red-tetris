import React from 'react';
import './css/TetrisHome.css';

const TetrisGrid = () => {
    const rows = 20;
    const cols = 10;
    const grid = Array.from({ length: rows }, (_, rowIndex) =>
        Array.from({ length: cols }, (_, colIndex) => `${rowIndex}-${colIndex}`)
    );

    return (
        <div className="tetris-grid">
            {grid.flat().map((cell) => (
                <div key={cell} className="tetris-cell"></div>
            ))}
        </div>
    );
};

export default TetrisGrid;
