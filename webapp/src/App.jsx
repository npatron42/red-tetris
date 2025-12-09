/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.jsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/09 11:58:43 by npatron           #+#    #+#             */
/*   Updated: 2025/12/09 11:59:04 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Home from './components/Home/Home';
import Login from './components/Login/Login';
import CreateRoom from './components/PlayComponent/CreateRoom';
import JoinRoom from './components/PlayComponent/JoinRoom';
import GameRoom from './components/GameRoom/GameRoom';
import BackgroundAnimation from './components/Background/BackgroundAnimation';

import { RequireAuth, UserProvider } from './providers/UserProvider';
import { SocketProvider } from './providers/SocketProvider';
import { Profile } from './components/Navbar/Profile';

const App = () => {
    const navigate = useNavigate();
    const navigateToHome = () => {
        navigate('/');
    }
    return (
            <div id="background-container">
                <BackgroundAnimation /> 

                <div className="header">
                    <span className="header-write" onClick={navigateToHome}>TETRIS</span>
                </div>
                <UserProvider>
                    <SocketProvider>
                        <Profile />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/create-room" element={<RequireAuth><CreateRoom /></RequireAuth>} />
                            <Route path="/join-room" element={<RequireAuth><JoinRoom /></RequireAuth>} />
                            <Route path="/:roomName/:leaderUsername" element={<RequireAuth><GameRoom /></RequireAuth>} />
                        </Routes>
                    </SocketProvider>
                </UserProvider>
            </div>
  );
};

export default App;