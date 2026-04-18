'use client'
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from '@/context/NotificationContext';
import { useRouter } from 'next/navigation'; // Navigation සඳහා

export const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNotificationClick = async (id: string, targetId?: string) => {

        await markAsRead(id);


        setIsOpen(false);

        if (targetId) {
            router.push(`/posts/${targetId}`);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition focus:outline-none"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-[450px] flex flex-col">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <span className="font-bold text-gray-800">Notifications</span>
                        <span className="text-xs text-blue-600 cursor-pointer hover:underline">Mark all as read</span>
                    </div>

                    <div className="overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                No activity yet.
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    onClick={() => handleNotificationClick(notification._id, notification._id)}
                                    className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition flex flex-col gap-1 ${!notification.isRead ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : ''}`}
                                >
                                    <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                        {notification.message}
                                    </p>
                                    <span className="text-[10px] uppercase font-medium text-gray-400">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-3 text-center border-t border-gray-100">
                        <button className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition">
                            View All Notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}