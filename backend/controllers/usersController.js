/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   usersController.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fpalumbo <fpalumbo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 22:54:31 by npatron           #+#    #+#             */
/*   Updated: 2024/12/28 18:58:48 by fpalumbo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import jwt from 'jsonwebtoken'

import { UserManager } from "../manager/UserManager.js";

const userManager = new UserManager()


function generateToken(payload, secretKey, options) {
	return jwt.sign(payload, secretKey, options);
  }


export const getUser = async (req, res) => {
	
	const data = await userManager.getUserByUsername(req.auth.username);
	res.json(data);
}

  
export const createUser = async (req, res) => {
	
	const myData = req.body;

	if (myData.username && myData.password) {
		
		if (await userManager.userAlreadyExists(myData.username) == false) {
			
			await userManager.createUser(myData.username, myData.password)
			res.json({"success": "User added"});
			return ;
			
		}
		
		else {
			res.json({"failed": "User existing"});
			return ;
		}
	}
	return ;

};

export const loginUser = async (req, res) => {
	
	const myData = req.body;
	
	if (myData.username && myData.password) {
		
		if (await userManager.userAlreadyExists(myData.username) == true) {
			
			const result = await userManager.userCanLogin(myData.username, myData.password)
			
			console.log("result", result)
			if (result == true) {

				const token = generateToken({ username: myData.username }, 'momo', { expiresIn: '1h' });
				console.log(`TOken de ${myData.username} = ${token}`);
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