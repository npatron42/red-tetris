/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   GameRoom.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:39:24 by npatron           #+#    #+#             */
/*   Updated: 2025/12/09 15:53:12 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../providers/UserProvider';
import { useSocket } from '../../providers/SocketProvider';
import { useRoom } from '../../composables/useRoom';
    
const GameRoom = () => {
	const { roomName, leaderUsername } = useParams();
	const { user } = useUser();
	const { roomEvents } = useSocket();
    const { isUserAllowedToJoinARoom, isLoading, error } = useRoom()

    const [isUserAuthorized, setIsUserAuthorized] = useState(false)
	const [roomInfo, setRoomInfo] = useState(null)

	const normalizedRouteRoomName = useMemo(() => roomName?.toString().toLowerCase() || "", [roomName]);
	const normalizedUser = useMemo(() => user?.toString().toLowerCase() || "", [user]);

	const fetchRoomDetails = useCallback(async () => {
		if (!roomName || !normalizedUser) {
			return;
		}
		const result = await isUserAllowedToJoinARoom(roomName, normalizedUser);
		if (result.success && result.data?.room) {
			setIsUserAuthorized(true);
			setRoomInfo(result.data.room);
		} else {
			setIsUserAuthorized(false);
			setRoomInfo(null);
		}
	}, [isUserAllowedToJoinARoom, normalizedUser, roomName]);
    
    useEffect(() => {
		fetchRoomDetails();
    }, [fetchRoomDetails]);

	useEffect(() => {
		if (!roomEvents.roomUpdated || !roomEvents.roomUpdated.roomName) {
			return;
		}
		const incomingRoomName = roomEvents.roomUpdated.roomName.toString().toLowerCase();
		if (incomingRoomName !== normalizedRouteRoomName) {
			return;
		}
		fetchRoomDetails();
	}, [roomEvents.roomUpdated, normalizedRouteRoomName, fetchRoomDetails]);

	const renderPlayers = (players) => {
		if (!players?.length) {
			return <p>No players yet.</p>;
		}

		const leader = roomInfo?.leaderUsername?.toLowerCase();

		return (
			<ul>
				{players.map((player) => (
					<li key={player}>
						{player}
						{leader && player.toLowerCase() === leader ? " (Leader)" : ""}
					</li>
				))}
			</ul>
		);
	};

	if (isLoading && !roomInfo) {
		return <div>Loading room...</div>;
	}

	if (error && !isUserAuthorized) {
		return <div>Error: {error}</div>;
	}

	if (!isUserAuthorized) {
		return (
			<div>
				<h1>You are not authorized to join this room</h1>
			</div>
		);
	}

	return (
		<div>
			<h1>Room: {roomName}</h1>
			{roomInfo ? (
				<>
					<p>Leader: {roomInfo.leaderUsername}</p>
					<p>Players:</p>
					{renderPlayers(roomInfo.players)}
				</>
			) : (
				<p>Loading room details...</p>
			)}
		</div>
	);
};

export default GameRoom;
