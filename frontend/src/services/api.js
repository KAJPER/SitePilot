import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Interceptor do dodawania tokenu do zapytań
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor do obsługi błędów
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token wygasł lub jest nieprawidłowy
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials) => api.post('/login/', credentials),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    isAuthenticated: () => !!localStorage.getItem('token'),
};

export const websiteService = {
    getAll: () => api.get('/websites/'),
};

export const pageService = {
    getAll: () => api.get('/pages/'),
    getById: (id) => api.get(`/pages/${id}/`),
    create: (data) => api.post('/pages/', data),
    update: (id, data) => api.put(`/pages/${id}/`, data),
    delete: (id) => api.delete(`/pages/${id}/`),
};

export const categoryService = {
    getAll: () => api.get('/categories/'),
    getById: (id) => api.get(`/categories/${id}/`),
    create: (data) => api.post('/categories/', data),
    update: (id, data) => api.put(`/categories/${id}/`, data),
    delete: (id) => api.delete(`/categories/${id}/`),
};

export const menuService = {
    getAll: () => api.get('/menus/'),
    getItems: (menuId) => api.get(`/menu-items/?menu=${menuId}`),
};

export const mediaService = {
    getAll: () => api.get('/media/'),
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/media/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
}; 