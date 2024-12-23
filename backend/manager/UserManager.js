/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   UserManager.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/23 10:24:03 by npatron           #+#    #+#             */
/*   Updated: 2024/12/23 11:37:36 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import bcrypt from 'bcrypt'


import { UserDao } from "../dao/UserDao.js";

export class UserManager {

	constructor() {
        this.userDao = new UserDao();
    }

	userAlreadyExists = async (myUsername) => {

		const user = await this.userDao.getUserByUsername(myUsername);
		

		if (user)
			return true;
		else
			return false;
	}

	createUser = async (myUsername, myPassword) => {
		
		try {
			
			if (myUsername.length <= 16 && myPassword.length <= 16) {
				
				const saltRounds = 10;
				
    			const hashedPassword = await bcrypt.hash(myPassword, saltRounds);

				await this.userDao.createUser(myUsername, hashedPassword)
				return ;
			}
			else
				throw new Error("Invalid username/password")
			
		} catch(e) {
			console.log(e)
		}
	}

	userCanLogin = async (myUsername, myPassword) => {
						
		const user = await this.userDao.getUserByUsername(myUsername);
		
		const isPasswordValid = await bcrypt.compare(myPassword, user.password);

        if (!isPasswordValid) {
            return false;
        }
		
		return true;
		
	}
	
}

