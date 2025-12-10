/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   roomController.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 15:57:50 by npatron           #+#    #+#             */
/*   Updated: 2025/12/09 18:07:36 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import roomService from "../services/roomService.js";
import pino from "pino";

const logger = pino({
	level: "info"
});

export const create = async (req, res) => {
	try {
		const { name, leaderUsername } = req.body;
		if (!name || !leaderUsername) {
			logger.error("Name and leaderUsername are required", { name, leaderUsername });
			res.json({ failure: "Name and leaderUsername are required" });
			return;
		}
		const room = roomService.createRoom(name, leaderUsername);
		res.json({ success: true, room });
	} catch (error) {
		logger.error("Error creating room", { error });
		res.json({ failure: error.message || "Error creating room" });
	}
};

export const getByName = async (req, res) => {
	try {
		const { roomName } = req.params;
		const room = roomService.getRoomByName(roomName);
		if (!room) {
			logger.info("Room not found", { roomName });
			res.json({ success: false, failure: "Room not found" });
			return;
		}
		logger.info("Room retrieved", { room });
		res.json({ success: true, room });
	} catch (error) {
		logger.error("Error getting room by name", { error });
		res.json({ success: false, failure: error.message || "Error getting room by name" });
	}
};

export const joinRoomByName  = async (req, res) => {
	try {
		const { roomName, username } = req.body;
        logger.info("Joining room", { roomName, username });
		const room = roomService.joinRoom(roomName, username);
		res.json({ success: true, room });
	} catch (error) {
		logger.error("Error joining room", { error });
		res.json({ failure: error.message || "Error joining room" });
	}
};

export const leaveRoom = async (req, res) => {
	try {
		
		logger.info("Leaving room", { body: req.body });
		const { roomName, username } = req.body;
		if (!roomName || !username) {
			logger.error("Room name and username are required to leave", { roomName, username });
			res.json({ success: false, failure: "Room name and username are required" });
			return;
		}
		logger.info("Leaving room", { roomName, username });
		const room = roomService.removePlayer(roomName, username);
		res.json({ success: true, room });
	} catch (error) {
		logger.error("Error leaving room", { error });
		res.json({ success: false, failure: error.message || "Error leaving room" });
	}
};

export const getAll = async (req, res) => {
	try {
		const rooms = roomService.getAllRooms();
		res.json({ success: "Rooms retrieved", rooms });
	} catch (error) {
		logger.error("Error getting rooms", { error });
		res.json({ failure: error.message || "Error getting rooms" });
	}
};
