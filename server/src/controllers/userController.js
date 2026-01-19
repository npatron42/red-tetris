/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userController.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 22:54:31 by npatron           #+#    #+#             */
/*   Updated: 2026/01/19 16:29:44 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import userService from "../services/userService.js";
import { generateUserToken } from "../middleware/authMiddleware.js";

const buildAuthResponse = (user) => {
	const token = generateUserToken({ userId: user.id, name: user.name });
	return { token, user: { id: user.id, name: user.name } };
};

export const getUser = async (req, res) => {
	try {
		const data = await userService.getUserById(req.user.id);
		res.json({ success: true, user: data });
	} catch (error) {
		res.status(404).json({ success: false, message: "No user found" });
	}
};

export const createUser = async (req, res) => {
	try {
		const { name } = req.body;
		if (!name) {
			return res.status(400).json({ success: false, message: "name is required" });
		}
		const isUserExisting = await userService.userExistsByName(name);
		if (isUserExisting) {
			return res.status(409).json({ success: false, message: "User already exists" });
		}
		const user = await userService.createUser(name);
		const auth = buildAuthResponse(user);
		res.json({ success: true, message: "User created", ...auth });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message || "Error creating user" });
	}
};
