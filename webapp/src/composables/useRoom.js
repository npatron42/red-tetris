/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   useRoom.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 14:20:43 by npatron           #+#    #+#             */
/*   Updated: 2026/01/31 11:17:29 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useCallback, useState } from "react";
import { createRoom, getRoomByName, joinRoom, leaveRoom, startGame } from "./useApi";

export const useRoom = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleCreateRoom = useCallback(async (roomName) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await createRoom(roomName);
			return { success: true, data: response };
		} catch (err) {
			setError("Failed to create room", err);
			return { success: false, error: err.message };
		} finally {
			setIsLoading(false);
		}
	}, []);

	const isUserAllowedToJoinARoom = useCallback(async (roomName, userId) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await getRoomByName(roomName);
			console.log("response isUserAllowedToJoinARoom", response);
			if (!response.success || !response.room) {
				return { success: false, error: "Room not found" };
			}
            console.log("response.room.leaderId", response.room.leaderId);
            console.log("userId", userId);
            console.log("response.room.opponentId", response.room.opponentId);
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

	const handleJoinRoom = useCallback(async (roomName) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await joinRoom(roomName);
			if (response.success) {
				return { success: true, data: response };
			}
			return { success: false, error: response.message || "Failed to join room" };
		} catch (err) {
			setError("Failed to join room", err);
			return { success: false, error: err.response?.data?.message || err.message || "Failed to join room" };
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handleLeaveRoom = useCallback(async (roomName) => {
		if (!roomName) {
			return { success: false, error: "Room name is required" };
		}
		setIsLoading(true);
		setError(null);
		try {
			const response = await leaveRoom(roomName);
			if (response.success) {
				return { success: true, data: response };
			}
			return { success: false, error: response.message || "Failed to leave room" };
		} catch (err) {
			setError("Failed to leave room", err);
			return { success: false, error: err.response?.data?.message || err.message || "Failed to leave room" };
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handleStartGame = useCallback(async (roomName) => {
		setIsLoading(true);
		setError(null);
		try {
            console.log("ICI --> handleStartGame", { roomName });
			const response = await startGame(roomName);
			return { success: true, data: response };
		} catch (err) {
			setError("Failed to start game", err);
			return { success: false, error: err.message || "Failed to start game" };
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
		error
	};
};
