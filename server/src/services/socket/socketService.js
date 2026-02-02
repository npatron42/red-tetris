/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socketService.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/28 18:50:10 by fpalumbo          #+#    #+#             */
/*   Updated: 2026/02/02 12:33:18 by npatron          ###   ########.fr       */
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
			const id = (socket.handshake.query.id || "")
			if (id) {
				this.users[id] = socket.id;
			}

			socket.on("disconnect", () => {
				if (id && this.users[id] === socket.id) {
					delete this.users[id];
					this.disconnectHandlers.forEach((handler) => {
						if (handler) {
							handler(id);
						}
					});
				}
			});

			socket.on("movePieceMultiplayer", (data) => {
				const { roomid, direction } = data;
				if (!roomid || !id || !direction) {
					return;
				}
				this.handleMovePieceMultiplayer(roomid, id, direction);
			});

			socket.on("movePieceSolo", (data) => {
				const { gameId, direction, userId } = data;
				if (!gameId || !userId || !direction) {
					return;
				}
				this.handleMovePieceSolo(gameId, userId, direction);
			});
		});

		this.launched = true;
		return this.io;
	}

	emitToUser(userId, event, data) {
		if (!this.io || !event) return;
		this.io.to(userId).emit(event, data);
	}

	emitToUsers(ids, event, data) {
		try {
			if (!this.io || !Array.isArray(ids) || !event) return;
			const uniqueUserids = Array.from(
				new Set(
					ids.filter((id) => id !== null && id !== undefined).map((id) => id.toString().toLowerCase())
				)
			);

			uniqueUserids.forEach((id) => {
				const socketId = this.users[id];
				if (socketId) {
					this.emitToUser(socketId, event, data);
				}
			});
		} catch (error) {
			console.error("Error emitting to users", error);
		}
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

	handleMovePieceMultiplayer(roomid, userId, direction) {
		if (this.multiMoveHandler) {
			this.multiMoveHandler(roomid, userId, direction);
		}
	}

	handleMovePieceSolo(gameId, userId, direction) {
		if (this.soloMoveHandler) {
			this.soloMoveHandler(gameId, userId, direction);
		}
	}

	getUserSocketId(id) {
		return this.users[id] || null;
	}
}

export default new SocketService();
