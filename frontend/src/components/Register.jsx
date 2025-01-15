/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Register.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 18:29:27 by npatron           #+#    #+#             */
/*   Updated: 2025/01/13 16:39:08 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './css/Register.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import { createUser } from '../api/api';
import ButtonLoading from './ButtonLoading';

const Register = () => {

	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false)
	
	const [usernameInput, setUsernameInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [confirmationInput, setConfirmationInput] = useState("");
	
	const myRegex = /^[a-zA-Z0-9_]{3,16}$/;


	const handleSubmit = async () => {
		const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
		if (myRegex.test(usernameInput) && myRegex.test(passwordInput))
			setIsLoading(true)
			if (passwordInput == confirmationInput) {

				const myUser = {
					"username": usernameInput,
					"password": passwordInput,
				}
				const myResult = await createUser(myUser);

				// USER NOT EXISTING

				if (myResult.success) {
					await sleep(2000);
					navigate("/");
					setIsLoading(false)	
					return ;
				}

				// USER EXISTS

				else {
					Swal.fire({
						icon: "error",
						title: "Oops...",
						text: "User already exists!",
					});
					setUsernameInput("");
					setPasswordInput("");
					setConfirmationInput("");
				}
			}
		else {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Invalid champs!",
			});
			setUsernameInput("");
			setPasswordInput("");
			setConfirmationInput("");
		}
		setIsLoading(false)

	}


	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleSubmit();
		}
	};

	return (
		
		<div className="myCadre-2">
			<div className="registerForm">
				<span className="nameWriteLoginRegister">
					REGISTER
				</span>
				
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
				
				<div className="inputBloc">
					<div className="nameInput">
						<span className="nameWrite">
							PASSWORD CONFIRMATION
						</span>
					</div>
					<input 
						type="password"
						placeholder="Confirm your password" 
						className="inputRegister"
						maxLength="16"
						value={confirmationInput}
						onChange={(e) => setConfirmationInput(e.target.value)}
						onKeyPress={handleKeyPress}
					/>
				</div>
				{ isLoading == false && (
					<div className="positionButton">
						<button className="submitButton">
							<span className="nameWrite2" onClick={() => handleSubmit()}>REGISTER</span>
						</button>					
					</div>
				)}
				{ isLoading == true && (
					<div className="positionButton">
						<ButtonLoading />					
					</div>
				)}			

			</div>
		</div>
	)	
}

export default Register;