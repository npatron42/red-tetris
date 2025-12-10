/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   useRoom.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 14:20:43 by npatron           #+#    #+#             */
/*   Updated: 2025/12/10 13:45:22 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useCallback, useState } from "react";
import { createRoom, getRoomByName, joinRoom, leaveRoom } from "./useApi";

export const useRoom = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleCreateRoom = useCallback(async (roomData) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await createRoom(roomData);
			return { success: true, data: response };
		} catch (err) {
			setError("Failed to create room", err);
			return { success: false, error: err.message };
		} finally {
			setIsLoading(false);
		}
	}, []);

	const isUserAllowedToJoinARoom = useCallback(async (roomName, username) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await getRoomByName(roomName);
			if (!response.success || !response.room) {
				return { success: false, error: "Room not found" };
			}
			const normalizedUsername = username.toLowerCase();
			const normalizedPlayers = response.room.players
				.filter((player) => player !== null && player !== undefined)
				.map((player) => player.toLowerCase());
			if (normalizedPlayers.includes(normalizedUsername)) {
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

	const handleJoinRoom = useCallback(async (roomData) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await joinRoom(roomData);
			if (response.success) {
				return { success: true, data: response };
			}
			return { success: false, error: response.failure || "Failed to join room" };
		} catch (err) {
			setError("Failed to join room", err);
			return { success: false, error: err.response?.data?.failure || err.message || "Failed to join room" };
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handleLeaveRoom = useCallback(
		async (roomData) => {
			if (!roomData?.roomName || !roomData?.username) {
				return { success: false, error: "Room name and username are required" };
			}
			setIsLoading(true);
			setError(null);
			try {
				const response = await leaveRoom(roomData);
				if (response.success) {
					return { success: true, data: response };
				}
				return { success: false, error: response.failure || "Failed to leave room" };
			} catch (err) {
				setError("Failed to leave room", err);
				return { success: false, error: err.response?.data?.failure || err.message || "Failed to leave room" };
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return {
		handleCreateRoom,
		isUserAllowedToJoinARoom,
		handleJoinRoom,
		handleLeaveRoom,
		isLoading,
		error
	};
};
