'use client';

import React, {createContext, useContext, useState, useEffect, useMemo} from 'react';
import { useAuth } from './AuthContext';
import {useSocket} from "@/context/common/SocketContext";


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
    const socket = useSocket();
    const { token } = useAuth();


    useEffect(() => {

        const tokenValue = typeof token === 'function' ? token() : token;

        console.log("🔄 Effect Triggered. Token found:", !!tokenValue);

        const fetchNotifications = async () => {
            if (!tokenValue) {
                console.log(" Fetch skipped: Token is null");
                return;
            }

            try {
                console.log("📡 Fetching from DB...");
                const res = await fetch(`http://localhost:5000/api/notifications`, {
                    headers: {
                        Authorization: `Bearer ${tokenValue}`,
                        'Cache-Control': 'no-cache'
                    }
                });

                if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

                const data = await res.json();
                const notificationsArray = Array.isArray(data) ? data : (data.notifications || []);

                console.log("✅ Successfully fetched from DB:", notificationsArray.length, "items");
                setNotifications(notificationsArray);

            } catch (err) {
                console.error(" Failed to fetch notifications:", err);
            }
        };

        fetchNotifications();


    }, [token]);

    useEffect(() => {

        if (!socket) return;

        const userId = "bbd0de35-23ed-4a86-929d-e19bb983057a";

        socket.emit("join",userId)

        socket.on("notification", (notification: Notification) => {
            setNotifications(prev => [notification, ...prev])
        });
        console.log("Response " , notifications);

        return () => {
            socket.off("notification")
        }

    }, [socket]);



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

