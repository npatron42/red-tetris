/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   CreateRoom.jsx                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 13:08:55 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 13:19:13 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './PlayComponent.css'

import { BadgePlus, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../providers/UserProvider'
import { useRoom } from '../../composables/useRoom'

import { ToastContainer, toast, Bounce } from 'react-toastify';

const CreateRoom = () => {
    const [roomName, setRoomName] = useState('')
    const navigate = useNavigate()
    const { user } = useUser()
    const { createRoom, isLoading, error } = useRoom()

    if (!user) {
        return null
    }

    const handleRoomCreation = async (event) => {
        event.preventDefault()
        const trimmedRoomName = roomName.trim()
        if (trimmedRoomName.length < 1) {
            return
        }
        const result = await createRoom({ name: trimmedRoomName, username: user })
        if (result.success) {
            localStorage.setItem('room', trimmedRoomName)
            navigate('/')
        }
        else {
            toast.error(result.error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                theme: "dark"
            })
        }
    }

    return (
        <div className="play-component-container">
            <div className='play-header-container'>
                <div className='play-header-left'>
                    <ArrowLeft size={24} onClick={() => navigate(-1)} />
                </div>
                <div className='play-header-center'>
                    <span>CREATE ROOM</span>
                </div>
            </div>
            <form className="play-button-container" onSubmit={handleRoomCreation}>
                <input
                    type="text"
                    placeholder="Room name"
                    value={roomName}
                    onChange={(event) => setRoomName(event.target.value)}
                    maxLength={32}
                    minLength={1}
                    className="input-button"
                />
                <button className="play-button" type="submit" disabled={roomName.trim().length < 1 || isLoading}>
                    {isLoading ? 'Creating...' : 'Create'}
                    <BadgePlus size={16} />
                </button>
            </form>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </div>
    )
}

export default CreateRoom

