/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   SoloGameRoom.jsx                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/22 16:54:46 by npatron           #+#    #+#             */
/*   Updated: 2025/12/22 17:34:22 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSoloGame } from '../../composables/useSoloGame';

import { useUser } from '../../providers/UserProvider';
import './SoloGameRoom.css';	

const SoloGameRoom = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { createGame } = useSoloGame();
    
    const [difficulty, setDifficulty] = useState('EASY');
    
    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
    }

    const handleCreateSoloGame = async () => {
        try {
            const gameId = await createGame(user, difficulty)
            navigate(`/solo/${gameId}`)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="gameroom-container">
            <select value={difficulty} onChange={handleDifficultyChange}>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
            </select>
            <button onClick={handleCreateSoloGame}>Create Solo Game</button>
        </div>
    );
};

export default SoloGameRoom;