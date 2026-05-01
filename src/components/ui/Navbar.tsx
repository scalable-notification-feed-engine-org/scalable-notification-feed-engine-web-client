'use client';

import React from 'react';
import { NotificationBell } from './NotificationBell';
import { useAuth } from '@/context/AuthContext';
import {Group, Mailbox, Users} from "lucide-react";
import Link from "next/link";

export const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm border-b">
            <div className="text-xl font-bold text-blue-600">
                ActivityHub
            </div>

            <div>
                <div className="flex gap-4">
                    <Mailbox />
                    <Link href="/group" className="hover:text-blue-600 transition duration-200">
                    <Group/>
                    </Link>
                    <Users/>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <NotificationBell />

                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">{user?.email}</span>
                    <button
                        onClick={logout}
                        className="text-sm text-red-500 hover:underline"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};