/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   MatchHistory.jsx                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/19 14:36:30 by npatron           #+#    #+#             */
/*   Updated: 2026/02/02 12:43:15 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useUser } from "../../providers/UserProvider";
import { getHistoryMatch } from "../../composables/useApi";
import { useEffect } from "react";
import { useState } from "react";

export const MatchHistory = () => {

    const { user } = useUser();
    const [historyMatch, setHistoryMatch] = useState([]);

    const fetchHistoryMatch = async () => {
        const response = await getHistoryMatch();
        if (response.success) {
            setHistoryMatch(response.matchHistory);
        } else {
            toast.error(response.message);
        }
    };

    useEffect(() => {
        fetchHistoryMatch();
    }, []);


	return (
		<div className="match-history-container">
			<h1>Match History</h1>
            {historyMatch.map((match) => (
                <div key={match.id}>
                    <h2>{match.player1.name} vs {match.player2.name}</h2>
                    <p>{match.winner.name} won</p>
                </div>
            ))}
		</div>
	);
};