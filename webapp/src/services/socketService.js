/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socketService.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 13:57:35 by npatron           #+#    #+#             */
/*   Updated: 2025/12/12 13:07:42 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { io } from "socket.io-client";

let socket = null;
let isConnected = false;
const eventListeners = new Map();

const connect = (username) => {
	if (socket?.connected) {
		disconnect();
	}

	const normalizedUsername = username?.toString().toLowerCase() || "";
	const query = { username: normalizedUsername };

	socket = io("http://localhost:4000", {
		query: query,
		transports: ["websocket"],
		closeOnBeforeunload: true
	});

	socket.on("connect", () => {
		isConnected = true;
	});

	socket.on("disconnect", () => {
		isConnected = false;
	});

	socket.on("enemyName", (data) => {
		emit("enemyName", data);
	});

	socket.on("enemyDisconnected", (data) => {
		emit("enemyDisconnected", data);
	});

	socket.on("tetrominosGenerated", (data) => {
		emit("tetrominosGenerated", data);
	});

	socket.on("roomUpdated", (data) => {
		emit("roomUpdated", data);
	});

	socket.on("gridUpdate", (data) => {
		emit("gridUpdate", data);
	});

	socket.on("soloGameUpdated", (data) => {
		emit("soloGameUpdated", data);
	});


	return socket;
};

const disconnect = () => {
	if (socket) {
		socket.disconnect();
		socket = null;
		isConnected = false;
	}
};

const on = (event, callback) => {
	if (!eventListeners.has(event)) {
		eventListeners.set(event, []);
	}
	eventListeners.get(event).push(callback);
};

const off = (event, callback) => {
	if (eventListeners.has(event)) {
		const listeners = eventListeners.get(event);
		const index = listeners.indexOf(callback);
		if (index > -1) {
			listeners.splice(index, 1);
		}
	}
};

const emit = (event, data) => {
	if (eventListeners.has(event)) {
		eventListeners.get(event).forEach((callback) => {
			callback(data);
		});
	}
};

const sendMoveMultiplayer = (moveData) => {
	if (socket?.connected) {
		socket.emit("movePieceMultiplayer", moveData);
	}
};

const sendMoveSolo = (moveData) => {
	if (socket?.connected) {
		socket.emit("movePieceSolo", moveData);
	}
};

const getSocket = () => {
	return socket;
};

export const socketService = {
	connect,
	disconnect,
	on,
	off,
	emit,
	sendMoveMultiplayer,
	sendMoveSolo,
	getSocket
};
