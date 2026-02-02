/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   piece.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:11:27 by npatron           #+#    #+#             */
/*   Updated: 2025/12/29 16:35:29 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export class Piece {
    constructor(type) {
        this.type = type;
        this.shape = Piece.SHAPES[type];
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

Piece.SHAPES = {
    I: [[["I", "I", "I", "I"]], [["I"], ["I"], ["I"], ["I"]]],
    O: [
        [
            ["O", "O"],
            ["O", "O"],
        ],
    ],
    T: [
        [
            [0, "T", 0],
            ["T", "T", "T"],
        ],
        [
            ["T", 0],
            ["T", "T"],
            ["T", 0],
        ],
        [
            ["T", "T", "T"],
            [0, "T", 0],
        ],
        [
            [0, "T"],
            ["T", "T"],
            [0, "T"],
        ],
    ],
    J: [
        [
            ["J", 0, 0],
            ["J", "J", "J"],
        ],
        [
            [0, "J"],
            [0, "J"],
            ["J", "J"],
        ],
        [
            [0, 0, "J"],
            ["J", "J", "J"],
        ],
        [
            ["J", "J"],
            ["J", 0],
            ["J", 0],
        ],
    ],
    L: [
        [
            [0, 0, "L"],
            ["L", "L", "L"],
        ],
        [
            ["L", 0],
            ["L", 0],
            ["L", "L"],
        ],
        [
            ["L", "L", "L"],
            ["L", 0, 0],
        ],
        [
            ["L", "L"],
            [0, "L"],
            [0, "L"],
        ],
    ],
    S: [
        [
            [0, "S", "S"],
            ["S", "S", 0],
        ],
        [
            ["S", 0],
            ["S", "S"],
            [0, "S"],
        ],
    ],
    Z: [
        [
            ["Z", "Z", 0],
            [0, "Z", "Z"],
        ],
        [
            [0, "Z"],
            ["Z", "Z"],
            ["Z", 0],
        ],
    ],
};
