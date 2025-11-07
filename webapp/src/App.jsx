/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.jsx                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 17:43:01 by npatron           #+#    #+#             */
/*   Updated: 2025/11/06 17:07:13 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Routes, Route } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';


import HomePage from './components/HomePage';

const App = () => {

	const navigate = useNavigate();
	const goToHome = () => {
		navigate('/');
	}

	return (
			<div id="background-container">
				<div className="header">
					<span className="header-write" onClick={() => goToHome()}>RED-TETRIS</span>
				</div>
				<Routes>
					<Route path="/" element={<HomePage />} />
				</Routes>
			</div>
  );
};

export default App;
