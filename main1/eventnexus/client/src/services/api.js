import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !error.config.url.includes('/auth/')) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    adminLogin: (data) => api.post('/auth/admin-login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    changePassword: (data) => api.put('/auth/change-password', data),
};

export const eventsAPI = {
    getAll: (params) => api.get('/events', { params }),
    getById: (id) => api.get(`/events/${id}`),
    create: (data) => api.post('/events', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id, data) => api.put(`/events/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (id) => api.delete(`/events/${id}`),
    getHostEvents: () => api.get('/events/host/my-events'),
    getRegistrations: (id) => api.get(`/events/${id}/registrations`),
};

export const registrationsAPI = {
    register: (eventId, data) => api.post(`/registrations/event/${eventId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    getMine: () => api.get('/registrations/my'),
    getById: (id) => api.get(`/registrations/${id}`),
    cancel: (id) => api.delete(`/registrations/${id}`),
    scanQR: (data) => api.post('/registrations/scan', data),
};

export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getPendingEvents: () => api.get('/admin/events/pending'),
    getAllEvents: (params) => api.get('/admin/events', { params }),
    reviewEvent: (id, data) => api.put(`/admin/events/${id}/review`, data),
    getUsers: (params) => api.get('/admin/users', { params }),
    exportAttendance: (id) => api.get(`/admin/events/${id}/export`),
};

export const analyticsAPI = {
    getEventAnalytics: (id) => api.get(`/analytics/event/${id}`),
    getHostAnalytics: () => api.get('/analytics/host'),
};

export default api;
