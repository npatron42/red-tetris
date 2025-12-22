/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   soloGameController.js                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/11 18:24:30 by npatron           #+#    #+#             */
/*   Updated: 2025/12/22 17:31:05 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import pino from "pino";
import { SoloGameService } from "../services/soloGameService.js";

const logger = pino({ level: "info" });
const soloGameService = new SoloGameService();

export const createSoloGame = async (req, res) => {
	try {
		const { username, difficulty } = req.body;
		if (!username) {
			return res.status(400).json({
				success: false,
				message: "Username is required"
			});
		}

		const gameData = await soloGameService.createSoloGame(username, difficulty);

		return res.status(201).json({
			success: true,
			data: gameData
		});
	} catch (error) {
		logger.error("Error creating solo game:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to create solo game"
		});
	}
};

export const getSoloGame = async (req, res) => {
	try {
		const { gameId } = req.params;

		if (!gameId) {
			return res.status(400).json({
				success: false,
				message: "Game ID is required"
			});
		}

		const gameData = await soloGameService.getSoloGame(gameId);

		if (!gameData) {
			return res.status(404).json({
				success: false,
				message: "Game not found"
			});
		}

		return res.status(200).json({
			success: true,
			data: gameData
		});
	} catch (error) {
		logger.error("Error getting solo game:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to get solo game"
		});
	}
};

export const endSoloGame = async (req, res) => {
	try {
		const { gameId } = req.params;
		const { score } = req.body;

		if (!gameId) {
			return res.status(400).json({
				success: false,
				message: "Game ID is required"
			});
		}

		await soloGameService.endSoloGame(gameId, score);

		return res.status(200).json({
			success: true,
			message: "Game ended successfully"
		});
	} catch (error) {
		logger.error("Error ending solo game:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to end solo game"
		});
	}
};
