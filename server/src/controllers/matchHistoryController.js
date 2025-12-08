/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   matchHistoryController.js                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 12:56:35 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 13:01:25 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { MatchHistoryManager } from "../manager/matchHistoryManager.js";

const matchHistoryManager = new MatchHistoryManager();

export const createHistoryMatch = async (req, res) => {
	try {
		const { players, winner } = req.body;
		if (!players || !winner) {
			res.json({ failure: "Players and winner are required" });
			return;
		}
		const match = await matchHistoryManager.createMatchHistory(players, winner);
		res.json({ success: "Match history created", match });
	} catch (error) {
		res.json({ failure: error.message || "Error creating history match" });
	}
};

export const getHistoryMatchByUsername = async (req, res) => {
	try {
		const username = req.query.username || req.body.username;
		if (!username) {
			res.json({ failure: "Username is required" });
			return;
		}
		const matchHistory = await matchHistoryManager.getMatchHistoryByUsername(username);
		res.json({ success: "Match history retrieved", matchHistory });
	} catch (error) {
		res.json({ failure: error.message || "Error getting history match by username" });
	}
};
