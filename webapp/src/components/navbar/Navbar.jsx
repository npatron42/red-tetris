/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Navbar.jsx                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/02 15:00:00 by npatron           #+#    #+#             */
/*   Updated: 2026/02/02 16:21:35 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "./Navbar.css";

import { useNavigate } from "react-router-dom";
import Jukebox from "../jukebox/Jukebox";
import { Profile } from "./Profile";

const TETRIS_LETTERS = [
    { letter: "T", color: "#f00000" },
    { letter: "E", color: "#f0a000" },
    { letter: "T", color: "#f0f000" },
    { letter: "R", color: "#00f000" },
    { letter: "I", color: "#0000f0" },
    { letter: "S", color: "#a000f0" },
];

export const Navbar = () => {
    const navigate = useNavigate();
    const navigateToHome = () => {
        navigate("/");
    };

    return (
        <div className="navbar-container">
            <div className="navbar-left">
                <Jukebox />
            </div>
            <div className="navbar-title" onClick={navigateToHome}>
                {TETRIS_LETTERS.map((item, index) => (
                    <span key={index} style={{ color: item.color }}>
                        {item.letter}
                    </span>
                ))}
            </div>
            <div className="navbar-right">
                <Profile />
            </div>
        </div>
    );
};

