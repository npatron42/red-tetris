/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   piecesGenerator.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/10 15:10:23 by npatron           #+#    #+#             */
/*   Updated: 2025/12/10 15:19:31 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Piece } from "./piece.js";

export class PiecesGenerator {
	constructor() {
		this.bag = [];
	}

	_refillBag() {
		const types = [...Piece.TYPES];
		for (let i = types.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[types[i], types[j]] = [types[j], types[i]];
		}
		this.bag = types;
	}

	getNextPiece() {
		if (this.bag.length === 0) {
			this._refillBag();
		}
		const type = this.bag.pop();
		return new Piece(type);
	}

	generateSequence(length = 5) {
		const sequence = [];
		const tempBag = [...this.bag];

		for (let i = 0; i < length; i++) {
			sequence.push(new Piece(Piece.TYPES[Math.floor(Math.random() * 7)]));
		}
		return sequence;
	}
}
