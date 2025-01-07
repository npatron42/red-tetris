/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   TetrisGame.jsx                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/27 18:02:53 by fpalumbo          #+#    #+#             */
/*   Updated: 2025/01/07 20:38:08 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import React, { useEffect } from 'react';

import { io } from 'socket.io-client';
import { useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../providers/UserAuthProvider'


const TetrisGame = () => {
   
    const { myUser } = useAuth();
    const location = useLocation()
    const {roomId} = useParams()
    

    useEffect(() => {
        
        const socket = io('http://localhost:8000', {
            query: { userId: myUser.id, roomId: roomId }
          });
        
        socket.on(`${myUser.username}`, () => {
            console.log('Je te reconnais');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            Tetris Game is Running
        </div>
    );
}

export default TetrisGame;
