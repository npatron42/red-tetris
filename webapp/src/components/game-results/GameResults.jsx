/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   GameResults.jsx                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/11 13:02:48 by npatron           #+#    #+#             */
/*   Updated: 2025/12/11 13:04:56 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './GameResults.css';

export const GameResults = ({ roomInfo, onRestart, onLeave }) => {
    return (
        <div className="game-results-container" style={{ textAlign: 'center', color: 'white' }}>
            <h2>Game Over!</h2>
            <p>Winner: [Player Name]</p>
            <button onClick={onRestart}>Restart Game</button>
            <button onClick={onLeave}>Back to Menu</button>
        </div>
    );
};
