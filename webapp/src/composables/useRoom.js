/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   useRoom.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 14:20:43 by npatron           #+#    #+#             */
/*   Updated: 2025/12/09 11:49:39 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import { createRoom } from "./useApi";

export const useRoom = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleCreateRoom = async (roomData) => {
		setIsLoading(true);
		setError(null);
		try {
			console.log("Creating room", roomData);
			const response = await createRoom(roomData);
			return { success: true, data: response };
		} catch (err) {
			setError("Failed to create room", err);
			return { success: false, error: err.message };
		} finally {
			setIsLoading(false);
		}
	};

	return {
		handleCreateRoom,
		isLoading,
		error
	};
};
