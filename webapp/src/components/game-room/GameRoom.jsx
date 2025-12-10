/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   GameRoom.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:39:24 by npatron           #+#    #+#             */
/*   Updated: 2025/12/10 14:26:05 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useUser } from '../../providers/UserProvider';
import { useSocket } from '../../providers/SocketProvider';
import { useRoom } from '../../composables/useRoom';
import { LogOutIcon, PlayIcon, UserIcon } from 'lucide-react';

import './GameRoom.css';

const GameRoom = () => {
    const navigate = useNavigate();
    const { roomName } = useParams();
    const { user } = useUser();
    const { roomEvents } = useSocket();
    const { isUserAllowedToJoinARoom, handleLeaveRoom, isLoading, error } = useRoom()

    const [isUserAuthorized, setIsUserAuthorized] = useState(false)
    const [roomInfo, setRoomInfo] = useState(null)
    const hasLeftRoom = useRef(false)

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

	const startGame = useCallback(() => {
		console.log("Starting game");
	}, []);

	const leaveRoom = async () => {
		try {
			const result = await handleLeaveRoom({ roomName: normalizedRouteRoomName, username: normalizedUser });
			console.log(result);
			if (result.data.success) {
				navigate('/');
			}
		} catch (error) {
			console.error(error);
		}
	}

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


    if (isLoading && !roomInfo) {
        return <div className="room-loading">Loading room...</div>;
    }

    if (error && !isUserAuthorized) {
        return <div className="room-error">Error: {error}</div>;
    }

    if (!isUserAuthorized) {
        return (
            <div className="room-unauthorized">
                <h1>Access Denied</h1>
                <p>You are not authorized to join this room.</p>
            </div>
        );
    }
	
	if (!roomInfo) {	
		return <div className="room-loading">Loading room...</div>;
	}

    return (
        <div className="gameroom-container">
            <div className="gameroom-card">
                <header className="room-header">
                    <h1 className="room-title"> <span>{roomName}</span></h1>
	            </header>

				<div className="players-section">
					<div className="players-grid">
						{roomInfo.players.map((player) => (
							<div 
								key={player} 
								className={`player-card ${player === roomInfo.leaderUsername ? 'is-leader' : ''}`}
							>
								<div className="player-avatar">
									<UserIcon size={24} color="#ffffff" />
								</div>
								<span className="player-name">{player}</span>
							</div>
						))}
					</div>
				</div>
            </div>
			<button className="custom-button-play" onClick={startGame}>
				<PlayIcon size={24} color="#039BE5" />
				Start Game
			</button>
			<button className="custom-button-leave" onClick={leaveRoom}>
				<LogOutIcon size={24} color="#E53935" />
				Leave Room
			</button>
        </div>
    );
};

export default GameRoom;
