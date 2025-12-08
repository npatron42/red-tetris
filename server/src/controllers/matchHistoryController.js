/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   matchHistoryController.js                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 12:56:35 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 12:57:55 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */



export const createHistoryMatch = async (req, res) => {
	try {
		const data = req.body;
		console.log("data", data);
	} catch (error) {
		res.json({ failure: "Error creating history match" });
	}
};

export const getHistoryMatchByUsername = async (req, res) => {
	try {
		const data = req.body;
		console.log("data", data);
	} catch (error) {
		res.json({ failure: "Error getting history match by username" });
	}
};