/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.jsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/09 11:58:43 by npatron           #+#    #+#             */
/*   Updated: 2026/02/02 16:22:45 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Routes, Route } from "react-router-dom";

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
import { Navbar } from "./components/navbar/Navbar";

const App = () => {
    return (
        <div id="background-container">
            <BackgroundAnimation />
            <UserProvider>
                <SocketProvider>
                    <Navbar />
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
