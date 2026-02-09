/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   History.jsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/08 20:16:46 by npatron           #+#    #+#             */
/*   Updated: 2026/02/09 10:16:41 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "./History.css";

import PropTypes from "prop-types";
import { useState, forwardRef, useImperativeHandle } from "react";
import { useHistory } from "../../composables/useHistory";
import { useUser } from "../../providers/UserProvider";
import { Trophy, Swords, Gamepad2, ArrowLeft } from "lucide-react";

const History = forwardRef(({ children }, ref) => {
    const { user } = useUser();
    const { matchHistory, soloGameHistory, isLoading, error } = useHistory();
    const [isHistoryActivated, setIsHistoryActivated] = useState(false);

    const totalMultiplayerGames = matchHistory.length;
    const totalSoloGames = soloGameHistory.length;
    const multiplayerWins = matchHistory.filter(match => match.winnerId === user?.user?.id).length;
    const multiplayerLosses = totalMultiplayerGames - multiplayerWins;
    console.log(soloGameHistory);
    console.log(matchHistory);
    useImperativeHandle(ref, () => ({
        toggleHistory: () => setIsHistoryActivated(prev => !prev),
    }));

    return (
        <div className="history-container">
            {!isHistoryActivated ? (
                <>{children}</>
            ) : (
                <div className="history-view">
                    <div className="history-header">
                        <button className="history-back-btn" onClick={() => setIsHistoryActivated(false)}>
                            <ArrowLeft size={24} />
                        </button>
                        <h2>MATCH HISTORY</h2>
                    </div>

                    {isLoading && <div className="history-loading">Loading history...</div>}

                    {error && <div className="history-error">{error}</div>}

                    {!isLoading && !error && (
                        <div className="history-content">
                            <div className="history-stats">
                                <div className="stat-card">
                                    <Swords size={24} className="stat-icon" />
                                    <div className="stat-info">
                                        <span className="stat-label">Multiplayer</span>
                                        <span className="stat-value">
                                            {multiplayerWins}W - {multiplayerLosses}L
                                        </span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <Gamepad2 size={24} className="stat-icon" />
                                    <div className="stat-info">
                                        <span className="stat-label">Solo Games</span>
                                        <span className="stat-value">{totalSoloGames}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="history-section">
                                <h3>
                                    <Swords size={20} /> Multiplayer
                                </h3>
                                {matchHistory.length === 0 ? (
                                    <p className="history-empty">No multiplayer matches yet</p>
                                ) : (
                                    <div className="history-list">
                                        {matchHistory.map(match => {
                                            const isWinner = match.winnerId === user?.user?.id;
                                            return (
                                                <div key={match.id} className={`history-item ${isWinner ? "win" : "loss"}`}>
                                                    <div className="history-item-icon">
                                                        {isWinner ? <Trophy size={18} /> : <span>×</span>}
                                                    </div>
                                                    <div className="history-item-info">
                                                        <span className="history-item-result">{isWinner ? "Victory" : "Defeat"}</span>
                                                        <span className="history-item-date">
                                                            {new Date(match.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="history-section">
                                <h3>
                                    <Gamepad2 size={20} /> Solo
                                </h3>
                                {soloGameHistory.length === 0 ? (
                                    <p className="history-empty">No solo games yet</p>
                                ) : (
                                    <div className="history-list">
                                        {soloGameHistory.map(game => (
                                            <div key={game.id} className="history-item solo">
                                                <div className="history-item-info">
                                                    <span className="history-item-result">Score: {game.score || 0}</span>
                                                    <span className="history-item-date">
                                                        {new Date(game.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

History.displayName = "History";

History.propTypes = {
    children: PropTypes.node,
};

export default History;
