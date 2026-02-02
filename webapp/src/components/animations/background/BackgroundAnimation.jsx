/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   BackgroundAnimation.jsx                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/09 11:57:40 by npatron           #+#    #+#             */
/*   Updated: 2026/02/02 14:08:16 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useEffect, useState } from "react";
import "./BackgroundAnimation.css";

const TETROMINO_TYPES = ["I", "J", "L", "O", "S", "T", "Z"];

export default function BackgroundAnimation({ count = 15 }) {
    const [tetrominos, setTetrominos] = useState([]);

    useEffect(() => {
        const pieces = Array.from({ length: count }, (_, index) => {
            const type = TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
            const delay = Math.random() * 20;
            const duration = 15 + Math.random() * 10;
            const leftPosition = Math.random() * 100;
            const size = 0.6 + Math.random() * 0.6;

            return {
                id: index,
                type,
                style: {
                    left: `${leftPosition}%`,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                    transform: `scale(${size})`,
                    opacity: 0.3 + Math.random() * 0.3,
                },
            };
        });

        setTetrominos(pieces);
    }, [count]);

    return (
        <div className="tetris-bg-container">
            {tetrominos.map((tetromino) => (
                <div
                    key={tetromino.id}
                    className="floating-tetromino"
                    data-type={tetromino.type}
                    style={tetromino.style}
                >
                    <div className="tetromino-block block-0"></div>
                    <div className="tetromino-block block-1"></div>
                    <div className="tetromino-block block-2"></div>
                    <div className="tetromino-block block-3"></div>
                </div>
            ))}
        </div>
    );
};