/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   piece.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:11:27 by npatron           #+#    #+#             */
/*   Updated: 2025/12/10 15:24:54 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export class Piece {
	constructor(type) {
		this.type = type;
		this.shape = Piece.SHAPES[type];
		this.color = Piece.COLORS[type];
		this.x = 3;
		this.y = 0;
		this.rotationIndex = 0;
	}

	rotate() {
		this.rotationIndex = (this.rotationIndex + 1) % this.shape.length;
	}

	getCurrentShape() {
		return this.shape[this.rotationIndex];
	}
}

Piece.TYPES = ["I", "J", "L", "O", "S", "T", "Z"];

Piece.COLORS = {
	I: "cyan",
	J: "blue",
	L: "orange",
	O: "yellow",
	S: "green",
	T: "purple",
	Z: "red"
};

Piece.SHAPES = {
	I: [[[1, 1, 1, 1]], [[1], [1], [1], [1]]],
	O: [
		[
			[1, 1],
			[1, 1]
		]
	],
	T: [
		[
			[0, 1, 0],
			[1, 1, 1]
		],
		[
			[1, 0],
			[1, 1],
			[1, 0]
		],
		[
			[1, 1, 1],
			[0, 1, 0]
		],
		[
			[0, 1],
			[1, 1],
			[0, 1]
		]
	],
	J: [
		[
			[1, 0, 0],
			[1, 1, 1]
		],
		[
			[0, 1],
			[0, 1],
			[1, 1]
		],
		[
			[0, 0, 1],
			[1, 1, 1]
		],
		[
			[1, 1],
			[1, 0],
			[1, 0]
		]
	],
	L: [
		[
			[0, 0, 1],
			[1, 1, 1]
		],
		[
			[1, 0],
			[1, 0],
			[1, 1]
		],
		[
			[1, 1, 1],
			[0, 0, 1]
		],
		[
			[1, 1],
			[0, 1],
			[0, 1]
		]
	],
	S: [
		[
			[0, 1, 1],
			[1, 1, 0]
		],
		[
			[1, 0],
			[1, 1],
			[0, 1]
		]
	],
	Z: [
		[
			[1, 1, 0],
			[0, 1, 1]
		],
		[
			[0, 1],
			[1, 1],
			[1, 0]
		]
	]
};
