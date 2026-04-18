'use client'

import {createContext, useContext, useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import {useAuth} from "@/context/AuthContext";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { token, user} = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const tokenValue = typeof token === 'function' ? token() : token;

        if (tokenValue && user){
            const newSocket = io("http://localhost:5000", {
                auth: { token: tokenValue },
                query: { userId: user.id },
                transports: ["websocket"],
                reconnection: true,
            });

            newSocket.on("connect", () => {
                console.log(" Centralized Socket Connected:", newSocket.id);
            });

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            }
        }


    },[token, user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocket = () => useContext(SocketContext);

