/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   UserDao.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/23 10:18:26 by npatron           #+#    #+#             */
/*   Updated: 2024/12/23 11:35:31 by npatron          ###   ########.fr       */
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
	
	getUserByUsername = async (myUsername) => {
		
		return (prisma.user.findFirst({
			where: {
				username: myUsername
			}
		}))
	};

	createUser = async (myUsername, myPassword) => {
		const dataToSave = {
			"username": myUsername,
			"password": myPassword
		}
		await prisma.user.create({data: dataToSave});
	}
	
}
