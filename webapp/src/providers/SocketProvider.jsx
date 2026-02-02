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
        roomUpdated: null,
        gridUpdated: null,
    });

    const [soloGameEvents, setSoloGameEvents] = useState({
        gridUpdated: null,
        multiGridUpdated: null,
        soloGridUpdated: null,
    });

    useEffect(() => {
        const handleRoomUpdated = data => {
            setRoomEvents(prev => ({ ...prev, roomUpdated: data }));
        };

        const handleSoloGameUpdated = data => {
            setSoloGameEvents(prev => ({ ...prev, gridUpdated: data }));
        };

        const handleMultiGridUpdate = data => {
            setRoomEvents(prev => ({ ...prev, multiGridUpdated: data }));
        };

        const handleSoloGridUpdate = data => {
            setSoloGameEvents(prev => ({ ...prev, gridUpdated: data }));
        };

        const handleGridUpdated = data => {
            setRoomEvents(prev => ({ ...prev, gridUpdated: data }));
        };

        socketService.on("roomUpdated", handleRoomUpdated);
        socketService.on("gridUpdated", handleGridUpdated);
        socketService.on("soloGameUpdated", handleSoloGameUpdated);
        socketService.on("multiGridUpdate", handleMultiGridUpdate);
        socketService.on("soloGridUpdate", handleSoloGridUpdate);
        return () => {
            socketService.off("roomUpdated", handleRoomUpdated);
            socketService.off("gridUpdated", handleGridUpdated);
            socketService.off("soloGameUpdated", handleSoloGameUpdated);
            socketService.off("multiGridUpdate", handleMultiGridUpdate);
            socketService.off("soloGridUpdate", handleSoloGridUpdate);
        };
    }, []);

    useEffect(() => {
        if (isAuthenticated && user?.user?.id) {
            const socket = socketService.connect(user.user.id);

            if (socket) {
                socket.on("connect", () => {
                    setIsConnected(true);
                });

                socket.on("disconnect", () => {
                    setIsConnected(false);
                    setRoomId(null);
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
    }, [isAuthenticated, user?.user?.id]);

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
        const socket = socketService.connect(userId);
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
            roomUpdated: null,
            gridUpdated: null,
        });
    }, []);

    const sendMove = useCallback((event, moveData) => {
        socketService.sendMove(event, moveData);
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
        [isConnected, roomId, roomEvents, connect, disconnect, sendMove],
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
