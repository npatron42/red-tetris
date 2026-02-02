/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   GameResults.jsx                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/11 13:02:48 by npatron           #+#    #+#             */
/*   Updated: 2025/12/29 14:50:37 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "./GameResults.css";
import { Trophy, Award } from "lucide-react";

export const GameResults = ({ roomInfo, onRestart, onLeave }) => {
    const players = roomInfo.players || [];
    const sortedPlayers = [...players].sort((a, b) => (b.currentScore || 0) - (a.currentScore || 0));
    const winner = sortedPlayers[0];

    return (
        <div className="game-results-container">
            <div className="game-results-card">
                <div className="results-header">
                    <Trophy size={48} color="#FFD700" />
                    <h1 className="results-title">Game Over!</h1>
                </div>

                <div className="winner-section">
                    <Award size={32} color="#FFD700" />
                    <h2 className="winner-name">{winner?.name || "Unknown"}</h2>
                    <p className="winner-label">Winner!</p>
                </div>

                <div className="players-scores">
                    {sortedPlayers.map((player, index) => (
                        <div key={player.id || index} className={`player-score-item ${index === 0 ? "winner-item" : ""}`}>
                            <span className="player-rank">#{index + 1}</span>
                            <span className="player-name-result">{player.name}</span>
                            <span className="player-final-score">{(player.currentScore || 0).toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                <div className="results-actions">
                    <button className="custom-button-play" onClick={onRestart}>
                        Restart Game
                    </button>
                    <button className="custom-button-leave" onClick={onLeave}>
                        Back to Menu
                    </button>
                </div>
            </div>
        </div>
    );
};
