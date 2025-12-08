/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   roomController.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 15:57:50 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 15:57:52 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


import roomService from "../services/roomService.js";

export const create = async (req, res) => {
	try {
		const { name, leaderUsername } = req.body;
		if (!name || !leaderUsername) {
			res.json({ failure: "Name and leaderUsername are required" });
			return;
		}
		const room = roomService.createRoom(name, leaderUsername);
		res.json({ success: "Room created", room });
	} catch (error) {
		res.json({ failure: error.message || "Error creating room" });
	}
};

export const getAll = async (req, res) => {
	try {
		const rooms = roomService.getAllRooms();
		res.json({ success: "Rooms retrieved", rooms });
	} catch (error) {
		res.json({ failure: error.message || "Error getting rooms" });
	}
};

export const getById = async (req, res) => {
	try {
		const { id } = req.params;
		const room = roomService.getRoom(id);
		if (!room) {
			res.json({ failure: "Room not found" });
			return;
		}
		res.json({ success: "Room retrieved", room });
	} catch (error) {
		res.json({ failure: error.message || "Error getting room" });
	}
};
