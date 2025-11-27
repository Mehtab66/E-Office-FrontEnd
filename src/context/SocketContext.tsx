import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../store/authStore";

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { user } = useAuthStore(); // Get authenticated user

    useEffect(() => {
        if (user) {
            // Initialize socket connection
            const socketInstance = io("http://localhost:3000", {
                withCredentials: true,
            });

            socketInstance.on("connect", () => {
                console.log("Socket connected:", socketInstance.id);
                setIsConnected(true);
                // Register user with their ID
                // Handle both _id and id
                const userId = (user as any)._id || (user as any).id;
                socketInstance.emit("register", userId);
            });

            socketInstance.on("disconnect", () => {
                console.log("Socket disconnected");
                setIsConnected(false);
            });

            setSocket(socketInstance);

            return () => {
                socketInstance.disconnect();
            };
        } else {
            // If no user, disconnect existing socket
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
