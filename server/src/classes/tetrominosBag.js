/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tetrominosBag.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/10 15:10:23 by npatron           #+#    #+#             */
/*   Updated: 2025/12/29 16:31:56 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Piece } from "./piece.js";

export class TetrominosBag {
    constructor() {
        this.bag = [];
        this.nextBag = [];
    }

    _createShuffledBag() {
        const types = [...Piece.TYPES];
        for (let i = types.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [types[i], types[j]] = [types[j], types[i]];
        }
        return types;
    }

    _refillBag() {
        this.bag = this._createShuffledBag();
    }

    getNextPiece() {
        if (this.bag.length === 0) {
            if (this.nextBag.length > 0) {
                this.bag = this.nextBag;
                this.nextBag = [];
            } else {
                this._refillBag();
            }
        }
        const type = this.bag.pop();
        return new Piece(type);
    }

    peekNextPieces(count = 3) {
        const preview = [];
        const tempBag = [...this.bag];
        let tempNextBag = [...this.nextBag];

        for (let i = 0; i < count; i++) {
            if (tempBag.length === 0) {
                if (tempNextBag.length === 0) {
                    tempNextBag = this._createShuffledBag();
                    if (this.nextBag.length === 0) {
                        this.nextBag = [...tempNextBag];
                    }
                }
                tempBag.push(...tempNextBag);
                tempNextBag = [];
            }
            preview.push(tempBag[tempBag.length - 1]);
            tempBag.pop();
        }

        return preview;
    }
}
