/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userController.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 22:54:31 by npatron           #+#    #+#             */
/*   Updated: 2026/01/12 03:06:10 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import userService from "../services/userService.js";
import { generateUserToken } from "../middleware/authMiddleware.js";

const buildAuthResponse = (user) => {
	const token = generateUserToken({ userId: user.id, username: user.name });
	return { token, user: { id: user.id, username: user.name } };
};

export const getUser = async (req, res) => {
	try {
		const data = await userService.getUserById(req.user.id);
		res.json({ success: true, user: data });
	} catch (error) {
		res.status(404).json({ success: false, failure: "No user found" });
	}
};

export const createUser = async (req, res) => {
	try {
		const { username } = req.body;
		if (!username) {
			console.log("createUser ICI 0", username);
			res.json({ failure: "Username is required" });
			return;
		}
		console.log("createUser ICI 1", username);
		const isUserExisting = await userService.userExists(username);
		console.log("createUser ICI 2", isUserExisting);
		if (isUserExisting) {
			console.log("createUser ICI 3", isUserExisting);
			res.json({ failed: "User existing" });
			return;
		}
		console.log("createUser ICI 2", username);
		const user = await userService.createUser(username);
		console.log("createUser ICI 3", user);
		const auth = buildAuthResponse(user);
		res.json({ success: "User added", ...auth });
	} catch (error) {
		res.json({ failure: error.message || "Error creating user" });
	}
};

export const loginUser = async (req, res) => {
	try {
		const { username } = req.body;
		if (!username) {
			res.json({ failure: "Username is required" });
			return;
		}
		const user = await userService.getUserByUsername(username);
		const auth = buildAuthResponse(user);
		res.json({ success: "login", ...auth });
	} catch (error) {
		res.json({ failure: error.message || "Error during login" });
	}
};
