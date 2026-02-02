/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   SoloGame.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/29 14:47:08 by npatron           #+#    #+#             */
/*   Updated: 2026/02/02 16:53:21 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "./SoloGame.css";

import { useState } from "react";
import { useParams } from "react-router-dom";
import { TetrisGameSolo } from "../tetris-game-solo/TetrisGameSolo";

const SoloGameResult = ({ score }) => {
    return (
        <div className="solo-game-result">
            <div className="solo-game-result-card">
                <h1 className="solo-game-result-title">Game Completed</h1>
                <div className="solo-game-result-score">
                    <div className="solo-game-result-label">Final Score</div>
                    <div className="solo-game-result-value">{score}</div>
                </div>
            </div>
        </div>
    );
};

export const SoloGame = () => {
    const { gameId } = useParams();
    const [finalScore, setFinalScore] = useState(null);

    const handleGameCompleted = score => {
        setFinalScore(score);
    };

    return (
        <div className="solo-game-container">
            {finalScore !== null ? (
                <SoloGameResult score={finalScore} />
            ) : (
                <TetrisGameSolo gameId={gameId} onGameCompleted={handleGameCompleted} />
            )}
        </div>
    );
};
