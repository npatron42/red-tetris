/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   SoloGameRoom.jsx                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/22 16:54:46 by npatron           #+#    #+#             */
/*   Updated: 2025/12/22 17:16:10 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useNavigate } from 'react-router-dom';
import { useSoloGame } from '../../composables/useSoloGame';

import { useUser } from '../../providers/UserProvider';
import './SoloGameRoom.css';	

const SoloGameRoom = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { createGame } = useSoloGame();

    const handleCreateSoloGame = async () => {
        try {
            const gameId = await createGame(user)
            navigate(`/solo/${gameId}`)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="gameroom-container">
            <button onClick={handleCreateSoloGame}>Create Solo Game</button>
        </div>
    );
};

export default SoloGameRoom;