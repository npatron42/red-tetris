import './SoloGame.css';

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../providers/UserProvider';
import { TetrisGameSolo } from '../tetris-game-solo/TetrisGameSolo';

export const SoloGame = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();

    return (
        <div className="solo-game-container">
            <div className="solo-game-header">
                <h1>SOLO MODE</h1>
                <button className="back-button" onClick={() => navigate('/')}>
                    Back to Menu
                </button>
            </div>
            <TetrisGameSolo gameId={gameId} />
        </div>
    );
};
