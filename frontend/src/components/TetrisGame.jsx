/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   TetrisGame.jsx                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fpalumbo <fpalumbo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/27 18:02:53 by fpalumbo          #+#    #+#             */
/*   Updated: 2024/12/28 19:43:49 by fpalumbo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import React, { useEffect } from 'react';

import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom'

import { useAuth } from '../providers/UserAuthProvider'



const TetrisGame = () => {
   
    const { myUser } = useAuth();
    const location = useLocation()
    const myRoomId = location.state?.roomId;


    useEffect(() => {
        
        const socket = io('http://localhost:8000', {
            query: { userId: myUser.id, roomId: myRoomId }
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
