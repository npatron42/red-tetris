/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.jsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fpalumbo <fpalumbo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 17:43:01 by npatron           #+#    #+#             */
/*   Updated: 2024/12/27 18:09:42 by fpalumbo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Routes, Route } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';


import HomePage from './components/HomePage';
import LoginRegister from './components/LoginOrRegister';
import Register from './components/Register';
import Login from './components/Login';
import TetrisGame from './components/TetrisGame';
import { UserAuthProvider } from './providers/UserAuthProvider';

const App = () => {

	const navigate = useNavigate();

	const location = useLocation();
	const publicPaths = ["/", "/register", "/check42user"];
	const isPublicRoute = publicPaths.includes(location.pathname);

	const goToHome = () => {

		const myJwt = localStorage.getItem("jwt")

		if (myJwt)
			navigate("/home");
		else
			navigate("/");
		return ;
	}

	return (
			<div id="background-container">
				<div className="header">
					<span className="header-write" onClick={() => goToHome()}>RED-TETRIS</span>
				</div>
			<Routes>
					<Route path="/" element={<LoginRegister />} />
			</Routes>
			<UserAuthProvider>
				<Routes>
					<Route path="/home" element={<HomePage />} />
					<Route path="/register" element={<Register />} />
					<Route path="/login" element={<Login />} />
					<Route path="/:roomId/:playerName" element={<TetrisGame />} />
				</Routes>
			</UserAuthProvider>
			</div>
  );
};

export default App;
