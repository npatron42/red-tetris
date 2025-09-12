/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   LoginOrRegister.jsx                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fpalumbo <fpalumbo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 17:47:44 by npatron           #+#    #+#             */
/*   Updated: 2024/12/23 16:15:52 by fpalumbo         ###   ########.fr       */
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

	console.log("TEST")

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