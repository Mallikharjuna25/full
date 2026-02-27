import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("en_token");
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
        if (error.response?.status === 401) {
            const avoidRedirectPaths = [
                "/student-login",
                "/coordinator-login",
                "/student-signup",
                "/coordinator-signup",
            ];
            if (!avoidRedirectPaths.some((p) => window.location.pathname.startsWith(p))) {
                localStorage.removeItem("en_token");
                localStorage.removeItem("en_user");
                window.dispatchEvent(new CustomEvent("auth:expired"));
            }
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    loginStudent: (data) => api.post("/auth/student/login", data),
    registerStudent: (data) => api.post("/auth/student/register", data),
    loginCoordinator: (data) => api.post("/auth/coordinator/login", data),
    registerCoordinator: (data) => api.post("/auth/coordinator/register", data),
    logout: () => api.post("/auth/logout"),
    getMe: () => api.get("/auth/me"),
    updateStudentProfile: (data) => api.put("/auth/student/profile", data),
    updateCoordinatorProfile: (data) => api.put("/auth/coordinator/profile", data),
    changePassword: (data) => api.put("/auth/change-password", data),
};

export const coordinatorAPI = {
    createEvent: (data) => api.post("/coordinator/events", data),
    getMyEvents: () => api.get("/coordinator/events"),
    getEventById: (id) => api.get(`/coordinator/events/${id}`),
    updateEvent: (id, d) => api.put(`/coordinator/events/${id}`, d),
    deleteEvent: (id) => api.delete(`/coordinator/events/${id}`),
    getAnalytics: () => api.get("/coordinator/analytics"),
};

export default api;
