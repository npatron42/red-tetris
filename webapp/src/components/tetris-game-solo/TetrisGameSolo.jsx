/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   TetrisGameSolo.jsx                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/11 13:02:55 by npatron           #+#    #+#             */
/*   Updated: 2025/12/22 17:24:53 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './TetrisGameSolo.css';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../providers/UserProvider';
import { useSocket } from '../../providers/SocketProvider';
import { socketService } from '../../services/socketService';

import { endSoloGame } from '../../composables/useApi';

const COLORS = {
    I: '#00FFFF',
    'I-ghost': 'rgba(0,255,255,0.35)',
    J: '#0000FF',
    'J-ghost': 'rgba(0,0,255,0.35)',
    L: '#FFA500',
    'L-ghost': 'rgba(255,165,0,0.35)',
    O: '#FFFF00',
    'O-ghost': 'rgba(255,255,0,0.35)',
    S: '#00FF00',
    'S-ghost': 'rgba(0,255,0,0.35)',
    T: '#800080',
    'T-ghost': 'rgba(128,0,128,0.35)',
    Z: '#FF0000',
    'Z-ghost': 'rgba(255,0,0,0.35)',
    0: '#1a1a1a'
};

export const TetrisGameSolo = () => {
    
    const navigate = useNavigate();
    const gameId = useParams().gameId;
    const [grid, setGrid] = useState(() => Array.from({ length: 20 }, () => Array(10).fill(0)));
    const { user } = useUser();
    const { socket } = useSocket();
    const [gameStatus, setGameStatus] = useState(null);

    const getCellStyle = (cell) => {
        const backgroundColor = COLORS[cell] || COLORS[0];
        return {
            backgroundColor,
            border: `1px solid ${cell === 0 ? '#333' : '#000'}`
        };
    };

    const goToHome = async () => {
        setTimeout(() => {
            navigate('/');
        }, 3000);
    };
    
    useEffect(() => {
        const handleGridUpdate = async (data) => {
            console.log("handleGridUpdate", data);
            if (data.state && data.state.length > 0) {
                const playerState = data.state[0];
                if (playerState.grid) {
                    setGrid(playerState.grid);
                }
                if (playerState.status) {
                    setGameStatus(playerState.status);
                    
                    if (playerState.status === 'COMPLETED') {
                        await endSoloGame(gameId, playerState.score);
                        await goToHome();
                    }
                }   
            }
        };

        socketService.on('soloGameUpdated', handleGridUpdate);
        return () => {
            socketService.off('soloGameUpdated', handleGridUpdate);
        };
    }, [user]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!socket || !user) {
                return;
            }

            let direction = null;

            switch (event.key) {
                case 'ArrowLeft':
                    direction = 'LEFT';
                    event.preventDefault();
                    break;
                case 'ArrowRight':
                    direction = 'RIGHT';
                    event.preventDefault();
                    break;
                case 'ArrowDown':
                    direction = 'DOWN';
                    event.preventDefault();
                    break;
                case 'ArrowUp':
                    direction = 'ROTATE';
                    event.preventDefault();
                    break;
                case ' ':
                    direction = 'DROP';
                    event.preventDefault();
                    break;
                default:
                    return;
            }

            if (direction) {
                socketService.sendMoveSolo({
                    gameId, 
                    direction,  
                    username: user
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [socket, user]);
    
    return (
        <> 
        {gameStatus === 'COMPLETED' && (
            <div className="game-board-container">
                <h1>Game Completed</h1>
            </div>
        )}
        {gameStatus === 'IN_PROGRESS' && (
        <div className="game-board-container" style={{ textAlign: 'center', color: 'white' }}>
            <div className="grid">
                {grid.flatMap((row, rowIndex) =>
                    row.map((cell, cellIndex) => (
                        <div 
                            key={`${rowIndex}-${cellIndex}`} 
                            className="cell"
                            style={getCellStyle(cell)}
                        />
                    ))
                )}
            </div>
        </div>
        )}
        </>
    );
};