'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import {useAuth} from "@/context/AuthContext";

export interface User {
    id: string;
    firstName: string;
}

export default function Dashboard() {
    const [users, setUsers] = useState<User[]>([]);

    const { status} = useNotifications();
    const {token} = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const tokenValue = typeof token === 'function' ? token() : token;

                const res = await fetch('http://localhost:9090/api/v1/users/get-all-user-details', {
                    headers: {

                        'Authorization': `Bearer ${tokenValue}`
                    }
                });


                const data = await res.json();
                console.log("User Data", data.data);


                const usersList = Array.isArray(data.data) ? data.data : [];
                setUsers(usersList);
            } catch (err) {
                console.error("User service fetch error:", err);
            }
        };

        if (token()) {
            fetchUsers();
        }
    }, [token]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 italic">Dashboard Status Monitor 🖥️</h1>

            <div className="grid gap-4 max-w-md">
                {users.map((user) => {

                    const userStatus = (status as Record<string, string>)[user.id] || 'offline';
                    console.log("User Status in html", userStatus , " User id ", user.id);

                    return (
                        <div key={user.id} className="p-4 border rounded-lg flex items-center justify-between shadow-sm bg-white text-black">
                            <span className="font-medium">{user.firstName}</span>

                            <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${userStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                <span className={`text-sm ${userStatus === 'online' ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                                    {userStatus === 'online' ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}