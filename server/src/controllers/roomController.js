/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   roomController.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 15:57:50 by npatron           #+#    #+#             */
/*   Updated: 2026/02/02 16:07:12 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import roomService from "../services/roomService.js";
import pino from "pino";

const logger = pino({
    level: "info",
});

export const create = async (req, res) => {
    try {
        const { name } = req.body;
        const leaderId = req.user.id;
        if (!name) {
            logger.error("Room name is required", { name });
            return res.status(400).json({ success: false, message: "Room name is required" });
        }
        const isRoomNameValid = await roomService.isRoomNameValid(name);
        if (!isRoomNameValid) {
            return res.status(400).json({ success: false, message: "Room name is already taken" });
        }
        const room = await roomService.createRoom(name, leaderId);
        res.json({ success: true, room });
    } catch (error) {
        logger.error("Error creating room", { error });
        res.status(500).json({ success: false, message: error.message || "Error creating room" });
    }
};

export const getByName = async (req, res) => {
    try {
        const { roomName } = req.params;
        const room = await roomService.getRoomByName(roomName);
        if (!room) {
            logger.info("Room not found", { roomName });
            return res.status(404).json({ success: false, message: "Room not found" });
        }
        logger.info("Room retrieved", { room });
        res.json({ success: true, room });
    } catch (error) {
        logger.error("Error getting room by name", { error });
        res.status(500).json({ success: false, message: error.message || "Error getting room by name" });
    }
};

export const joinRoomByName = async (req, res) => {
    try {
        const { roomName } = req.body;
        const userId = req.user.id;
        if (!roomName) {
            logger.error("Room name is required to join", { roomName });
            return res.status(400).json({ success: false, message: "Room name is required" });
        }
        logger.info("Joining room", { roomName, userId });
        const room = await roomService.joinRoom(roomName, userId);
        res.json({ success: true, room });
    } catch (error) {
        logger.error("Error joining room", { error });
        res.status(500).json({ success: false, message: error.message || "Error joining room" });
    }
};

export const leaveRoom = async (req, res) => {
    try {
        const { roomName } = req.body;
        const userId = req.user.id;
        if (!roomName) {
            logger.error("Room name is required to leave", { roomName });
            return res.status(400).json({ success: false, message: "Room name is required" });
        }
        const room = await roomService.removePlayer(roomName, userId);
        res.json({ success: true, room });
    } catch (error) {
        logger.error("Error leaving room", { error });
        res.status(500).json({ success: false, message: error.message || "Error leaving room" });
    }
};

export const getAll = async (req, res) => {
    try {
        const rooms = await roomService.getAllRooms();
        res.json({ success: true, rooms });
    } catch (error) {
        logger.error("Error getting rooms", { error });
        res.status(500).json({ success: false, message: error.message || "Error getting rooms" });
    }
};

export const startGame = async (req, res) => {
    try {
        logger.info("Starting game", { body: req.body, userId: req.user.id });
        const { roomName } = req.body;
        if (!roomName) {
            return res.status(400).json({ success: false, message: "Room name is required" });
        }
        const room = await roomService.startGame(roomName);
        res.json({ success: true, room });
    } catch (error) {
        logger.error("Error starting game", { error });
        res.status(500).json({ success: false, message: error.message || "Error starting game" });
    }
};
