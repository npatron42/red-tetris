/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.jsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 17:43:01 by npatron           #+#    #+#             */
/*   Updated: 2024/12/22 18:34:53 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Routes, Route } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';


import HomePage from './components/HomePage';
import LoginRegister from './components/LoginOrRegister';
import Register from './components/Register';

const App = () => {

	const navigate = useNavigate();

	const location = useLocation();
	const publicPaths = ["/", "/register", "/check42user"];
	const isPublicRoute = publicPaths.includes(location.pathname);

	const goToHome = () => {
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
				<Route path="/home" element={<HomePage />} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</div>
  );
};

export default App;
