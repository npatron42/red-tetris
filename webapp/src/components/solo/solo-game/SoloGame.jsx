/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   SoloGame.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/29 14:47:08 by npatron           #+#    #+#             */
/*   Updated: 2025/12/29 15:12:58 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "./SoloGame.css";

import { useParams } from "react-router-dom";
import { TetrisGameSolo } from "../tetris-game-solo/TetrisGameSolo";

export const SoloGame = () => {
	const { gameId } = useParams();
	return (
		<div className="solo-game-container">
			<TetrisGameSolo gameId={gameId} />
		</div>
	);
};
