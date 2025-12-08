/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.jsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 17:43:01 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 13:57:11 by npatron          ###   ########.fr       */
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
import { RequireAuth, UserProvider } from './providers/UserProvider';
import { SocketProvider } from './providers/SocketProvider';
import { Profile } from './components/Navbar/Profile';

const App = () => {
	const navigate = useNavigate();
	const goToHome = () => {
		navigate('/');
	}
	return (
			<div id="background-container">
				<div className="header">
					<span className="header-write">TETRIS</span>
				</div>
				<UserProvider>
					<SocketProvider>
						<Profile />
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/login" element={<Login />} />
							<Route path="/create-room" element={<RequireAuth><CreateRoom /></RequireAuth>} />
							<Route path="/join-room" element={<RequireAuth><JoinRoom /></RequireAuth>} />
						</Routes>
					</SocketProvider>
				</UserProvider>
			</div>
  );
};

export default App;
