/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   JoinRoom.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/07 16:54:59 by npatron           #+#    #+#             */
/*   Updated: 2025/12/11 14:17:30 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './PlayComponent.css'

import { MoveRight, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../providers/UserProvider'
import { useRoom } from '../../composables/useRoom'
import { toast, ToastContainer, Bounce } from 'react-toastify'


export default function JoinRoom() {
    const [roomName, setroomName] = useState('')
    const navigate = useNavigate()
    const { user } = useUser()
    const { handleJoinRoom } = useRoom()
    if (!user) {
        return null
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const trimmedRoomName = roomName.trim()
        if (trimmedRoomName.length < 1) {
            return
        }
        const roomData = {
            roomName: trimmedRoomName,
            username: user
        }
        const response = await handleJoinRoom(roomData)
        if (response.success && response.data?.success) {
            navigate(`/${trimmedRoomName}/${response.data.room.leaderUsername}`)
        }
        else {
            const errorMessage = response.error || response.data?.failure || 'Failed to join room'
            toast.error(errorMessage)
        }
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
                    placeholder="Room name"
                    value={roomName}
                    onChange={(event) => setroomName(event.target.value)}
                    maxLength={32}
                    minLength={1}
                    className="input-button"
                />
                <button className="play-button" type="submit" disabled={roomName.trim().length < 1}>
                    Join
                    <MoveRight size={16} />
                </button>
            </form>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    )
}
