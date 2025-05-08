"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Create the auth context with default values to avoid null
const AuthContext = createContext({
    user: null,
    loading: true,
    login: async() => {},
    logout: async() => {},
    register: async() => {},
});

// Custom hook to use the auth context
export function useAuth() {
    const context = useContext(AuthContext);
    // Provide better error message if used outside provider
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// Auth provider component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetch the current user on component mount
    useEffect(() => {
        const fetchUser = async() => {
            try {
                const response = await fetch("/api/auth/me");
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // Login function
    const login = async(email, password) => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }

            setUser(data.user);
            return data.user;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    // Logout function
    const logout = async() => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
            });
            setUser(null);
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Register function
    const register = async(userData) => {
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Registration failed");
            }

            setUser(data.user);
            return data.user;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    // Use a consistent pattern for the provider - no whitespace issues
    const value = {
        user,
        loading,
        login,
        logout,
        register,
    };

    return ( <
        AuthContext.Provider value = { value } > { children } < /AuthContext.Provider>
    );
}

// Protected route component
export function ProtectedRoute({ children, allowedRoles = [] }) {
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
            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                router.push("/unauthorized");
                return;
            }

            // User is authorized
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
                    p className = "mt-4 text-gray-600" > Loading... < /p>{" "} <
                    />
                ) : ( <
                    p className = "text-gray-600" > Checking authorization... < /p>
                )
            } { " " } <
            /div>{" "} <
            /div>
        );
    }

    // If authorized, show the children
    return children;
}