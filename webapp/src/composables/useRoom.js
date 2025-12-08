/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   useRoom.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 13:04:10 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 13:08:23 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import { createRoom } from "../api/api";

export const useRoom = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const createRoomMutation = async (roomData) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await createRoom(roomData);
			return { success: true, data: response };
		} catch (err) {
			setError("Failed to create room", err.message);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	};

	return {
		createRoom: createRoomMutation,
		isLoading,
		error
	};
};
