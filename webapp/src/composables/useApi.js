/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   useApi.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 15:20:41 by npatron           #+#    #+#             */
/*   Updated: 2025/12/29 14:49:25 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000"
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// GET METHODS

export const getUser = async () => {
	try {
		const response = await api.get("/user/me");
		return response.data;
	} catch (error) {
		console.error(`Error fetching user data:`, error);
		throw error;
	}
};

export const getHistoryMatchByUsername = async (username) => {
	try {
		const response = await api.get(`/user/get-history-match/${username}`);
		return response.data;
	} catch (error) {
		console.error(`Error getting history match by username:`, error);
		throw error;
	}
};

export const getRoomByName = async (roomName) => {
	try {
		const response = await api.get(`/room/${roomName}`);
		return response.data;
	} catch (error) {
		console.error(`Error getting room:`, error);
		throw error;
	}
};

// POST METHODS

export const createUser = async (username) => {
	try {
		const response = await api.post("/user/create", { username });
		return response.data;
	} catch (error) {
		console.error(`Error fetching user data:`, error);
		throw error;
	}
};

export const loginUser = async (username) => {
	try {
		const response = await api.post("/user/login", { username });
		return response.data;
	} catch (error) {
		console.error(`Error fetching user data:`, error);
		throw error;
	}
};

export const joinRoom = async (roomData) => {
	try {
		const response = await api.post("/room/join", roomData);
		return response.data;
	} catch (error) {
		console.error(`Error joining room:`, error);
		throw error;
	}
};

export const leaveRoom = async (roomData) => {
	try {
		const response = await api.post("/room/leave", roomData);
		return response.data;
	} catch (error) {
		console.error(`Error leaving room:`, error);
		throw error;
	}
};

export const createHistoryMatch = async (historyMatch) => {
	try {
		const response = await api.post("/match/create-history-match", historyMatch);
		return response.data;
	} catch (error) {
		console.error(`Error creating history match:`, error);
		throw error;
	}
};

export const createRoom = async (roomData) => {
	try {
		const response = await api.post("/room/create", roomData);
		return response.data;
	} catch (error) {
		console.error(`Error creating room:`, error);
		throw error;
	}
};

export const startGame = async (roomData) => {
	try {
		const response = await api.post("/room/start-game", roomData);
		return response.data;
	} catch (error) {
		console.error(`Error starting game:`, error);
		throw error;
	}
};

export const createSoloGame = async (username, difficulty) => {
	try {
		const response = await api.post("/solo/create", { username, difficulty });
		return response.data;
	} catch (error) {
		console.error(`Error creating solo game:`, error);
		throw error;
	}
};

export const getSoloGame = async (gameId) => {
	try {
		const response = await api.get(`/solo/${gameId}`);
		return response.data;
	} catch (error) {
		console.error(`Error getting solo game:`, error);
		throw error;
	}
};

export const endSoloGame = async (gameId, score) => {
	try {
		const response = await api.post(`/solo/${gameId}/end`, { score });
		return response.data;
	} catch (error) {
		console.error(`Error ending solo game:`, error);
		throw error;
	}
};
