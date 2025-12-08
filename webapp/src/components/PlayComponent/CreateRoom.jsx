import './PlayComponent.css'

import { BadgePlus, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../providers/UserProvider'
import { useRoom } from '../../composables/useRoom'

const CreateRoom = () => {
    const [roomName, setRoomName] = useState('')
    const navigate = useNavigate()
    const { user } = useUser()
    const { createRoom, isLoading, error } = useRoom()

    if (!user) {
        return null
    }

    const handleSubmit = async (event) => {
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
            <form className="play-button-container" onSubmit={handleSubmit}>
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
                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            </form>
        </div>
    )
}

export default CreateRoom

