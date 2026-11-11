import axios from "axios";

let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

const api = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true
});

// Attach Access Token
api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

let refreshPromise = null;

// Automatically refresh expired token
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/")
        ) {
            originalRequest._retry = true;

            try {
                if (!refreshPromise) {
                    refreshPromise = axios.post(
                        "http://localhost:3001/auth/refresh",
                        {},
                        { withCredentials: true }
                    )
                    .then((response) => {
                        const newToken = response.data.accessToken;
                        setAccessToken(newToken);
                        return newToken;
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
                }

                const newToken = await refreshPromise;

                originalRequest.headers.Authorization =
                    `Bearer ${newToken}`;

                return api(originalRequest);

            } catch (refreshError) {
                setAccessToken(null);

                window.dispatchEvent(
                    new Event("auth-expired")
                );

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;