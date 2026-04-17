'use client'
import { formatDistanceToNow } from "date-fns";
import {useState} from "react";
import {Bell} from "lucide-react";
import { useNotifications } from '@/context/NotificationContext';

export const NotificationBell = () => {

    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead } = useNotifications();


    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[400px] overflow-y-auto">
                    <div className="p-3 border-b border-gray-100 font-semibold text-gray-700">
                        Notifications
                    </div>

                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No notifications yet</div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification._id}
                                onClick={() => markAsRead(notification._id)}
                                className={`p-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition ${!notification.isRead ? 'bg-blue-50' : ''}`}
                            >
                                <p className="text-sm text-gray-800">{notification.message}</p>
                                <span className="text-xs text-gray-400">
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}