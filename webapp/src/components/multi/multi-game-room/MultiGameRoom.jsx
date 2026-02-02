/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   MultiGameRoom.jsx                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:39:24 by npatron           #+#    #+#             */
/*   Updated: 2026/02/02 13:32:45 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { LogOutIcon, PlayIcon, UserIcon, CrownIcon } from "lucide-react";

import { useUser } from "../../../providers/UserProvider";
import { useSocket } from "../../../providers/SocketProvider";
import { useRoom } from "../../../composables/useRoom";
import { GameResults } from "../../game-results/GameResults";
import { TetrisGameMultiplayer } from "../tetris-game-multiplayer/TetrisGameMultiplayer";

import "./MultiGameRoom.css";

const MultiGameRoom = () => {
    const navigate = useNavigate();
    const { roomName } = useParams();
    const { user } = useUser();
    const { roomEvents } = useSocket();
    const { isUserAllowedToJoinARoom, handleLeaveRoom, handleStartGame, isLoading, error } = useRoom();

    const [isUserAuthorized, setIsUserAuthorized] = useState(false);
    const [roomInfo, setRoomInfo] = useState(null);

    const fetchRoomDetails = useCallback(async () => {
        if (!roomName) return;
        if (!user) return;
        const result = await isUserAllowedToJoinARoom(roomName, user.user.id);
        if (result.success && result.data?.room) {
            setIsUserAuthorized(true);
            setRoomInfo(result.data.room);
            console.log("ICI --> roomInfo", roomInfo);
        } else {
            setIsUserAuthorized(false);
            setRoomInfo(null);
        }
    }, [isUserAllowedToJoinARoom, roomName, user]);

    useEffect(() => {
        fetchRoomDetails();
    }, [fetchRoomDetails, user]);

    const startGame = async () => {
        const result = await handleStartGame(roomName);
        console.log("ICI --> result", result);
        if (result.success) {
            setRoomInfo(result.data.room);
        }
    };

    const leaveRoom = async () => {
        try {
            const result = await handleLeaveRoom(roomName);
            if (result.data.success) {
                navigate("/");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!roomEvents.roomUpdated) return;
        setRoomInfo(roomEvents.roomUpdated);
    }, [roomEvents.roomUpdated]);

    if (isLoading && !roomInfo) return <div className="room-loading">Loading room...</div>;
    if (error && !isUserAuthorized) return <div className="room-error">Error: {error}</div>;

    if (!isUserAuthorized) {
        return (
            <div className="room-unauthorized">
                <h1>Access Denied</h1>
                <p>You are not authorized to join this room.</p>
            </div>
        );
    }

    if (!roomInfo) return <div className="room-loading">Loading room...</div>;

    const renderContent = () => {
        const status = roomInfo.gameStatus || "waiting";

        switch (status) {
            case "PLAYING":
                return <TetrisGameMultiplayer roomInfo={roomInfo} currentUser={user} />;

            case "finished":
                return <GameResults roomInfo={roomInfo} onRestart={startGame} onLeave={leaveRoom} />;

            case "waiting":
            default:
                return (
                    <div className="gameroom-card">
                        <header className="room-header">
                            <h1 className="room-title">
                                <span>{roomName}</span>
                            </h1>
                        </header>

                        <div className="players-section">
                            <div className="players-grid">
                                {roomInfo.players.map((player, index) => (
                                    <div
                                        key={player.id || `player-${index}`}
                                        className={`player-card ${player.id === roomInfo.leaderId ? "is-leader" : ""}`}
                                    >
                                        <div className="player-avatar">
                                            <UserIcon size={24} color="#ffffff" />
                                        </div>
                                        <span className="player-name">
                                            {player.name}
                                            {player.id === roomInfo.leaderId && <CrownIcon size={24} color="#ffd700" />}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lobby-actions">
                            {user.user.id === roomInfo.leaderId && roomInfo.opponentId !== null && (
                                <button className="custom-button-play" onClick={startGame}>
                                    <PlayIcon size={24} color="#039BE5" />
                                    Start Game
                                </button>
                            )}

                            <button className="custom-button-leave" onClick={leaveRoom}>
                                <LogOutIcon size={24} color="#E53935" />
                                Leave Room
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return <div className="gameroom-container">{renderContent()}</div>;
};

export default MultiGameRoom;
