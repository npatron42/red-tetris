/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   api.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/17 15:20:41 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 14:40:35 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import axios from "axios";

export const getUser = async () => {
	try {
		const response = await axios.get("http://localhost:8000/user/me");
		return response.data;
	} catch (error) {
		console.error(`Error fetching user data:`, error);
		throw error;
	}
};

export const getHistoryMatchByUsername = async (username) => {
	try {
		const body = {
			username: username
		};
		const response = await axios.post(`http://localhost:8000/user/get-history-match`, body);
		return response.data;
	} catch (error) {
		console.error(`Error getting history match by username:`, error);
		throw error;
	}
};

// POST METHODS

export const createUser = async (username) => {
	try {
		const response = await axios.post("http://localhost:8000/user/create", username);
		return response.data;
	} catch (error) {
		console.error(`Error fetching user data:`, error);
		throw error;
	}
};

export const createHistoryMatch = async (historyMatch) => {
	try {
		const response = await axios.post("http://localhost:8000/match/create-history-match", historyMatch);
		return response.data;
	} catch (error) {
		console.error(`Error creating history match:`, error);
		throw error;
	}
};

export const createRoom = async (roomData) => {
	try {
		const response = await axios.post("http://localhost:8000/room/create", roomData);
		return response.data;
	} catch (error) {
		console.error(`Error creating room:`, error);
		throw error;
	}
};
