/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   TetrisGame.jsx                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/27 18:02:53 by fpalumbo          #+#    #+#             */
/*   Updated: 2025/01/15 14:58:16 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import React, { useEffect, useState } from 'react';

import { io } from 'socket.io-client';
import { useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../providers/UserAuthProvider'
import { TetrominoI, TetrominoJ, TetrominoL, TetrominoO, TetrominoS, TetrominoT, TetrominoZ } from '../classes/Tetrominos';
import TetrominosGenerator from './TetrominosGenerator';

import "./css/TetrisGame.css"

const TetrisGame = () => {
   
    const { myUser } = useAuth();
    const {roomId} = useParams()
    const location = useLocation()
    const [enemyName, setEnemyName] = useState(undefined)
    const [tetrominosGenerated, setTetrominosGenerated] = useState([])

    const [userTetrominosPlayed, setUserTetrominosPlayed] = useState()
    const [enemyTetrominosPlayed, setEnemyTetrominosPlayed] = useState()
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        
        const socket = io('http://localhost:8000', {
            query: { userId: myUser.id, roomId: roomId }
          });
        
        socket.on("enemyName", function(data) {
            setEnemyName(data.enemy)
        });

        socket.on("enemyDisconnected", function(data) {
            setEnemyName(data.enemy)
        });

        socket.on("tetrominosGenerated", function(data) {
            setTetrominosGenerated(data.tetrominos)
            setIsLoading(false)
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    
    const rows = 20;
    const cols = 10;

    const grid = Array.from({ length: rows }, (_, rowIndex) =>
        Array.from({ length: cols }, (_, colIndex) => ({
            id: `${rowIndex}-${colIndex}`,
        }))
    );



    return (
        <>
            <div className="playerName">
                <i className="bi bi-person-circle iconWelcome"></i>
                <span className="nameWriting">YOU</span>
            </div>
            
            {enemyName !== undefined && (
                
            <div className="enemyName">
                <i className="bi bi-person-circle iconWelcome"></i>
                <span className="nameWriting">{enemyName}</span>
            </div>
            
            )}
            
            {enemyName === undefined && (
                
                <div className="enemyName">
                    <i className="bi bi-person-circle iconWelcome"></i>
                    <span className="nameWriting">waiting for opponent...</span>
                </div>
                
                )}
                
            <div className="principalContent">
                <div className="playerTetris">
                    <div className="tetris-grid-2">
                        {grid.flat().map((cell) => (
                            <div
                                key={cell.id}
                                id={`cell-${cell.id}`}
                                className={`tetris-cell cell-${cell.id}`}
                            ></div>
                        ))}
                    </div>
                </div>
                
                <TetrominosGenerator 
                    tetrominosGenerated={tetrominosGenerated}
                    it={1}
                    userOrEnemy="user"
                />
                
                <div className="vs">
                    <span className="vsWrite">VS</span>
                </div>

                <TetrominosGenerator 
                    tetrominosGenerated={tetrominosGenerated}
                    it={1}
                    userOrEnemy={"enemy"}
                />
                

                <div className="enemyTetris">
                    <div className="enemy-tetris-grid">
                        {grid.flat().map((cell) => (
                            <div
                                key={cell.id}
                                id={`enemy-cell-${cell.id}`}
                                className={`tetris-cell enemy-cell-${cell.id}`}
                            ></div>
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
}

export default TetrisGame;
