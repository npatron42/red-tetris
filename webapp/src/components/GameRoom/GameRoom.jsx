/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   GameRoom.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:39:24 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 17:23:53 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useParams } from 'react-router-dom';
import { useUser } from '../../providers/UserProvider';
import { useEffect, useState } from 'react';
import { useRoom } from '../../composables/useRoom';

const GameRoom = () => {
	const { roomName, leaderUsername } = useParams();
	const { user } = useUser();

    const isUserAuthorized = useState(false)

    useEffect(() => {
        console.log("RoomName", roomName);
    }, []);
	return (
		<div>
			<h1>Room: {roomName}</h1>
			<p>User from URL: {leaderUsername}</p>
			<p>Current user: {user}</p>
		</div>
	);
};

export default GameRoom;

