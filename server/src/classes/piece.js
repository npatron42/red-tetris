/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   piece.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:11:27 by npatron           #+#    #+#             */
/*   Updated: 2025/12/11 17:25:10 by npatron          ###   ########.fr       */
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

	moveLeft() {
		this.x--;
	}

	moveRight() {
		this.x++;
	}

	moveDown() {
		this.y++;
	}

	fallDown() {
		this.y++;
	}

	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
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
	I: [[["C", "C", "C", "C"]], [["C"], ["C"], ["C"], ["C"]]],
	O: [
		[
			["O", "O"],
			["O", "O"]
		]
	],
	T: [
		[
			[0, "P", 0],
			["P", "P", "P"]
		],
		[
			["P", 0],
			["P", "P"],
			["P", 0]
		],
		[
			["P", "P", "P"],
			[0, "P", 0]
		],
		[
			[0, "P"],
			["P", "P"],
			[0, "P"]
		]
	],
	J: [
		[
			["B", 0, 0],
			["B", "B", "B"]
		],
		[
			[0, "B"],
			[0, "B"],
			["B", "B"]
		],
		[
			[0, 0, "B"],
			["B", "B", "B"]
		],
		[
			["B", "B"],
			["B", 0],
			["B", 0]
		]
	],
	L: [
		[
			[0, 0, "O"],
			["O", "O", "O"]
		],
		[
			["O", 0],
			["O", 0],
			["O", "O"]
		],
		[
			["O", "O", "O"],
			[0, 0, "O"]
		],
		[
			["O", "O"],
			[0, "O"],
			[0, "O"]
		]
	],
	S: [
		[
			[0, "G", "G"],
			["G", "G", 0]
		],
		[
			["G", 0],
			["G", "G"],
			[0, "G"]
		]
	],
	Z: [
		[
			["R", "R", 0],
			[0, "R", "R"]
		],
		[
			[0, "R"],
			["R", "R"],
			["R", 0]
		]
	]
};
