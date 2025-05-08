"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);

    // Initialize auth state by fetching current user from server
    useEffect(() => {
        const initAuth = async() => {
            setLoading(true);
            try {
                const response = await fetch("/api/auth/me", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();
                if (response.ok && data.authenticated) {
                    // data contains user fields plus authenticated flag
                    const { authenticated, ...userData } = data;
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error initializing auth state:", error);
                setUser(null);
            } finally {
                setLoading(false);
                setInitialized(true);
            }
        };
        initAuth();
    }, []);

    // Login function
    const login = async(email, password) => {
        setLoading(true);
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }
            // Set user from server response
            setUser(data.user);
            return data.user;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async(userData) => {
        setLoading(true);
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Registration failed");
            }
            // Optionally set user on register since cookie is set
            setUser(data.user);
            return data.user;
        } catch (error) {
            console.error("Register error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = async() => {
        setLoading(true);
        try {
            // Invalidate server session and clear cookie
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Check if user is authenticated
    const isAuthenticated = !!user;

    return ( <
        AuthContext.Provider value = {
            {
                user,
                loading: !initialized || loading,
                login,
                register,
                logout,
                isAuthenticated,
            }
        } > { " " } { children } { " " } <
        /AuthContext.Provider>
    );
}

// Custom hook to use the auth context
// Custom hook to use the auth context
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}

// Higher-order component to protect pages by requiring authentication
/**
 * Wrap a component and enforce auth (and optional role-based access).
 */
export function withAuth(Component, allowedRoles = []) {
    return function AuthenticatedComponent(props) {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading) {
                if (!user) {
                    router.push("/login");
                } else if (
                    allowedRoles.length > 0 &&
                    !allowedRoles.includes(user.role)
                ) {
                    router.push("/unauthorized");
                }
            }
        }, [loading, user]);

        if (
            loading ||
            !user ||
            (allowedRoles.length > 0 && !allowedRoles.includes(user.role))
        ) {
            return ( <
                div className = "min-h-screen flex items-center justify-center" >
                <
                div > Loading... < /div>{" "} < /
                div >
            );
        }

        return <Component {...props }
        />;
    };
}