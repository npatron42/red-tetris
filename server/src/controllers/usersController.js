/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   usersController.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 22:54:31 by npatron           #+#    #+#             */
/*   Updated: 2025/09/12 15:56:19 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import jwt from 'jsonwebtoken'

import { UserManager } from "../manager/UserManager.js";

const userManager = new UserManager()


function generateToken(payload, secretKey, options) {
	return jwt.sign(payload, secretKey, options);
  }


export const getUser = async (req, res) => {
	try {
		const data = await userManager.getUserByUsername(req.auth.username);
		res.json(data);
	}
	catch (error) {
		res.json({"failure": "No user found"})
	}
}

  
export const createUser = async (req, res) => {
	try {
		if (data.username && data.password) {
			if (await userManager.userAlreadyExists(data.username) == false) {
				
				await userManager.create(data.username, data.password)
				res.json({"success": "User added"});
				return ;
				
			}
			else {
				res.json({"failed": "User existing"});
				return ;
			}
		}
	}
	catch (error) {
		res.json({"failure": "No champs"})
	}
};

export const loginUser = async (req, res) => {
	
	const data = req.body;
	
	if (data.username && data.password) {
		
		if (await userManager.userAlreadyExists(data.username) == true) {
			
			const result = await userManager.userCanLogin(data.username, data.password)
			
			console.log("result", result)
			if (result == true) {

				const token = generateToken({ username: data.username }, 'momo', { expiresIn: '1h' });
				console.log(`TOken de ${data.username} = ${token}`);
				res.json({ 
                    success: "login", 
                    token 
                });
			}
			else
				res.json({"failure": "Bad champs"})
			return ;
		}
		
		else {
			res.json({"failed": "User not existing"});
			return ;
		}
	}
	res.json({"failure": "No champs"})
	return ;

};