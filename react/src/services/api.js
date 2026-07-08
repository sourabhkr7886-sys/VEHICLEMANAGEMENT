import axios from "axios";

const api = axios.create({
  baseURL: "https://your-backend-name.onrender.com",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Don't send access token for authentication-free routes
    const noAuthRoutes = [
      "/login",
      "/forgot-password",
      "/reset-password",
    ];

    if (
      token &&
      !noAuthRoutes.some((route) => config.url.includes(route))
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
