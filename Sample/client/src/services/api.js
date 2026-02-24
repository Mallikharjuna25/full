import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getEvents = () => API.get('/events');
export const getEventById = (id) => API.get(`/events/${id}`);
export const createEvent = (data) => API.post('/events', data);
export const registerForEvent = (id) => API.post(`/registrations/${id}`);
export const markAttendance = (id) => API.post(`/registrations/${id}/attendance`);
export const getMyEvents = () => API.get('/registrations/my-events');
export const getAnalytics = (id) => API.get(`/admin/analytics/${id}`);
