/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PlayComponent.jsx                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/06 17:01:45 by npatron           #+#    #+#             */
/*   Updated: 2026/04/28 13:12:18 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "./PlayComponent.css";

import { Joystick, Swords } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../providers/UserProvider";

export const PlayComponent = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    return (
        <div className="play-container">
            <div className="play-header-container">
                <div className="play-header-center">
                    <Joystick size={24} color="#FFC4D9" />
                    <span>PLAY</span>
                    <Joystick size={24} color="#FFC4D9" />
                </div>
                {user && (
                    <button
                        className="history-icon-btn"
                        onClick={() => navigate("/history")}
                        aria-label="View match history"
                    >
                        <Swords size={24} color="#FFC4D9" />
                    </button>
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
