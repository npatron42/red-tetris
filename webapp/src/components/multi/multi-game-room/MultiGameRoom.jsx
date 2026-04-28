/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   MultiGameRoom.jsx                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:39:24 by npatron           #+#    #+#             */
/*   Updated: 2026/02/02 18:11:35 by npatron          ###   ########.fr       */
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
    const { handleGetRoomDetails, handleJoinRoom, handleLeaveRoom, handleRestartGame, handleStartGame, isLoading, error } = useRoom();

    const [isUserAuthorized, setIsUserAuthorized] = useState(false);
    const [roomInfo, setRoomInfo] = useState(null);
    const [finalPlayers, setFinalPlayers] = useState(null);

    const fetchRoomDetails = useCallback(async () => {
        if (!roomName) return;
        if (!user) return;
        const result = await handleGetRoomDetails(roomName);
        if (result.success && result.data?.room) {
            setRoomInfo(result.data.room);
            setIsUserAuthorized(
                result.data.room.leaderId === user.user.id || result.data.room.opponentId === user.user.id,
            );
        } else {
            setIsUserAuthorized(false);
            setRoomInfo(null);
        }
    }, [handleGetRoomDetails, roomName, user]);

    useEffect(() => {
        fetchRoomDetails();
    }, [fetchRoomDetails, user]);

    const startGame = async () => {
        const result = await handleStartGame(roomName);
        if (result.success) {
            setFinalPlayers(null);
            setRoomInfo(result.data.room);
        }
    };

    const restartGame = async () => {
        const result = await handleRestartGame(roomName);
        if (result.success) {
            setFinalPlayers(null);
            setRoomInfo(result.data.room);
        }
    };

    const joinRoom = async () => {
        const result = await handleJoinRoom(roomName);
        if (result.success && result.data?.room) {
            setFinalPlayers(null);
            setRoomInfo(result.data.room);
            setIsUserAuthorized(true);
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

    const handleGameEnd = (players, winnerId, loserId) => {
        setFinalPlayers({ players, winnerId, loserId });
    };

    useEffect(() => {
        if (!roomEvents.roomUpdated) return;
        setRoomInfo(roomEvents.roomUpdated);
        setIsUserAuthorized(
            roomEvents.roomUpdated.leaderId === user?.user?.id || roomEvents.roomUpdated.opponentId === user?.user?.id,
        );
        if (["PENDING", "WAITING", "PROCESSING"].includes(roomEvents.roomUpdated.status)) {
            setFinalPlayers(null);
        }
    }, [roomEvents.roomUpdated, user?.user?.id]);

    if (isLoading && !roomInfo) return <div className="room-loading">Loading room...</div>;
    if (error && !isUserAuthorized) return <div className="room-error">Error: {error}</div>;

    const isCurrentUserLeader = roomInfo?.leaderId === user?.user?.id;
    const isCurrentUserInRoom = roomInfo?.players?.some(player => player.id === user?.user?.id);
    const hasEnoughPlayersToStart = (roomInfo?.players?.length || 0) >= 2;
    const canJoinNextRound = roomInfo && ["PENDING", "WAITING"].includes(roomInfo.status) && !isCurrentUserInRoom && !roomInfo.opponentId;

    if (!isUserAuthorized && !canJoinNextRound) {
        return (
            <div className="room-unauthorized">
                <h1>Access Denied</h1>
                <p>You are not authorized to join this room.</p>
            </div>
        );
    }

    if (!roomInfo) return <div className="room-loading">Loading room...</div>;

    const renderContent = () => {
        const status = roomInfo.status;

        if (finalPlayers) {
            return (
                <GameResults
                    roomInfo={{
                        ...roomInfo,
                        players: finalPlayers.players,
                        winnerId: finalPlayers.winnerId,
                        loserId: finalPlayers.loserId,
                    }}
                    canRestart={isCurrentUserLeader}
                    onRestart={restartGame}
                    onLeave={leaveRoom}
                />
            );
        }

        switch (status) {
            case "PROCESSING":
                return <TetrisGameMultiplayer roomInfo={roomInfo} currentUser={user} onGameEnd={handleGameEnd} />;

            case "COMPLETED":
                return <GameResults roomInfo={roomInfo} canRestart={isCurrentUserLeader} onRestart={restartGame} onLeave={leaveRoom} />;

            case "PENDING":
            case "WAITING":
                return (
                    <div className="gameroom-card">
                        <header className="room-header">
                            <h1 className="room-title">
                                <span>{roomInfo.name}</span>
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
                            {isCurrentUserLeader && hasEnoughPlayersToStart && (
                                <button className="custom-button-play" onClick={startGame}>
                                    <PlayIcon size={24} color="#039BE5" />
                                    Start Game
                                </button>
                            )}

                            {canJoinNextRound && (
                                <button className="custom-button-play" onClick={joinRoom}>
                                    <PlayIcon size={24} color="#039BE5" />
                                    Join
                                </button>
                            )}

                            {isCurrentUserInRoom && (
                                <button className="custom-button-leave" onClick={leaveRoom}>
                                    <LogOutIcon size={24} color="#E53935" />
                                    Leave Room
                                </button>
                            )}
                        </div>
                    </div>
                );
            default:
                return <div className="room-loading">Loading room...</div>;
        }
    };

    return <div className="gameroom-container">{renderContent()}</div>;
};

export default MultiGameRoom;
