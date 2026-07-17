import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    withCredentials: true,
    timeout: 15000
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAdminArea = window.location.pathname === "/admin" ||
            window.location.pathname.startsWith("/history/");

        if (error.response?.status === 401 && isAdminArea) {
            window.location.replace("/admin-login");
        }

        return Promise.reject(error);
    }
);

export default api;
