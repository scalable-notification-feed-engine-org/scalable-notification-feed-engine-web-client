'use client';

import React, {createContext, useContext, useState, useEffect, useMemo} from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';


interface Notification {
    _id: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { token, user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const fetchNotifications = async () => {

            const tokenValue = typeof token === 'function' ? token() : token;

            if (!tokenValue) return;
            try {
                const res = await fetch(`http://localhost:5000/api/notifications`, {
                    headers: { Authorization: `Bearer ${tokenValue}` }
                });
                console.log("Response " , res);
                const data = await res.json();
                const notificationsArray = Array.isArray(data) ? data : (data.notifications || []);
                setNotifications(notificationsArray);
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            }
        };

        fetchNotifications();
    }, [token]);


    useEffect(() => {
        const tokenValue = typeof token === 'function' ? token() : token;
        if (token() && user) {
            const newSocket = io("http://localhost:5000", {
                auth: { token:tokenValue },
                transports: ["websocket"]
            });

            newSocket.on('connect', () => console.log("✅ Socket Connected"));

            newSocket.on('new_notification', (notif: Notification) => {
                setNotifications(prev => [notif, ...prev]);

            });

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [token, user]);


    const markAsRead = async (id: string) => {
        const tokenValue = typeof token === 'function' ? token() : token;
        try {
            await fetch (`http://localhost:5000/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${tokenValue}` }
            });

            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const unreadCount = useMemo(() => {
        return Array.isArray(notifications)
            ? notifications.filter(n => !n.isRead).length
            : 0;
    }, [notifications]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotifications must be used within NotificationProvider");
    return context;
};

