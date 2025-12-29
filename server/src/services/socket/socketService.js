/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socketService.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/28 18:50:10 by fpalumbo          #+#    #+#             */
/*   Updated: 2025/12/29 14:24:40 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export class SocketService {
	constructor() {
		this.io = null;
		this.launched = false;
		this.users = {};
		this.disconnectHandlers = [];
		this.soloMoveHandler = null;
		this.multiMoveHandler = null;
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
					this.disconnectHandlers.forEach((handler) => {
						if (handler) {
							handler(username);
						}
					});
				}
			});

			socket.on("movePieceMultiplayer", (data) => {
				const { roomName, direction } = data;
				if (!roomName || !username || !direction) {
					return;
				}
				this.handleMovePieceMultiplayer(roomName, username, direction);
			});

			socket.on("movePieceSolo", (data) => {
				const { gameId, direction } = data;
				if (!gameId || !username || !direction) {
					return;
				}
				this.handleMovePieceSolo(gameId, username, direction);
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

	setSoloMoveHandler(handler) {
		this.soloMoveHandler = handler;
	}

	setMultiMoveHandler(handler) {
		this.multiMoveHandler = handler;
	}

	addDisconnectHandler(handler) {
		if (handler && !this.disconnectHandlers.includes(handler)) {
			this.disconnectHandlers.push(handler);
		}
	}

	handleMovePieceMultiplayer(roomName, username, direction) {
		if (this.multiMoveHandler) {
			this.multiMoveHandler(roomName, username, direction);
		}
	}

	handleMovePieceSolo(gameId, username, direction) {
		if (this.soloMoveHandler) {
			this.soloMoveHandler(gameId, username, direction);
		}
	}

	getUserSocketId(username) {
		const normalizedUsername = username.toLowerCase();
		return this.users[normalizedUsername] || null;
	}
}

export default new SocketService();
