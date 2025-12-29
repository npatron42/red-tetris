/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   BackgroundAnimation.jsx                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/09 11:58:20 by npatron           #+#    #+#             */
/*   Updated: 2025/12/29 14:50:41 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import React, { useMemo } from "react";
import "./BackgroundAnimation.css";

const SHAPES = [
	{
		type: "I",
		path: (
			<>
				<defs>
					<linearGradient id="grad-I" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#4DD0E1" />
						<stop offset="100%" stopColor="#00E0E0" />
					</linearGradient>
				</defs>
				<rect x="0" y="10" width="10" height="10" fill="url(#grad-I)" stroke="#008BA3" strokeWidth="0.5" />
				<rect x="10" y="10" width="10" height="10" fill="url(#grad-I)" stroke="#008BA3" strokeWidth="0.5" />
				<rect x="20" y="10" width="10" height="10" fill="url(#grad-I)" stroke="#008BA3" strokeWidth="0.5" />
				<rect x="30" y="10" width="10" height="10" fill="url(#grad-I)" stroke="#008BA3" strokeWidth="0.5" />
			</>
		)
	},
	{
		type: "L",
		path: (
			<>
				<defs>
					<linearGradient id="grad-L" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#FFB74D" />
						<stop offset="100%" stopColor="#FF9800" />
					</linearGradient>
				</defs>
				<rect x="10" y="0" width="10" height="10" fill="url(#grad-L)" stroke="#E65100" strokeWidth="0.5" />
				<rect x="10" y="10" width="10" height="10" fill="url(#grad-L)" stroke="#E65100" strokeWidth="0.5" />
				<rect x="10" y="20" width="10" height="10" fill="url(#grad-L)" stroke="#E65100" strokeWidth="0.5" />
				<rect x="20" y="20" width="10" height="10" fill="url(#grad-L)" stroke="#E65100" strokeWidth="0.5" />
			</>
		)
	},
	{
		type: "O",
		path: (
			<>
				<defs>
					<linearGradient id="grad-O" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#FFF176" />
						<stop offset="100%" stopColor="#FFEB3B" />
					</linearGradient>
				</defs>
				<rect x="10" y="10" width="10" height="10" fill="url(#grad-O)" stroke="#F57F17" strokeWidth="0.5" />
				<rect x="10" y="20" width="10" height="10" fill="url(#grad-O)" stroke="#F57F17" strokeWidth="0.5" />
				<rect x="20" y="10" width="10" height="10" fill="url(#grad-O)" stroke="#F57F17" strokeWidth="0.5" />
				<rect x="20" y="20" width="10" height="10" fill="url(#grad-O)" stroke="#F57F17" strokeWidth="0.5" />
			</>
		)
	},
	{
		type: "S",
		path: (
			<>
				<defs>
					<linearGradient id="grad-S" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#81C784" />
						<stop offset="100%" stopColor="#4CAF50" />
					</linearGradient>
				</defs>
				<rect x="10" y="10" width="10" height="10" fill="url(#grad-S)" stroke="#2E7D32" strokeWidth="0.5" />
				<rect x="20" y="10" width="10" height="10" fill="url(#grad-S)" stroke="#2E7D32" strokeWidth="0.5" />
				<rect x="0" y="20" width="10" height="10" fill="url(#grad-S)" stroke="#2E7D32" strokeWidth="0.5" />
				<rect x="10" y="20" width="10" height="10" fill="url(#grad-S)" stroke="#2E7D32" strokeWidth="0.5" />
			</>
		)
	},
	{
		type: "T",
		path: (
			<>
				<defs>
					<linearGradient id="grad-T" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#BA68C8" />
						<stop offset="100%" stopColor="#9C27B0" />
					</linearGradient>
				</defs>
				<rect x="10" y="10" width="10" height="10" fill="url(#grad-T)" stroke="#6A1B9A" strokeWidth="0.5" />
				<rect x="0" y="20" width="10" height="10" fill="url(#grad-T)" stroke="#6A1B9A" strokeWidth="0.5" />
				<rect x="10" y="20" width="10" height="10" fill="url(#grad-T)" stroke="#6A1B9A" strokeWidth="0.5" />
				<rect x="20" y="20" width="10" height="10" fill="url(#grad-T)" stroke="#6A1B9A" strokeWidth="0.5" />
			</>
		)
	},
	{
		type: "Z",
		path: (
			<>
				<defs>
					<linearGradient id="grad-Z" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#E57373" />
						<stop offset="100%" stopColor="#F44336" />
					</linearGradient>
				</defs>
				<rect x="0" y="10" width="10" height="10" fill="url(#grad-Z)" stroke="#C62828" strokeWidth="0.5" />
				<rect x="10" y="10" width="10" height="10" fill="url(#grad-Z)" stroke="#C62828" strokeWidth="0.5" />
				<rect x="10" y="20" width="10" height="10" fill="url(#grad-Z)" stroke="#C62828" strokeWidth="0.5" />
				<rect x="20" y="20" width="10" height="10" fill="url(#grad-Z)" stroke="#C62828" strokeWidth="0.5" />
			</>
		)
	}
];

const BackgroundAnimation = () => {
	const PIECE_COUNT = 20;
	const pieces = useMemo(() => {
		return Array.from({ length: PIECE_COUNT }).map((_, i) => {
			const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
			const style = {
				left: `${Math.random() * 100}vw`,
				animationName: "fall",
				animationDuration: `${10 + Math.random() * 20}s`,
				animationDelay: `-${Math.random() * 20}s`,
				animationIterationCount: "infinite",
				animationTimingFunction: "linear",
				color: shape.color,
				width: "80px",
				height: "80px"
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
