/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   JoinRoom.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/07 16:54:59 by npatron           #+#    #+#             */
/*   Updated: 2025/11/17 16:27:17 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './PlayComponent.css'

import { MoveRight, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../providers/UserProvider'

export default function JoinRoom() {
    const [roomCode, setRoomCode] = useState('')
    const navigate = useNavigate()
    const { user } = useUser()

    if (!user) {
        return null
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const trimmedRoomCode = roomCode.trim()
        if (trimmedRoomCode.length < 1) {
            return
        }
        localStorage.setItem('room', trimmedRoomCode)
        navigate('/')
    }

    return (
        <div className="play-component-container">
            <div className='play-header-container'>
                <div className='play-header-left'>
                    <ArrowLeft size={24} onClick={() => navigate(-1)} />
                </div>
                <div className='play-header-center'>
                    <span>JOIN ROOM</span>
                </div>
            </div>
            <form className="play-button-container" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Room code"
                    value={roomCode}
                    onChange={(event) => setRoomCode(event.target.value)}
                    maxLength={32}
                    minLength={1}
                    className="input-button"
                />
                <button className="play-button" type="submit" disabled={roomCode.trim().length < 1}>
                    Join
                    <MoveRight size={16} />
                </button>
            </form>
        </div>
    )
}
