/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PlayComponent.jsx                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/06 17:01:45 by npatron           #+#    #+#             */
/*   Updated: 2026/04/28 14:35:05 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "./PlayComponent.css";

import { BarChart3, Swords } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../providers/UserProvider";

export const PlayComponent = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    return (
        <div className="play-container">
            <div className="play-header-container">
                <div className="play-header-center">
                    <span>PLAY</span>
                </div>
                {user && (
                    <div className="play-header-actions">
                        <button
                            className="header-icon-btn"
                            onClick={() => navigate("/history")}
                            aria-label="View match history"
                        >
                            <Swords size={24} color="#FFC4D9" />
                        </button>
                        <button
                            className="header-icon-btn"
                            onClick={() => navigate("/statistics")}
                            aria-label="View statistics"
                        >
                            <BarChart3 size={24} color="#FFC4D9" />
                        </button>
                    </div>
                )}
            </div>
            {user ? (
                <div className="play-button-container">
                    <button className="play-button" onClick={() => navigate("/solo/game-room")}>
                        SOLO
                    </button>
                    <button className="play-button" onClick={() => navigate("/create-room")}>
                        CREATE
                    </button>
                    <button className="play-button" onClick={() => navigate("/join-room")}>
                        JOIN
                    </button>
                </div>
            ) : (
                <div className="play-button-container">
                    <button className="play-button" onClick={() => navigate("/login")}>
                        Login to continue
                    </button>
                </div>
            )}
        </div>
    );
};
