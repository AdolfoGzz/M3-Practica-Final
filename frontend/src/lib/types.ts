export interface User {
    idUser: number;
    username: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

export interface LoginResponse {
    token: string;
}

export interface UserResponse {
    idUser: number;
    username: string;
} 