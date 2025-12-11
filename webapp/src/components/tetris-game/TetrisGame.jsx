/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   TetrisGame.jsx                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/11 13:02:55 by npatron           #+#    #+#             */
/*   Updated: 2025/12/11 13:04:49 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './TetrisGame.css';

export const TetrisGame = ({ roomInfo, currentUser }) => {
    return (
        <div className="game-board-container" style={{ textAlign: 'center', color: 'white' }}>
            <h2>Tetris Game Running...</h2>
            <p>Playing in room: {roomInfo.name}</p>
        </div>
    );
};