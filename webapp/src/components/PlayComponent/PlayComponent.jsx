/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PlayComponent.jsx                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/06 17:01:45 by npatron           #+#    #+#             */
/*   Updated: 2025/11/07 17:11:28 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './PlayComponent.css'

import { Joystick, BadgePlus, MoveRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const PlayComponent = () => {
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(storedUser)
        }
    }, [])

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
                        <BadgePlus size={16} />
                    </button>
                    <button className="play-button" onClick={() => navigate('/join-room')}>
                        Join a room
                        <MoveRight size={16} />
                    </button>
                </div>
            )}
            {!user && (
                <div className="play-button-container">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        maxLength={16}
                        minLength={1}
                        className="play-button"
                    />
                    <button
                        disabled={username.trim().length < 1}
                        onClick={() => {
                            const trimmedUsername = username.trim()
                            if (trimmedUsername.length < 1) {
                                return
                            }
                            localStorage.setItem('user', trimmedUsername)
                            setUser(trimmedUsername)
                        }}>
                        Validate
                    </button>
                </div>
            )}
        </div>
    )
}