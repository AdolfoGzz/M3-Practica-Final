import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginResponse } from './types';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './auth-context';

const API_URL = 'http://localhost:3000/api';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode<User>(token);
                setUser(decoded);
            } catch (error) {
                console.error('Error decoding token:', error);
                logout();
            }
        }
    }, [token]);

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data: LoginResponse = await response.json();
            setToken(data.token);
            localStorage.setItem('token', data.token);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
} 