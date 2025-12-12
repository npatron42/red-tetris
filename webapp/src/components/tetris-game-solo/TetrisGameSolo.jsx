/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   TetrisGameSolo.jsx                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/11 13:02:55 by npatron           #+#    #+#             */
/*   Updated: 2025/12/12 16:39:19 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './TetrisGameSolo.css';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../providers/UserProvider';
import { useSocket } from '../../providers/SocketProvider';
import { socketService } from '../../services/socketService';

const COLORS = {
    I: '#00FFFF',
    J: '#0000FF',
    L: '#FFA500',
    O: '#FFFF00',
    S: '#00FF00',
    T: '#800080',
    Z: '#FF0000',
    0: '#1a1a1a'
};

export const TetrisGameSolo = () => {
    
    const gameId = useParams().gameId;
    const [grid, setGrid] = useState(() => Array.from({ length: 20 }, () => Array(10).fill(0)));
    const { user } = useUser();
    const { socket } = useSocket();

    const getCellStyle = (cell) => {
        const backgroundColor = COLORS[cell] || COLORS[0];
        return {
            backgroundColor,
            border: `1px solid ${cell === 0 ? '#333' : '#000'}`
        };
    };

    useEffect(() => {
        const handleGridUpdate = (data) => {
            console.log("handleGridUpdate", data);
            if (data.gameState && data.gameState.length > 0) {
                const playerState = data.gameState[0];
                if (playerState.grid) {
                    setGrid(playerState.grid);
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
    );
};