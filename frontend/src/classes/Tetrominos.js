/**
 * Copyright (c) 2024 - Indigen Solutions
 * Authors:
 *   - Nicolas Patron <nicolas.patron@indigen.com>
 * NOTICE: All information contained herein is, and remains
 * the property of Indigen Solutions and its suppliers, if any.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Indigen Solutions.
 */


export class Tetrominos {

    constructor() {
        this.formPosition = 0;
        this.numberPositions = 4
        this.form = []
        this.pieces = [

            TetrominoI,
            TetrominoJ,
            TetrominoL,
            TetrominoO,
            TetrominoS,
            TetrominoT,
            TetrominoZ

        ]
        this.name = "momo"
    }
    
    rotate() {

        if (this.formPosition < this.numberPositions - 1) {
            this.formPosition++;
            return ;
        }
        this.formPosition = 0;
        return ;
    }

    showPosition() {
        return this.form[this.formPosition];
    }

    getName() {
        return this.name;
    }

}

export class TetrominoI extends Tetrominos {

    constructor() {
        super();
        this.form = [[
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0],
        ],
        [
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0],
        ],
        [
            [0,0,0,0],
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
        ],
        [
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
        ],
        ]
        this.name = "I"
    }
}

export class TetrominoJ extends Tetrominos {

    constructor() {
        super();
        this.form = [[
            [1,0,0],
            [1,1,1],
            [0,0,0],
        ],
        [
            [0,1,1],
            [0,1,0],
            [0,1,0],
        ],
        [
            [0,0,0],
            [1,1,1],
            [0,0,1],
        ],
        [
            [0,1,0],
            [0,1,0],
            [1,1,0],
        ]
        ]
        this.name = "J"

    }
}

export class TetrominoL extends Tetrominos {

    constructor() {
        super();
        this.form = [[
            [0,0,1],
            [1,1,1],
            [0,0,0],
        ],
        [
            [0,1,0],
            [0,1,0],
            [0,1,1],
        ],
        [
            [0,0,0],
            [1,1,1],
            [1,0,0],
        ],
        [
            [1,1,0],
            [0,1,0],
            [0,1,0],
        ]
        ]
        this.name = "L"

    }
}

export class TetrominoO extends Tetrominos {

    constructor() {
        super();
        this.form = [[
            [0,0,0,0],
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0],
        ],
        [
            [0,0,0,0],
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0],
        ],
        [
            [0,0,0,0],
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0],
        ],
        [
            [0,0,0,0],
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0],
        ],
        ]
        this.name = "O"
    }

}

export class TetrominoS extends Tetrominos {

    constructor() {
        super();
        this.form = [[
            [0,1,1],
            [1,1,0],
            [0,0,0],
        ],
        [
            [0,1,0],
            [0,1,1],
            [0,0,1],
        ],
        [
            [0,0,0],
            [0,1,1],
            [1,1,0],
        ],
        [
            [1,0,0],
            [1,1,0],
            [0,1,0],
        ],
        ]
        this.name = "S"

    }
}

export class TetrominoT extends Tetrominos {

    constructor() {
        super();
        this.form = [[
            [0,1,0],
            [1,1,1],
            [0,0,0],
        ],
        [
            [0,1,0],
            [0,1,1],
            [0,1,0],
        ],
        [
            [0,0,0],
            [1,1,1],
            [0,1,0],
        ],
        [
            [0,1,0],
            [1,1,0],
            [0,1,0],
        ],
        ]
        this.name = "T"


    }

}

export class TetrominoZ extends Tetrominos {

    constructor() {
        super();
        this.form = [[
            [1,1,0],
            [0,1,1],
            [0,0,0],
        ],
        [
            [0,0,1],
            [0,1,1],
            [0,1,0],
        ],
        [
            [0,0,0],
            [1,1,0],
            [0,1,1],
        ],
        [
            [0,1,0],
            [1,1,0],
            [1,0,0],
        ],
        ]

        this.name = "Z"

    }
}