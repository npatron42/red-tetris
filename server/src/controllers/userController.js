/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userController.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/22 22:54:31 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 15:55:57 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import jwt from "jsonwebtoken";
import userService from "../services/userService.js";

function generateToken(payload, secretKey, options) {
	return jwt.sign(payload, secretKey, options);
}

export const getUser = async (req, res) => {
	try {
		const data = await userService.getUserByUsername(req.auth.username);
		res.json(data);
	} catch (error) {
		res.json({ failure: "No user found" });
	}
};

export const createUser = async (req, res) => {
	try {
		const { username } = req.body;
		if (!username) {
			res.json({ failure: "Username is required" });
			return;
		}
		const isUserExisting = await userService.userExists(username);
		if (isUserExisting) {
			res.json({ failed: "User existing" });
			return;
		}
		await userService.createUser(username);
		res.json({ success: "User added" });
	} catch (error) {
		res.json({ failure: error.message || "Error creating user" });
	}
};

export const loginUser = async (req, res) => {
	try {
		const { username, password } = req.body;
		if (!username || !password) {
			res.json({ failure: "Username and password are required" });
			return;
		}
		const userExists = await userService.userExists(username);
		if (!userExists) {
			res.json({ failed: "User not existing" });
			return;
		}
		const token = generateToken({ username }, "momo", { expiresIn: "1h" });
		res.json({
			success: "login",
			token
		});
	} catch (error) {
		res.json({ failure: error.message || "Error during login" });
	}
};
