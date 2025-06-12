import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const authApiBaseUrl = 'http://localhost:8000/api/auth'; 

const LoginForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isRTL, setIsRTL] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ email: "", password: "" });
    const t = useTranslations();

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const dir = document?.documentElement?.dir;
            setIsRTL(dir === "rtl");
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["dir"],
        });

        setIsRTL(document.documentElement.dir === "rtl");

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                const exp = decoded.exp;
                const currentTime = Date.now() / 1000;
                const token = localStorage.getItem("access_token");
                console.log(jwtDecode(token));

                if (exp && currentTime < exp) {
                    console.log("Valid token found. Redirecting to dashboard.");
                    router.push("/dashboard");
                } else {
                    localStorage.removeItem("access_token");
                    toast.info(t('session_expired_login_again') || "Session expired. Please log in again.");
                }
            } catch {
                localStorage.removeItem("access_token");
                toast.info(t('session_expired_login_again') || "Invalid session token. Please log in again.");
            }
        }
    }, [router, t]);

    const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);
    const validatePassword = (value) => value.trim().length > 0;

    const handleLogin = async (e) => {
        e.preventDefault();

        const newErrors = { email: "", password: "" };
        if (!email.trim() || !validateEmail(email)) newErrors.email = t("invalid_email_message") || "Input a valid email!";
        if (!password.trim()) newErrors.password = t("invalid_password_message") || "Input your password!";

        setError(newErrors);
        if (Object.values(newErrors).some((msg) => msg !== "")) {
            toast.error("Please Enter Email ID and Password");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${authApiBaseUrl}/login`, { email, password });

            const { access_token, message } = res.data;

            if (access_token) {
                localStorage.setItem("access_token", access_token);
                toast.success("Login successful");
                console.log(res.data)
                setTimeout(() => {
                    router.push("/dashboard");
                }, 500);
            } else {
                toast.error(t("something_went_wrong") || "Missing access token in response");
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                t("something_went_wrong") ||
                "Something went wrong! Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border-2 border-stone-200 w-full max-w-lg min-h-[calc(100vh-325px)] p-7 rounded-2xl shadow-2xl">
            <h4 className="text-center text-[30px] text-[#002F6C] font-semibold">{t("sign_in")}</h4>
            <p className="text-[18px] text-[Montserrat] text-[#848FAC] text-center mt-2 mb-5">
                {t("portal_welcome")}
            </p>

            <form onSubmit={handleLogin}>
                {/* Email input */}
                <label className="block text-xs text-gray-400 mb-1" htmlFor="email">{t("email_label")}</label>
                <input
                    type="email"
                    id="email"
                    placeholder={t("email_placeholder")}
                    value={email}
                    onChange={(e) => {
                        const value = e.target.value;
                        setEmail(value);
                        setError((prev) => ({ ...prev, email: validateEmail(value) ? "" : t("invalid_email_message") || "Input a valid email!" }));
                    }}
                    autoComplete="off"
                    className={`w-full p-3 text-sm font-[Montserrat] rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 ${
                        email && validateEmail(email)
                            ? "border-[#002F6C] focus:border-[#002F6C] focus:ring-[#002F6C]"
                            : error.email
                            ? "border-red-500 focus:ring-red-300 placeholder-red-400"
                            : "border-gray-300"
                    }`}
                />
                <AnimatePresence>
                    {error.email && (
                        <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.25 }}
                            className="text-red-500 text-xs mt-1"
                        >
                            {error.email}
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Password input */}
                <label className="block text-xs text-gray-400 mb-1 mt-4" htmlFor="password">{t("password_label")}</label>
                <div className="relative mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder={t("password_placeholder")}
                        value={password}
                        onChange={(e) => {
                            const value = e.target.value;
                            setPassword(value);
                            setError((prev) => ({ ...prev, password: validatePassword(value) ? "" : t("invalid_password_message") || "Input your password!" }));
                        }}
                        autoComplete="off"
                        className={`w-full font-[Montserrat] p-3 text-sm rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 ${
                            password && validatePassword(password)
                                ? "border-[#002F6C] focus:border-[#002F6C] focus:ring-[#002F6C]"
                                : error.password
                                ? "border-red-500 focus:ring-red-300 placeholder-red-400"
                                : "border-gray-300"
                        } ${isRTL ? "pl-10 pr-2" : "pr-10 pl-2"}`}
                    />
                    <AnimatePresence>
                        {error.password && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.25 }}
                                className="text-red-500 text-xs mt-1"
                            >
                                {error.password}
                            </motion.p>
                        )}
                    </AnimatePresence>
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className={`absolute inset-y-0 flex items-center text-gray-400 hover:text-black transition-colors duration-300 ${
                            isRTL ? "left-3" : "right-3"
                        }`}
                        tabIndex={-1}
                    >
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </div>

                <button
                    type="submit"
                    className={`w-full bg-sky-900 text-white py-3 rounded font-semibold ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : t("login_button")}
                </button>

                <Link href="/forgot-password">
                    <div className="text-sky-900 mt-4 text-center font-semibold cursor-pointer text-xs">
                        {t("forgot_password")}
                    </div>
                </Link>
            </form>

            <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop />
        </div>
    );
};

export default LoginForm;
