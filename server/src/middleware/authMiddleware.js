/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authMiddleware.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/30 15:55:35 by npatron           #+#    #+#             */
/*   Updated: 2025/12/30 15:55:57 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "palumbobobobobobo";

export function authenticate(req, res, next) {
	const authHeader = req.headers.authorization || req.headers.Authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ success: false, message: "Missing authorization token" });
	}

	const token = authHeader.split(" ")[1];
	try {
		const payload = jwt.verify(token, JWT_SECRET);
		req.user = {
			id: payload.userId,
			username: payload.username
		};
		return next();
	} catch (error) {
		return res.status(401).json({ success: false, message: "Invalid or expired token" });
	}
}

export function generateUserToken({ userId, username }) {
	return jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: "1h" });
}
