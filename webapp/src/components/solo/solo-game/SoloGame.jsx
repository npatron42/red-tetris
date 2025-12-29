/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   SoloGame.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/29 14:47:08 by npatron           #+#    #+#             */
/*   Updated: 2025/12/29 16:24:42 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

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
