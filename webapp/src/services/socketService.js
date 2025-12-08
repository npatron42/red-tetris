/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socketService.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 13:57:35 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 15:42:58 by npatron          ###   ########.fr       */
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

	const query = { username: username };

	socket = io("http://localhost:8000", {
		query: query,
		transports: ["websocket"],
		closeOnBeforeunload: true
	});

	socket.on("connect", () => {
		isConnected = true;
		console.log("Connected to socket");
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

const sendMove = (moveData) => {
	if (socket?.connected) {
		socket.emit("move", moveData);
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
	sendMove,
	getSocket
};
