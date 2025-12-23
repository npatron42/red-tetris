/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   scoringSystem.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/23 17:22:17 by npatron           #+#    #+#             */
/*   Updated: 2025/12/23 17:31:34 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

class ScoringSystem {
	constructor() {
		this.rules = {
			1: 100,
			2: 300,
			3: 500,
			4: 800
		};
	}
	calculateScore(playerScore, gameLevel, numberOfLinesCleared) {
		playerScore += this.rules[numberOfLinesCleared] * gameLevel;
		return playerScore;
	}
}
