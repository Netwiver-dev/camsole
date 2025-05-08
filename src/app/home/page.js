"use client";

import { useAuth } from "../../lib/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirect to dashboard if user is authenticated
        if (!loading && user) {
            router.push("/dashboard");
        }

        // Redirect to login if user is not authenticated
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Show loading indicator while checking authentication
    return ( <
        div className = "min-h-screen flex items-center justify-center bg-gray-50" >
        <
        div className = "text-center" >
        <
        div className = "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto" > < /div> <
        p className = "mt-4 text-gray-600" > Redirecting... < /p> < /
        div > <
        /div>
    );
}