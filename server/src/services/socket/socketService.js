/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socketService.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/28 18:50:10 by fpalumbo          #+#    #+#             */
/*   Updated: 2025/12/08 15:43:38 by npatron          ###   ########.fr       */
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
			const username = socket.handshake.query.username;	
			console.log("User connected", socket.id, username);
			this.users[username] = socket.id;
			console.log(this.users);
		});
		this.io.on("disconnect", (socket) => {
			console.log("User disconnected", socket.id);
		});
		this.launched = true;
		return this.io;
	}

	emitToUser(userId, data) {
		this.io.to(userId).emit("event", data);
	}
}

export default new SocketService();
