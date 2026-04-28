/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   useRoom.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 14:20:43 by npatron           #+#    #+#             */
/*   Updated: 2026/02/02 13:00:48 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useCallback, useState } from "react";
import { createRoom, getRoomByName, joinRoom, leaveRoom, startGame } from "./useApi";
import { parseRoomName } from "../utils/roomName";

export const useRoom = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreateRoom = useCallback(async roomName => {
        const parsedRoomName = parseRoomName(roomName);
        if (!parsedRoomName) {
            return { success: false, error: "Room name is required" };
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await createRoom(parsedRoomName);
            return { success: true, data: response };
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to create room";
            setError(message);
            return { success: false, error: message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const isUserAllowedToJoinARoom = useCallback(async (roomName, userId) => {
        const parsedRoomName = parseRoomName(roomName);
        if (!parsedRoomName) {
            return { success: false, error: "Room name is required" };
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await getRoomByName(parsedRoomName);
            if (!response.success || !response.room) {
                return { success: false, error: "Room not found" };
            }
            if (response.room.leaderId === userId || response.room.opponentId === userId) {
                return { success: true, data: response };
            }
            return { success: false, error: "User is not allowed to join this room" };
        } catch (err) {
            setError("Failed to check room access", err);
            return { success: false, error: err.message || "Failed to check room access" };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleJoinRoom = useCallback(async roomName => {
        const parsedRoomName = parseRoomName(roomName);
        if (!parsedRoomName) {
            return { success: false, error: "Room name is required" };
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await joinRoom(parsedRoomName);
            if (response.success) {
                return { success: true, data: response };
            }
            return { success: false, error: response.message || "Failed to join room" };
        } catch (err) {
            setError("Failed to join room", err);
            return {
                success: false,
                error: err.response?.data?.message || err.message || "Failed to join room",
            };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLeaveRoom = useCallback(async roomName => {
        const parsedRoomName = parseRoomName(roomName);
        if (!parsedRoomName) {
            return { success: false, error: "Room name is required" };
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await leaveRoom(parsedRoomName);
            if (response.success) {
                return { success: true, data: response };
            }
            return { success: false, error: response.message || "Failed to leave room" };
        } catch (err) {
            setError("Failed to leave room", err);
            return {
                success: false,
                error: err.response?.data?.message || err.message || "Failed to leave room",
            };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleStartGame = useCallback(async roomName => {
        const parsedRoomName = parseRoomName(roomName);
        if (!parsedRoomName) {
            return { success: false, error: "Room name is required" };
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await startGame(parsedRoomName);
            return { success: true, data: response };
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to start game";
            setError(message);
            return { success: false, error: message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        handleCreateRoom,
        isUserAllowedToJoinARoom,
        handleJoinRoom,
        handleLeaveRoom,
        handleStartGame,
        isLoading,
        error,
    };
};
