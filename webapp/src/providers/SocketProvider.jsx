/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   SocketProvider.jsx                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: npatron <npatron@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/08 13:50:00 by npatron           #+#    #+#             */
/*   Updated: 2025/12/08 13:50:00 by npatron          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { socketService } from "../services/socketService";
import { useUser } from "./UserProvider";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
	const { user, isAuthenticated } = useUser();
	const [isConnected, setIsConnected] = useState(false);
	const [roomId, setRoomId] = useState(null);
	const [roomEvents, setRoomEvents] = useState({
		enemyName: null,
		enemyDisconnected: null,
		tetrominosGenerated: null,
		roomUpdated: null,
	});

	useEffect(() => {
		const handleEnemyName = (data) => {
			setRoomEvents((prev) => ({ ...prev, enemyName: data }));
		};

		const handleEnemyDisconnected = (data) => {
			setRoomEvents((prev) => ({ ...prev, enemyDisconnected: data }));
		};

		const handleTetrominosGenerated = (data) => {
			setRoomEvents((prev) => ({ ...prev, tetrominosGenerated: data }));
		};

		const handleRoomUpdated = (data) => {
			setRoomEvents((prev) => ({ ...prev, roomUpdated: data }));
		};

		socketService.on("enemyName", handleEnemyName);
		socketService.on("enemyDisconnected", handleEnemyDisconnected);
		socketService.on("tetrominosGenerated", handleTetrominosGenerated);
		socketService.on("roomUpdated", handleRoomUpdated);

		return () => {
			socketService.off("enemyName", handleEnemyName);
			socketService.off("enemyDisconnected", handleEnemyDisconnected);
			socketService.off("tetrominosGenerated", handleTetrominosGenerated);
			socketService.off("roomUpdated", handleRoomUpdated);
		};
	}, []);

	useEffect(() => {
		if (isAuthenticated && user) {
			const socket = socketService.connect(user, null);
			
			if (socket) {
				socket.on("connect", () => {
					setIsConnected(true);
					console.log("Connected to socket");
				});

				socket.on("disconnect", () => {
					setIsConnected(false);
					setRoomId(null);
					console.log("Disconnected from socket");
				});
			}
		} else {
			socketService.disconnect();
			setIsConnected(false);
			setRoomId(null);
		}

		return () => {
			if (!isAuthenticated) {
				socketService.disconnect();
			}
		};
	}, [isAuthenticated, user]);

	useEffect(() => {
		const handlePageHide = () => {
			const socket = socketService.getSocket();
			if (socket?.connected) {
				socket.disconnect();
			}
		};

		const handleBeforeUnload = () => {
			const socket = socketService.getSocket();
			if (socket?.connected) {
				socket.disconnect();
			}
		};

		const handleUnload = () => {
			const socket = socketService.getSocket();
			if (socket?.connected) {
				socket.disconnect();
			}
		};

		window.addEventListener("pagehide", handlePageHide);
		window.addEventListener("beforeunload", handleBeforeUnload);
		window.addEventListener("unload", handleUnload);

		return () => {
			window.removeEventListener("pagehide", handlePageHide);
			window.removeEventListener("beforeunload", handleBeforeUnload);
			window.removeEventListener("unload", handleUnload);
			const socket = socketService.getSocket();
			if (socket?.connected) {
				socket.disconnect();
			}
		};
	}, []);

	const connect = useCallback((userId, newRoomId) => {
		const socket = socketService.connect(userId, newRoomId);
		setRoomId(newRoomId);

		if (socket) {
			socket.on("connect", () => {
				setIsConnected(true);
			});

			socket.on("disconnect", () => {
				setIsConnected(false);
				setRoomId(null);
			});
		}

		return socket;
	}, []);

	const disconnect = useCallback(() => {
		socketService.disconnect();
		setIsConnected(false);
		setRoomId(null);
		setRoomEvents({
			enemyName: null,
			enemyDisconnected: null,
			tetrominosGenerated: null,
			roomUpdated: null,
		});
	}, []);

	const sendMove = useCallback((moveData) => {
		socketService.sendMove(moveData);
	}, []);

	const value = useMemo(
		() => ({
			isConnected,
			roomId,
			roomEvents,
			connect,
			disconnect,
			sendMove,
			socket: socketService.getSocket(),
		}),
		[isConnected, roomId, roomEvents, connect, disconnect, sendMove]
	);

	return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return context;
};
