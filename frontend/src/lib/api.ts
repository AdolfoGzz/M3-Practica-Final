const API_URL = 'http://localhost:3000';

export const api = {
    async fetch(endpoint: string, options: RequestInit = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        };

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        return response.json();
    },

    // User endpoints
    users: {
        getAll: () => api.fetch('/api/users'),
        getById: (id: number) => api.fetch(`/api/users/${id}`),
        create: (data: { username: string; password: string }) => 
            api.fetch('/api/users', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        update: (id: number, data: { username: string; password: string }) =>
            api.fetch(`/api/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            }),
        delete: (id: number) =>
            api.fetch(`/api/users/${id}`, {
                method: 'DELETE',
            }),
    },

    // Auth endpoints
    auth: {
        login: (data: { username: string; password: string }) =>
            api.fetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
    },
}; 