/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   BackgroundAnimation.jsx                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/09 11:58:20 by npatron           #+#    #+#             */
/*   Updated: 2025/12/09 13:44:13 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import React, { useMemo } from 'react';
import './BackgroundAnimation.css';

const SHAPES = [
    {
        type: 'I',
        color: '#2f4858',
        path: (
            <>
                <rect x="0" y="10" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="10" y="10" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="20" y="10" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="30" y="10" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
            </>
        )
    },
    {
        type: 'J',
        color: '#254f5e',
        path: (
            <>
                <rect x="0" y="20" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="10" y="0" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="10" y="10" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="10" y="20" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
            </>
        )
    },
    {
        type: 'L',
        color: '#195760',
        path: (
            <>
                <rect x="10" y="0" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="10" y="10" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="10" y="20" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="20" y="20" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
            </>
        )
    },
    {
        type: 'O',
        color: '#135e5e',
        path: (
            <>
                <rect x="10" y="10" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="10" y="20" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="20" y="10" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="20" y="20" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
            </>
        )
    },
    {
        type: 'S',
        color: '#1c6458',
        path: (
            <>
                <rect x="10" y="10" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="20" y="10" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="0" y="20" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="10" y="20" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
            </>
        )
    },
    {
        type: 'T',
        color: '#2d6a4f',
        path: (
            <>
                <rect x="10" y="10" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="0" y="20" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="10" y="20" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="20" y="20" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
            </>
        )
    },
    {
        type: 'Z',
        color: '#ffc300',
        path: (
            <>
                <rect x="0" y="10" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="10" y="10" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="10" y="20" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
                <rect x="20" y="20" width="10" height="10" fill="currentColor" stroke="#000" strokeWidth="1" />
            </>
        )
    },
];

const BackgroundAnimation = () => {
    const PIECE_COUNT = 20;
    const pieces = useMemo(() => {
        return Array.from({ length: PIECE_COUNT }).map((_, i) => {
            const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            const style = {
                left: `${Math.random() * 100}vw`, 
                animationName: 'fall',
                animationDuration: `${10 + Math.random() * 20}s`, 
                animationDelay: `-${Math.random() * 20}s`, 
                animationIterationCount: 'infinite',
                animationTimingFunction: 'linear',
                color: shape.color,
                width: '80px', 
                height: '80px'
            };

            return { id: i, shape, style };
        });
    }, []);

    return (
        <div className="tetris-bg-container">
            {pieces.map((piece) => (
                <svg
                    key={piece.id}
                    className="floating-tetromino"
                    style={piece.style}
                    viewBox="0 0 40 40"
                    fill="currentColor" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {piece.shape.path}
                </svg>
            ))}
        </div>
    );
};

export default BackgroundAnimation;