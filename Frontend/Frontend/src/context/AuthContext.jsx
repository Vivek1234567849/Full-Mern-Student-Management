import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api, { setAccessToken } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // LOGIN
    const login = async (email, password) => {

        const response = await api.post("/auth/login", {
            email,
            password
        });

        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
        setIsAuthenticated(true);

        return response.data;
    };

    // REGISTER
    const register = async (name, email, password) => {

        const response = await api.post("/auth/register", {
            name,
            email,
            password
        });

        return response.data;
    };

    // LOGOUT
    const logout = async () => {

        try {
            await api.post("/auth/logout");
        } finally {
            setAccessToken(null);
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // RESTORE LOGIN AFTER PAGE REFRESH
    useEffect(() => {

        const restoreSession = async () => {
            try {
                const response = await api.post("/auth/refresh");

                setAccessToken(response.data.accessToken);

                // Get user details using the new access token
                const profile = await api.get("/auth/me");

                setUser(profile.data.user);
                setIsAuthenticated(true);

            } catch (error) {
                setAccessToken(null);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();

        const handleExpired = () => {
            setAccessToken(null);
            setUser(null);
            setIsAuthenticated(false);
        };

        window.addEventListener("auth-expired", handleExpired);

        return () => {
            window.removeEventListener("auth-expired", handleExpired);
        };

    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            accessTokenAvailable: isAuthenticated,
            isAuthenticated,
            loading,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);