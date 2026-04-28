/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Statistics.jsx                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/28 13:30:00 by npatron           #+#    #+#             */
/*   Updated: 2026/04/28 13:30:00 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "./Statistics.css";

import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, Gamepad2, Swords, Trophy } from "lucide-react";
import { useHistory } from "../../composables/useHistory";

const formatDuration = ms => {
    if (!ms || ms <= 0) {
        return "—";
    }
    const totalSeconds = Math.round(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes === 0) {
        return `${seconds}s`;
    }
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
};

const average = values => {
    if (!values.length) {
        return 0;
    }
    const sum = values.reduce((acc, v) => acc + v, 0);
    return sum / values.length;
};

const Statistics = () => {
    const navigate = useNavigate();
    const { matchHistory, soloGameHistory, isLoading, error } = useHistory();

    const soloScores = soloGameHistory.map(game => Number(game.score) || 0);
    const soloDurations = soloGameHistory
        .map(game => Number(game.duration_ms) || 0)
        .filter(duration => duration > 0);

    const matchDurations = matchHistory
        .filter(match => match.created_at && match.ended_at)
        .map(match => new Date(match.ended_at).getTime() - new Date(match.created_at).getTime())
        .filter(duration => duration > 0);

    const totalGames = matchHistory.length + soloGameHistory.length;
    const averageScore = Math.round(average(soloScores));
    const averageSoloTime = average(soloDurations);
    const averageMultiTime = average(matchDurations);

    return (
        <div className="statistics-container">
            <div className="statistics-view">
                <div className="statistics-header">
                    <button className="statistics-back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2>STATISTICS</h2>
                </div>

                {isLoading && <div className="statistics-loading">Loading statistics...</div>}

                {error && <div className="statistics-error">{error}</div>}

                {!isLoading && !error && (
                    <div className="statistics-content">
                        <div className="statistics-card">
                            <Trophy size={24} className="statistics-icon" />
                            <div className="statistics-info">
                                <span className="statistics-label">Average Score</span>
                                <span className="statistics-value">{averageScore.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="statistics-card">
                            <BarChart3 size={24} className="statistics-icon" />
                            <div className="statistics-info">
                                <span className="statistics-label">Games Played</span>
                                <span className="statistics-value">{totalGames}</span>
                            </div>
                        </div>

                        <div className="statistics-card">
                            <Gamepad2 size={24} className="statistics-icon" />
                            <div className="statistics-info">
                                <span className="statistics-label">Avg. Solo Time</span>
                                <span className="statistics-value">{formatDuration(averageSoloTime)}</span>
                            </div>
                        </div>

                        <div className="statistics-card">
                            <Swords size={24} className="statistics-icon" />
                            <div className="statistics-info">
                                <span className="statistics-label">Avg. Multiplayer Time</span>
                                <span className="statistics-value">{formatDuration(averageMultiTime)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Statistics;
