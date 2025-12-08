/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   fileStorage.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 16:03:00 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 16:03:00 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import fs from "fs";

export function readJsonFile(filePath) {
	try {
		const data = fs.readFileSync(filePath, "utf8");
		const trimmedData = data.trim();
		if (!trimmedData) {
			return [];
		}
		const parsed = JSON.parse(trimmedData);
		return Array.isArray(parsed) ? parsed : [];
	} catch (error) {
		if (error.code === "ENOENT") {
			return [];
		}
		throw error;
	}
}

export function writeJsonFile(filePath, data) {
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

