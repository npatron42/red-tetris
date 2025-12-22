/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   useSoloGame.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/11 17:59:32 by npatron           #+#    #+#             */
/*   Updated: 2025/12/22 17:35:17 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import { createSoloGame, getSoloGame, endSoloGame } from "./useApi";

export const useSoloGame = () => {
	const [gameId, setGameId] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const createGame = async (username, difficulty) => {
		try {
			setLoading(true);
			const response = await createSoloGame(username, difficulty);
			if (response.success) {
				setGameId(response.data.gameId);
				return response.data.gameId;
			}
		} catch (error) {
			setError(error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getGame = async (id) => {
		try {
			setLoading(true);
			const response = await getSoloGame(id);
			return response.data;
		} catch (error) {
			setError(error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const endGame = async (id, score) => {
		try {
			setLoading(true);
			await endSoloGame(id, score);
		} catch (error) {
			setError(error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	return { gameId, loading, error, createGame, getGame, endGame };
};
