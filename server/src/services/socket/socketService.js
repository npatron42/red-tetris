/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socketService.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/28 18:50:10 by fpalumbo          #+#    #+#             */
/*   Updated: 2025/12/09 16:17:10 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export class SocketService {
	constructor() {
		this.io = null;
		this.launched = false;
		this.users = {};
	}

	async init(server) {
		if (this.io) return this.io;
		const { Server } = await import("socket.io");
		this.io = new Server(server, {
			cors: { origin: "*" }
		});

		this.io.on("connection", (socket) => {
			const username = (socket.handshake.query.username || "").toString().toLowerCase();
			if (username) {
				this.users[username] = socket.id;
			}

			socket.on("disconnect", () => {
				if (username && this.users[username] === socket.id) {
					delete this.users[username];
				}
			});
		});

		this.launched = true;
		return this.io;
	}

	emitToUser(userId, event, data) {
		if (!this.io || !event) return;
		this.io.to(userId).emit(event, data);
	}

	emitToUsers(usernames, event, data) {
		if (!this.io || !Array.isArray(usernames) || !event) return;
		const uniqueUsernames = Array.from(
			new Set(
				usernames
					.filter((username) => username !== null && username !== undefined)
					.map((username) => username.toString().toLowerCase())
			)
		);

		uniqueUsernames.forEach((username) => {
			const socketId = this.users[username];
			if (socketId) {
				this.emitToUser(socketId, event, data);
			}
		});
	}
}

export default new SocketService();
