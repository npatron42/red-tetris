/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   UserDao.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/23 10:18:26 by npatron           #+#    #+#             */
/*   Updated: 2025/09/12 15:46:53 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserDao {

	getUser = async (userId) => {
	
		return (prisma.user.findUnique({
			where: {
				id: userId
			}
		}
		))
	};
	
	getUserByUsername = async (username) => {
		
		return (prisma.user.findFirst({
			where: {
				username: username
			}
		}))
	};

	createUser = async (username, password) => {
		const userJson = {
			"username": username,
			"password": password
		}
		await prisma.user.create({data: userJson});
	}
	
}
