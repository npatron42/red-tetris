/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.jsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/09 11:58:43 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 16:13:46 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Home from "./components/home/Home";
import Login from "./components/login/Login";
import CreateRoom from "./components/multi/play-component/CreateRoom";
import JoinRoom from "./components/multi/play-component/JoinRoom";
import MultiGameRoom from "./components/multi/multi-game-room/MultiGameRoom";
import SoloGameRoom from "./components/solo/solo-game-room/SoloGameRoom";
import { SoloGame } from "./components/solo/solo-game/SoloGame";
import BackgroundAnimation from "./components/animations/background/BackgroundAnimation";

import { RequireAuth, UserProvider } from "./providers/UserProvider";
import { SocketProvider } from "./providers/SocketProvider";
import { Profile } from "./components/navbar/Profile";
import Jukebox from "./components/jukebox/Jukebox";

const TETRIS_LETTERS = [
    { letter: "T", color: "#E53935" },
    { letter: "E", color: "#FB8C00" },
    { letter: "T", color: "#FDD835" },
    { letter: "R", color: "#43A047" },
    { letter: "I", color: "#039BE5" },
    { letter: "S", color: "#8E24AA" },
];

const App = () => {
    const navigate = useNavigate();
    const navigateToHome = () => {
        navigate("/");
    };

    return (
        <div id="background-container">
            <BackgroundAnimation />

            <div className="header">
                <div className="header-left">
                    <Jukebox />
                </div>
                <div className="header-write" onClick={navigateToHome}>
                    {TETRIS_LETTERS.map((item, index) => (
                        <span key={index} style={{ color: item.color }}>
                            {item.letter}
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
                        <Route
                            path="/solo/:gameId"
                            element={
                                <RequireAuth>
                                    <SoloGame />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/create-room"
                            element={
                                <RequireAuth>
                                    <CreateRoom />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/join-room"
                            element={
                                <RequireAuth>
                                    <JoinRoom />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/:roomName/:leaderUsername"
                            element={
                                <RequireAuth>
                                    <MultiGameRoom />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/solo/game-room"
                            element={
                                <RequireAuth>
                                    <SoloGameRoom />
                                </RequireAuth>
                            }
                        />
                    </Routes>
                </SocketProvider>
            </UserProvider>
        </div>
    );
};

export default App;
