/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.jsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 17:43:01 by npatron           #+#    #+#             */
/*   Updated: 2025/11/07 17:12:10 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Home from './components/Home/Home';
import CreateRoom from './components/PlayComponent/CreateRoom';
import JoinRoom from './components/PlayComponent/JoinRoom';

const App = () => {

	const navigate = useNavigate();
	const goToHome = () => {
		navigate('/');
	}

	return (
			<div id="background-container">
				<div className="header">
					<span className="header-write" onClick={() => goToHome()}>TETRIS</span>
				</div>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/create-room" element={<CreateRoom />} />
					<Route path="/join-room" element={<JoinRoom />} />
				</Routes>
			</div>
  );
};

export default App;
