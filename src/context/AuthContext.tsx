'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export interface User {
    id: string;
    email: string;
    roles: string[];
    tenantId?: string;
    firstName?: string;
}

interface AuthContextType {
    user: User | null;
    token: () => string;
    login: (token: string, userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {

        if(typeof window !== 'undefined') {
            const token = Cookies.get('auth_token');
            const savedUser = localStorage.getItem('user_data');

            if (token && savedUser) {
                try {
                    const parserUser = JSON.parse(savedUser);
                    setUser(parserUser);
                }catch (error) {
                    console.error("Auth data corrupted:", error);
                    Cookies.remove('auth_token');
                    localStorage.removeItem('user_data');
                }

            }
            setIsLoading(false);
        }
    }, []);

    const login = (token: string, userData: User) => {
        Cookies.set('auth_token', token, {
            expires: 7,
            secure: true,
            sameSite: 'strict'
        });

        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        router.push('/dashboard');
    };

    const token = ():string => {
        const token = Cookies.get('auth_token');
        if (token) {
            return token;
        }
        return '';
    }

    const logout = () => {
        Cookies.remove('auth_token');
        localStorage.removeItem('user_data');
        setUser(null);
        router.push('/login');
    };

    return (

        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAuthenticated: !!user,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};