/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   LoginRegister.jsx                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 17:47:44 by npatron           #+#    #+#             */
/*   Updated: 2024/12/22 18:25:27 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './css/LoginRegister.css'

import { useNavigate } from 'react-router-dom'

const LoginRegister = () => {

	const navigate = useNavigate()

	const goToLogin = () => {
		navigate("/login");
	}

	const goToRegister = () => {
		navigate("/register");
	}

	return (
		<div className="principalCadre">
			<span className="loginRegisterWriting" onClick={() => goToLogin()}>
				LOGIN
			</span>
			<span className="loginRegisterWriting" onClick={() => goToRegister()}>
				REGISTER
			</span>
		</div>
	)

	
}

export default LoginRegister;