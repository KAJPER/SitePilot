import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

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