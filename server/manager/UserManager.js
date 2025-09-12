/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   UserManager.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/23 10:24:03 by npatron           #+#    #+#             */
/*   Updated: 2025/09/12 15:25:36 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import bcrypt from 'bcrypt'

import { UserDao } from "../dao/UserDao.js";

export class UserManager {

	constructor() {
        this.userDao = new UserDao();
    }

	getUserByUsername = async (username) => {
		if (username) {

			const user = await this.userDao.getUserByUsername(username);
			return user
		}
	}

	getUserById = async (id) => {

		const user = await this.userDao.getUser(id);
		return user
	}


	userAlreadyExists = async (username) => {

		const user = await this.userDao.getUserByUsername(username);
		

		if (user)
			return true;
		else
			return false;
	}

	createUser = async (username, password) => {
		
		try {
			
			if (username.length <= 16 && password.length <= 16) {
				
				const saltRounds = 10;
				
    			const hashedPassword = await bcrypt.hash(password, saltRounds);

				await this.userDao.createUser(username, hashedPassword)
				return ;
			}
			else
				throw new Error("Invalid username/password")
			
		} catch(e) {
			console.log(e)
		}
	}

	userCanLogin = async (username, password) => {
						
		const user = await this.userDao.getUserByUsername(username);
		
		const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return false;
        }
		
		return true;
		
	}
	
}

