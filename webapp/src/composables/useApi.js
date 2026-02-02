/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   useApi.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 15:20:41 by npatron           #+#    #+#             */
/*   Updated: 2026/02/02 16:57:31 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

api.interceptors.request.use(config => {
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

export const getHistoryMatch = async () => {
    try {
        const response = await api.get("/match-history/me");
        return response.data;
    } catch (error) {
        console.error(`Error getting history match:`, error);
        throw error;
    }
};

export const getRoomByName = async roomName => {
    try {
        const response = await api.get(`/room/${roomName}`);
        return response.data;
    } catch (error) {
        console.error(`Error getting room:`, error);
        throw error;
    }
};

export const getAllRooms = async () => {
    try {
        const response = await api.get("/room/");
        return response.data;
    } catch (error) {
        console.error(`Error getting all rooms:`, error);
        throw error;
    }
};

// POST METHODS

export const createUser = async name => {
    try {
        const response = await api.post("/user/create", { name });
        return response.data;
    } catch (error) {
        console.error(`Error creating user:`, error);
        throw error;
    }
};

export const joinRoom = async roomName => {
    try {
        const response = await api.post("/room/join", { roomName });
        return response.data;
    } catch (error) {
        console.error(`Error joining room:`, error);
        throw error;
    }
};

export const leaveRoom = async roomName => {
    try {
        const response = await api.post("/room/leave", { roomName });
        return response.data;
    } catch (error) {
        console.error(`Error leaving room:`, error);
        throw error;
    }
};

export const createHistoryMatch = async (playerIds, winnerId) => {
    try {
        const response = await api.post("/match-history/create", { playerIds, winnerId });
        return response.data;
    } catch (error) {
        console.error(`Error creating history match:`, error);
        throw error;
    }
};

export const createRoom = async name => {
    try {
        const response = await api.post("/room/create", { name });
        return response.data;
    } catch (error) {
        console.error(`Error creating room:`, error.response.data.message);
        throw error;
    }
};

export const startGame = async roomName => {
    try {
        const response = await api.post("/room/start-game", { roomName });
        return response.data;
    } catch (error) {
        console.error(`Error starting game:`, error);
        throw error;
    }
};

export const createSoloGame = async difficulty => {
    try {
        const response = await api.post("/solo/create", { difficulty });
        return response.data;
    } catch (error) {
        console.error(`Error creating solo game:`, error);
        throw error;
    }
};

export const getSoloGame = async gameId => {
    try {
        const response = await api.get(`/solo/${gameId}`);
        return response.data;
    } catch (error) {
        console.error(`Error getting solo game:`, error);
        throw error;
    }
};

export const endSoloGame = async (gameId, gameData) => {
    try {
        const response = await api.post(`/solo/${gameId}/end`, { gameData });
        return response.data;
    } catch (error) {
        console.error(`Error ending solo game:`, error);
        throw error;
    }
};
