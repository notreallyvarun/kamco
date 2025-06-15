import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { isTokenExpired } from '@/utils/token';
const authApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AUTH_API_BASE_URL || "http://localhost:8000/api/auth",
});

authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

authApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("401 Unauthorized. Redirecting to login...");
            clearStoredTokens();
            toast.error("Your session has expired. Please log in again.", {
                position: "top-center"
            });
            window.location.href = "/login";
            return Promise.reject(new axios.Cancel('Session expired, redirected.'));
        }
        return Promise.reject(error);
    }
);


const isTokenValid = () => {
    const token = localStorage.getItem('access_token')
    return token && !isTokenExpired(token)
};

const clearStoredTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};

const Dashboard = () => {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogout = useCallback(async () => {
        try {
            const refreshToken = localStorage.getItem("refresh_token");
            if (refreshToken) {
                await authApi.post("/logout", { token: refreshToken });
            }
        } catch (error) {
            console.error("Error during logout:", error);
            toast.error("Server logout failed, but you’ve been logged out.", {
                position: "top-center"
            });
        } finally {
            clearStoredTokens();
            router.push("/login");
            toast.info("You have been logged out successfully.", {
                position: "top-center"
            });
        }
    }, [router]);

    const fetchUserData = useCallback(async () => {
        setLoading(true);
        try {
           if (!isTokenValid()) {
            console.log("Token missing or expired. Redirecting to login.");
            clearStoredTokens();
            router.push('/login');
            toast.info("Your session expired. Please log in again.", {
                position: "top-center"
            });
            return;
            }
            const res = await authApi.get("/profile");
            setUserData(res.data);

            router.push({
                pathname: "/dashboard/userprofile",
                query: { data: JSON.stringify(res.data) },
            });

        } catch (error) {
            console.error("Failed to fetch user data:", error);
            if (!axios.isCancel(error)) {
                toast.error("Could not load dashboard data. Please try again.", {
                    position: "top-center"
                });
            }
            setUserData(null);
        } finally {
            setLoading(false);
        }
    }, [router]);

        useEffect(() => {
    if (!isTokenValid()) {
        console.log("Token missing or expired. Redirecting to login.");
        clearStoredTokens();
        router.push('/login');
        toast.info("Your session expired. Please log in again.", {
        position: "top-center"
        });
    }
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl text-gray-700">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 flex flex-col items-center justify-center p-6">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-8 drop-shadow-lg">
                Welcome to Your Dashboard!
            </h1>
            <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
                <div className="flex flex-col space-y-4 mt-8">
                    <button
                        onClick={fetchUserData}
                        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        disabled={loading}
                    >
                        Chatbot                    
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                        Logout
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Dashboard;
