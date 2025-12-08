/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PlayComponent.jsx                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/06 17:01:45 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 11:54:11 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './PlayComponent.css'

import { Joystick, BadgePlus, MoveRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../providers/UserProvider'

export const PlayComponent = () => {
    const navigate = useNavigate()
    const { user } = useUser()

    return (
        <div className="play-component-container">
            <div className='play-header-container'>
                <div className='play-header-center'>
                    <Joystick size={24} color="#2A9D8F" />
                    <span>PLAY</span>
                    <Joystick size={24} color="#2A9D8F" />
                </div>
            </div>
            {user && (
                <div className="play-button-container">
                    <button className="play-button" onClick={() => navigate('/create-room')}>
                        Create a room
                    </button>
                    <button className="play-button" onClick={() => navigate('/join-room')}>
                        Join a room
                    </button>
                </div>
            )}
            {!user && (
                <div className="play-button-container">
                    <button className="play-button" onClick={() => navigate('/login')}>
                        Login to continue
                    </button>
                </div>
            )}
        </div>
    )
}