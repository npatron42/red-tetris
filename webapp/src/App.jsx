/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.jsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/09 11:58:43 by npatron           #+#    #+#             */
/*   Updated: 2025/12/22 17:14:17 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Home from './components/home/Home';
import Login from './components/login/Login';
import CreateRoom from './components/play-component/CreateRoom';
import JoinRoom from './components/play-component/JoinRoom';
import MultiGameRoom from './components/multi-game-room/MultiGameRoom';
import SoloGameRoom from './components/solo-game-room/SoloGameRoom';
import { SoloGame } from './components/solo-game/SoloGame';
import BackgroundAnimation from './components/Background/BackgroundAnimation';

import { RequireAuth, UserProvider } from './providers/UserProvider';
import { SocketProvider } from './providers/SocketProvider';
import { Profile } from './components/navbar/Profile';


const TETRIS_LETTERS = [
    { char: 'T', color: '#E53935' },
    { char: 'E', color: '#FB8C00' },
    { char: 'T', color: '#FDD835' },
    { char: 'R', color: '#43A047' },
    { char: 'I', color: '#039BE5' },
    { char: 'S', color: '#8E24AA' },
];

const App = () => {
    const navigate = useNavigate();
    const navigateToHome = () => {
        navigate('/');
    }

    return (
        <div id="background-container">
            <BackgroundAnimation /> 

            <div className="header">
                <div className="header-write" onClick={navigateToHome}>
                    {TETRIS_LETTERS.map((item, index) => (
                        <span key={index} style={{ color: item.color }}>
                            {item.char}
                        </span>
                    ))}
                </div>
            </div>
            
            <UserProvider>
                <SocketProvider>
                    <Profile />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/solo/:gameId" element={<RequireAuth><SoloGame /></RequireAuth>} />
                        <Route path="/create-room" element={<RequireAuth><CreateRoom /></RequireAuth>} />
                        <Route path="/join-room" element={<RequireAuth><JoinRoom /></RequireAuth>} />
                        <Route path="/:roomName/:leaderUsername" element={<RequireAuth><MultiGameRoom /></RequireAuth>} />
                        <Route path="/solo/game-room" element={<RequireAuth><SoloGameRoom /></RequireAuth>} />
                    </Routes>
                </SocketProvider>
            </UserProvider>
        </div>
    );
};

export default App;