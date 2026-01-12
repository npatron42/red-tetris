/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   matchHistoryController.js                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 12:56:35 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 15:25:48 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import matchHistoryService from "../services/matchHistoryService.js";

export const createHistoryMatch = async (req, res) => {
	try {
		const { playerIds, winnerId } = req.body;
		if (!playerIds || !winnerId) {
			return res.status(400).json({ success: false, message: "Player IDs and winner ID are required" });
		}
		const match = await matchHistoryService.createMatchHistory(playerIds, winnerId);
		res.json({ success: true, message: "Match history created", match });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message || "Error creating history match" });
	}
};

export const getHistoryMatch = async (req, res) => {
	try {
		const userId = req.user.id;
		const matchHistory = await matchHistoryService.getMatchHistoryByUserId(userId);
		res.json({ success: true, message: "Match history retrieved", matchHistory });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message || "Error getting history match" });
	}
};
