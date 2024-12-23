/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   usersController.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 22:54:31 by npatron           #+#    #+#             */
/*   Updated: 2024/12/23 11:43:55 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { UserManager } from "../manager/UserManager.js";

const userManager = new UserManager()

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
			if (result == true)
				res.json({"success": "login"})
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