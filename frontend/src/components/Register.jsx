/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Register.jsx                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 18:29:27 by npatron           #+#    #+#             */
/*   Updated: 2024/12/22 18:46:37 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './css/Register.css'

const Register = () => {


	return (

		<div className="registerForm">
			<div className="nameInput">
				<span className="nameWrite">
					USERNAME
				</span>
			</div>
			<div className="inputRegister">
			</div>
			<div className="nameInput">
				<span className="nameWrite">
					PASSWORD
				</span>
			</div>
			<div className="inputRegister">
			</div>
			<div className="nameInput">
				<span className="nameWrite">
					PASSWORD CONFIRMATION
				</span>
			</div>
			<div className="inputRegister">
			</div>

		</div>
	)	
}

export default Register;