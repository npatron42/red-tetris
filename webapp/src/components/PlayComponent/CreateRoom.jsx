import './PlayComponent.css'

import { BadgePlus, Joystick, ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateRoom = () => {
    const [roomName, setRoomName] = useState('')
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
            navigate('/')
            return
        }
        setUser(storedUser)
    }, [navigate])

    if (!user) {
        return null
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const trimmedRoomName = roomName.trim()
        if (trimmedRoomName.length < 1) {
            return
        }
        localStorage.setItem('room', trimmedRoomName)
        navigate('/')
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
                    className="play-button"
                />
                <button className="play-button" type="submit" disabled={roomName.trim().length < 1}>
                    Create
                    <BadgePlus size={16} />
                </button>
            </form>
        </div>
    )
}

export default CreateRoom

