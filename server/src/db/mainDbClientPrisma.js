/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mainDbClientPrisma.js                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/30 14:45:52 by npatron           #+#    #+#             */
/*   Updated: 2025/12/30 16:03:27 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { PrismaClient } from "@prisma/client";

const defaultDatabaseUrl = process.env.DATABASE_URL;

console.log("defaultDatabaseUrl", defaultDatabaseUrl);

class MainDbClientPrisma {
	constructor() {
		this.client = new PrismaClient({
			datasources: {
				db: {
					url: defaultDatabaseUrl
				}
			}
		});
	}

	getClient() {
		return this.client;
	}

	async disconnect() {
		await this.client.$disconnect();
	}
}

export const mainDbClientPrisma = new MainDbClientPrisma();
export const prismaClient = mainDbClientPrisma.getClient();

export default mainDbClientPrisma;
