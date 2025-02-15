/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   TetrisHome.jsx                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/27 17:41:53 by fpalumbo          #+#    #+#             */
/*   Updated: 2025/01/13 22:19:00 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import React from 'react';

import './css/TetrisHome.css';

import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';

import { useAuth } from "../providers/UserAuthProvider"


const TetrisGrid = () => {

    const navigate = useNavigate();

    const {myUser} = useAuth()

    const rows = 20;
    const cols = 10;
    const grid = Array.from({ length: rows }, (_, rowIndex) =>
        Array.from({ length: cols }, (_, colIndex) => `${rowIndex}-${colIndex}`)
    );


    const createGame = () => {

        const roomId = uuidv4()
        const leader = myUser.username

        navigate(`/${roomId}/${leader}`, { state: { roomId }})
        return ;
    }

    return (
        <>
        <div className="principalContent">
            <div className="tetris-grid">
                {grid.flat().map((cell) => (
                    <div key={cell} className="tetris-cell"></div>
                ))}
            </div>
            <button className="buttonPlay">
                <span className="writePlay" onClick={() => createGame()}>PLAY</span>
            </button>
        </div>
        </>
    );
};

export default TetrisGrid;
