/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   scoringSystem.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/23 17:22:17 by npatron           #+#    #+#             */
/*   Updated: 2025/12/23 17:35:31 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export class ScoringSystem {
	constructor() {
		this.rules = {
			1: 100,
			2: 300,
			3: 500,
			4: 800
		};
	}
	calculateScore(playerScore, gameLevel, numberOfLinesCleared) {
		const points = this.rules[numberOfLinesCleared] || 0;
		playerScore += points * gameLevel;
		return playerScore;
	}
}
