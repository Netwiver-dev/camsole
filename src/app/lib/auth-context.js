"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

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
        } > { " " } { children } { " " } <
        /AuthContext.Provider>
    );
};

// FIXED: Protected route component that prevents hooks order changes
export function ProtectedRoute({ children, allowedRoles = [] }) {
    // Always call hooks in the same order
    const { user, loading } = useAuth();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Check authorization after loading completes
        if (!loading) {
            // If no user is found, redirect to login
            if (!user) {
                router.push("/login");
                return;
            }

            // If roles are specified, check if user has required role
            if (allowedRoles.length > 0) {
                const hasRequiredRole = allowedRoles.includes(user.role);
                if (!hasRequiredRole) {
                    // Redirect to unauthorized page or dashboard
                    router.push("/unauthorized");
                    return;
                }
            }

            // If we reach here, the user is authorized
            setAuthorized(true);
        }
    }, [user, loading, router, allowedRoles]);

    // Show loading state or nothing while checking auth
    if (loading || !authorized) {
        return ( <
            div className = "min-h-screen flex items-center justify-center bg-gray-50" >
            <
            div className = "text-center" > { " " } {
                loading ? ( <
                    >
                    <
                    div className = "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto" > { " " } <
                    /div>{" "} <
                    p className = "mt-4 text-gray-600" > Loading... < /p>{" "} < / >
                ) : ( <
                    p className = "text-gray-600" > Checking authorization... < /p>
                )
            } { " " } <
            /div>{" "} < /
            div >
        );
    }

    // If authorized, show the children
    return < > { children } < />;
}

// Higher-order component to wrap pages with authentication
export function withAuth(Component, allowedRoles = []) {
    return function AuthenticatedComponent(props) {
        return ( <
            ProtectedRoute allowedRoles = { allowedRoles } >
            <
            Component {...props }
            /> < /
            ProtectedRoute >
        );
    };
}