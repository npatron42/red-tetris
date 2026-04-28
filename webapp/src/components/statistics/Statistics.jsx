/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Statistics.jsx                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/28 13:30:00 by npatron           #+#    #+#             */
/*   Updated: 2026/04/28 16:42:50 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "./Statistics.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, Crown, Gamepad2, Layers, Percent, Sparkles, Swords, Trophy } from "lucide-react";
import { useHistory } from "../../composables/useHistory";
import { useUser } from "../../providers/UserProvider";

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

const StatCard = ({ icon: Icon, label, value }) => (
    <div className="statistics-card">
        <Icon size={24} className="statistics-icon" />
        <div className="statistics-info">
            <span className="statistics-label">{label}</span>
            <span className="statistics-value">{value}</span>
        </div>
    </div>
);

const Statistics = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { matchHistory, soloGameHistory, matchPlayers, isLoading, error } = useHistory();
    const [activeTab, setActiveTab] = useState("solo");

    const currentUserId = user?.user?.id;
    const soloScores = soloGameHistory.map(game => Number(game.score) || 0);
    const soloLines = soloGameHistory.map(game => Number(game.lines_cleared) || 0);
    const soloDurations = soloGameHistory
        .map(game => Number(game.duration_ms) || 0)
        .filter(duration => duration > 0);

    const multiScores = matchPlayers.map(mp => Number(mp.score) || 0);
    const multiLines = matchPlayers.map(mp => Number(mp.lines_cleared) || 0);
    const matchDurations = matchPlayers
        .map(mp => Number(mp.duration_ms) || 0)
        .filter(duration => duration > 0);

    const soloStats = {
        games: soloGameHistory.length,
        avgScore: Math.round(average(soloScores)),
        bestScore: soloScores.length ? Math.max(...soloScores) : 0,
        avgTime: average(soloDurations),
        avgLines: Math.round(average(soloLines) * 10) / 10,
        totalLines: soloLines.reduce((acc, n) => acc + n, 0),
    };

    const multiStats = {
        games: matchHistory.length,
        avgScore: Math.round(average(multiScores)),
        bestScore: multiScores.length ? Math.max(...multiScores) : 0,
        avgTime: average(matchDurations),
        avgLines: Math.round(average(multiLines) * 10) / 10,
        totalLines: multiLines.reduce((acc, n) => acc + n, 0),
        winRate:
            currentUserId && matchHistory.length
                ? Math.round((matchHistory.filter(m => m.winner_id === currentUserId).length / matchHistory.length) * 100)
                : 0,
    };

    return (
        <div className="statistics-container">
            <div className="statistics-view">
                <div className="statistics-header">
                    <button className="statistics-back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2>STATISTICS</h2>
                </div>

                <div className="statistics-tabs">
                    <button
                        className={`statistics-tab ${activeTab === "solo" ? "active" : ""}`}
                        onClick={() => setActiveTab("solo")}
                    >
                        <Gamepad2 size={16} />
                        <span>SOLO</span>
                    </button>
                    <button
                        className={`statistics-tab ${activeTab === "multi" ? "active" : ""}`}
                        onClick={() => setActiveTab("multi")}
                    >
                        <Swords size={16} />
                        <span>MULTI</span>
                    </button>
                </div>

                {isLoading && <div className="statistics-loading">Loading statistics...</div>}

                {error && <div className="statistics-error">{error}</div>}

                {!isLoading && !error && activeTab === "solo" && (
                    <div className="statistics-content">
                        <StatCard icon={BarChart3} label="Games Played" value={soloStats.games} />
                        <StatCard icon={Sparkles} label="Avg. Score" value={soloStats.avgScore.toLocaleString()} />
                        <StatCard icon={Crown} label="Best Score" value={soloStats.bestScore.toLocaleString()} />
                        <StatCard icon={Gamepad2} label="Avg. Time" value={formatDuration(soloStats.avgTime)} />
                        <StatCard icon={Layers} label="Avg. Lines / Game" value={soloStats.avgLines} />
                        <StatCard icon={Trophy} label="Total Lines" value={soloStats.totalLines.toLocaleString()} />
                    </div>
                )}

                {!isLoading && !error && activeTab === "multi" && (
                    <div className="statistics-content">
                        <StatCard icon={BarChart3} label="Games Played" value={multiStats.games} />
                        <StatCard icon={Sparkles} label="Avg. Score" value={multiStats.avgScore.toLocaleString()} />
                        <StatCard icon={Crown} label="Best Score" value={multiStats.bestScore.toLocaleString()} />
                        <StatCard icon={Swords} label="Avg. Time" value={formatDuration(multiStats.avgTime)} />
                        <StatCard icon={Layers} label="Avg. Lines / Match" value={multiStats.avgLines} />
                        <StatCard icon={Trophy} label="Total Lines" value={multiStats.totalLines.toLocaleString()} />
                        <StatCard icon={Percent} label="Win Rate" value={`${multiStats.winRate}%`} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Statistics;
