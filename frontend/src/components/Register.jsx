/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Register.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 18:29:27 by npatron           #+#    #+#             */
/*   Updated: 2024/12/22 23:01:19 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './css/Register.css'

import { useState } from 'react'

import { createUser } from '../api/api';


const Register = () => {



	const [usernameInput, setUsernameInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [confirmationInput, setConfirmationInput] = useState("");
	
	const [isUsernameDone, setUsernameDone] = useState(false);
	const [isPasswordDone, setPasswordDone] = useState(false);
	const [isPasswordConfirmationDone, setPasswordConfirmationDone] = useState(false);
	
	const myRegex = /^[a-zA-Z0-9_]{3,16}$/;


	const handleSubmit = async () => {
		if (myRegex.test(usernameInput) && myRegex.test(passwordInput))
			if (passwordInput == confirmationInput) {

				const myUser = {
					"username": usernameInput,
					"password": passwordInput,
				}
				console.log(myUser);
				const myResult = await createUser(myUser);
				console.log(myResult);
			}

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
					maxlength="16"
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
					maxlength="16" 
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
					maxlength="16"
					value={confirmationInput}
					onChange={(e) => setConfirmationInput(e.target.value)}
					onKeyPress={handleKeyPress}
				/>
			</div>

			<button className="submitButton">
				<span className="nameWrite2" onClick={() => handleSubmit()}>SUBMIT</span>
			</button>

		</div>
	)	
}

export default Register;