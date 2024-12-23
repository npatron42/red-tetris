/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Login.jsx                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 18:29:31 by npatron           #+#    #+#             */
/*   Updated: 2024/12/23 12:22:40 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './css/Login.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import { loginUser } from '../api/api';
import ButtonLoading from './ButtonLoading';


const Login = () => {

	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false)
	
	const [usernameInput, setUsernameInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	
	const myRegex = /^[a-zA-Z0-9_]{3,16}$/;


	const handleSubmit = async () => {
		const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
		setIsLoading(true)
		
		if (myRegex.test(usernameInput) && myRegex.test(passwordInput)) {

			const myUser = {
				"username": usernameInput,
				"password": passwordInput
			}

			const myResult = await loginUser(myUser);
			
			if (myResult.success) {
				await sleep(2000);
				navigate("/home");
				setIsLoading(false);
			}

			// USER NOT EXISTING
			
			else {
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: "Invalid username/password",
				});
				setUsernameInput("");
				setPasswordInput("");
				setConfirmationInput("");
				setIsLoading(false)
				return ;
			}
		}
		else {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Invalid username/password",
			});
			setUsernameInput("");
			setPasswordInput("");
			setConfirmationInput("");
			setIsLoading(false)
			return ;
		}
		await sleep(2000)
		setIsLoading(false)
	}

	


	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleSubmit();
		}
	};

	return (

		<div className="registerForm">
			
			
			<div className="inputBloc">
				<div className="nameInput">
					<span className="nameWrite">
						USERNAME
					</span>
				</div>
				<input 
					type="text" 
					placeholder="Enter your username" 
					className="inputRegister"
					maxLength="16"
					value={usernameInput}
					onChange={(e) => setUsernameInput(e.target.value)}
					onKeyPress={handleKeyPress}
				/>
			</div>


			<div className="inputBloc">
				<div className="nameInput">
					<span className="nameWrite">
						PASSWORD
					</span>
				</div>
				<input 
					type="password" 
					placeholder="Enter your password" 
					className="inputRegister"
					maxLength="16" 
					value={passwordInput}
					onChange={(e) => setPasswordInput(e.target.value)}
					onKeyPress={handleKeyPress}
				/>
			</div>
			
			{ isLoading == false && (
				<div className="positionButton">
					<button className="submitButton">
						<span className="nameWrite2" onClick={() => handleSubmit()}>LOGIN</span>
					</button>					
				</div>
			)}
			{ isLoading == true && (
				<div className="positionButton">
					<ButtonLoading />					
				</div>
			)}			

		</div>
	)	
}

export default Login;