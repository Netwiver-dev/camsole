"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

// Create auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const login = async(email, password) => {
        try {
            setLoading(true);
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to login");
            }

            setUser(data.user);

            // Redirect based on role
            if (data.user.role === "teacher") {
                router.push("/organization/home");
            } else if (data.user.role === "student") {
                router.push("/organization-user/home");
            }

            return data;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async(userData) => {
        try {
            setLoading(true);
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to register");
            }

            return data;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async() => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setUser(null);
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Check if user is authenticated
    const checkAuth = async() => {
        try {
            setLoading(true);
            const res = await fetch("/api/auth/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (res.ok && data.authenticated) {
                setUser(data.user);
            } else {
                setUser(null);

                // Redirect to login if on a protected path
                const isOrgUserPath = pathname ? .startsWith("/organization-user");
                const isOrgPath = pathname ? .startsWith("/organization");

                if ((isOrgPath || isOrgUserPath) && pathname !== "/login") {
                    router.push("/login");
                }
            }
        } catch (error) {
            console.error("Auth check error:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Check for offline status
    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        setIsOffline(!navigator.onLine);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // Check auth status on initial load and when path changes
    useEffect(() => {
        checkAuth();
    }, [pathname]);

    // Refresh auth token periodically (every 5 minutes)
    useEffect(() => {
        if (!user) return;

        const refreshInterval = setInterval(() => {
            checkAuth();
        }, 5 * 60 * 1000);

        return () => clearInterval(refreshInterval);
    }, [user]);

    return ( <
        AuthContext.Provider value = {
            {
                user,
                loading,
                login,
                register,
                logout,
                isOffline,
                checkAuth,
            }
        } >
        { children } <
        /AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// Higher-order component for protected routes
export function withAuth(Component) {
    return function ProtectedRoute(props) {
        // Ensure we're running in client-side where context is available
        const [mounted, setMounted] = useState(false);

        useEffect(() => {
            setMounted(true);
        }, []);

        // Don't try to access context until component is mounted
        if (!mounted) {
            return ( <
                div className = "flex items-center justify-center min-h-screen" >
                <
                div className = "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" > < /div> <
                /div>
            );
        }

        const auth = useAuth();
        const { user, loading, isOffline } = auth;
        const router = useRouter();
        const pathname = usePathname();

        useEffect(() => {
            // If not loading and not authenticated, redirect to login
            if (!loading && !user) {
                router.push("/login");
            }

            // Redirect based on role
            if (!loading && user) {
                const role = user.role;
                const isOrgPath = pathname ? .startsWith("/organization");
                const isOrgUserPath = pathname ? .startsWith("/organization-user");

                if (role === "student" && isOrgPath) {
                    router.push("/organization-user/home");
                } else if (role === "teacher" && isOrgUserPath) {
                    router.push("/organization/home");
                }
            }
        }, [loading, user, router, pathname]);

        // Show loading while checking authentication
        if (loading) {
            return ( <
                div className = "flex items-center justify-center min-h-screen" >
                <
                div className = "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" > < /div> <
                /div>
            );
        }

        // If offline, show a warning but allow local content to display
        if (isOffline) {
            return ( <
                >
                <
                div className = "bg-yellow-500 text-white px-4 py-2 text-sm font-medium flex items-center justify-center" >
                <
                svg xmlns = "http://www.w3.org/2000/svg"
                className = "h-5 w-5 mr-2"
                viewBox = "0 0 20 20"
                fill = "currentColor" >
                <
                path fillRule = "evenodd"
                d = "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule = "evenodd" /
                >
                <
                /svg>
                You 're currently offline. Some features may be unavailable. <
                /div> <
                div className = { isOffline ? "pointer-events-none opacity-70" : "" } > {
                    user && < Component {...props }
                    />} <
                    /div> <
                    />
                );
            }

            // If authenticated, render the component
            return user ? < Component {...props }
            /> : null;
        };
    }