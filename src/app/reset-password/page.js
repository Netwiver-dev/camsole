"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaExclamationCircle, FaCheck, FaLock } from "react-icons/fa";

// Create a wrapper component that uses searchParams
function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [token, setToken] = useState("");
    const [tokenValid, setTokenValid] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");
        if (tokenFromUrl) {
            setToken(tokenFromUrl);

            // Verify token validity
            const verifyToken = async() => {
                try {
                    const response = await fetch(
                        `/api/reset-password?token=${tokenFromUrl}`, {
                            method: "GET",
                        }
                    );

                    const data = await response.json();

                    if (response.ok) {
                        setTokenValid(true);
                    } else {
                        setTokenValid(false);
                        setError(data.error || "Invalid or expired reset token");
                    }
                } catch (err) {
                    setTokenValid(false);
                    setError("An error occurred verifying your token");
                }
            };

            verifyToken();
        } else {
            setTokenValid(false);
            setError("Reset token not provided");
        }
    }, [searchParams]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Validate inputs
            if (!formData.password) {
                throw new Error("Please enter a new password");
            }

            if (formData.password !== formData.confirmPassword) {
                throw new Error("Passwords do not match");
            }

            if (formData.password.length < 8) {
                throw new Error("Password must be at least 8 characters long");
            }

            const response = await fetch("/api/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to reset password");
            }

            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err) {
            setError(err.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return ( <
        div className = "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" >
        <
        div className = "max-w-md w-full space-y-8" >
        <
        div >
        <
        h1 className = "text-center text-3xl font-extrabold text-gray-900" >
        Camsole <
        /h1> <
        h2 className = "mt-6 text-center text-2xl font-bold text-gray-900" >
        Set New Password <
        /h2> {
            !success && ( <
                p className = "mt-2 text-center text-sm text-gray-600" >
                Please enter and confirm your new password <
                /p>
            )
        } <
        /div>

        {
            error && ( <
                div className = "rounded-md bg-red-50 p-4" >
                <
                div className = "flex" >
                <
                div className = "flex-shrink-0" >
                <
                FaExclamationCircle className = "h-5 w-5 text-red-400" / >
                <
                /div> <
                div className = "ml-3" >
                <
                h3 className = "text-sm font-medium text-red-800" > { error } < /h3> {
                    tokenValid === false && ( <
                        p className = "mt-2 text-sm text-red-700" >
                        <
                        Link href = "/forgot-password"
                        className = "font-medium text-red-700 underline" >
                        Request a new password reset link <
                        /Link> <
                        /p>
                    )
                } <
                /div> <
                /div> <
                /div>
            )
        }

        {
            success ? ( <
                div className = "rounded-md bg-green-50 p-4" >
                <
                div className = "flex" >
                <
                div className = "flex-shrink-0" >
                <
                FaCheck className = "h-5 w-5 text-green-400" / >
                <
                /div> <
                div className = "ml-3" >
                <
                h3 className = "text-sm font-medium text-green-800" >
                Password successfully reset!
                <
                /h3> <
                p className = "mt-2 text-sm text-green-700" >
                You will be redirected to the login page shortly. <
                /p> <
                /div> <
                /div> <
                /div>
            ) : tokenValid ? ( <
                form className = "mt-8 space-y-6"
                onSubmit = { handleSubmit } >
                <
                div className = "rounded-md shadow-sm -space-y-px" >
                <
                div >
                <
                label htmlFor = "password"
                className = "sr-only" >
                New Password <
                /label> <
                div className = "relative" >
                <
                div className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
                <
                FaLock className = "h-5 w-5 text-gray-400" / >
                <
                /div> <
                input id = "password"
                name = "password"
                type = "password"
                autoComplete = "new-password"
                required value = { formData.password }
                onChange = { handleChange }
                className = "appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder = "New Password (minimum 8 characters)" /
                >
                <
                /div> <
                /div> <
                div >
                <
                label htmlFor = "confirmPassword"
                className = "sr-only" >
                Confirm Password <
                /label> <
                div className = "relative" >
                <
                div className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
                <
                FaLock className = "h-5 w-5 text-gray-400" / >
                <
                /div> <
                input id = "confirmPassword"
                name = "confirmPassword"
                type = "password"
                autoComplete = "new-password"
                required value = { formData.confirmPassword }
                onChange = { handleChange }
                className = { `appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border ${
											formData.confirmPassword &&
											formData.password !== formData.confirmPassword
												? "border-red-300 focus:ring-red-500 focus:border-red-500"
												: "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
										} placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm rounded-b-md` }
                placeholder = "Confirm New Password" /
                >
                <
                /div> {
                    formData.confirmPassword &&
                        formData.password !== formData.confirmPassword && ( <
                            p className = "text-red-600 text-xs mt-1" >
                            Passwords do not match <
                                /p>
                        )
                } <
                /div> <
                /div>

                <
                div >
                <
                button type = "submit"
                disabled = { loading }
                className = { `group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
									loading ? "opacity-70 cursor-not-allowed" : ""
								}` } >
                {
                    loading ? ( <
                        span className = "absolute left-0 inset-y-0 flex items-center pl-3" >
                        <
                        svg className = "animate-spin h-5 w-5 text-white"
                        xmlns = "http://www.w3.org/2000/svg"
                        fill = "none"
                        viewBox = "0 0 24 24" >
                        <
                        circle className = "opacity-25"
                        cx = "12"
                        cy = "12"
                        r = "10"
                        stroke = "currentColor"
                        strokeWidth = "4" /
                        >
                        <
                        path className = "opacity-75"
                        fill = "currentColor"
                        d = "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /
                        >
                        <
                        /svg> <
                        /span>
                    ) : null
                }
                Reset Password <
                /button> <
                /div> <
                /form>
            ) : ( <
                div className = "mt-8 text-center" >
                <
                p className = "text-gray-600" > Verifying reset token... < /p> <
                /div>
            )
        }

        <
        div className = "text-center mt-4" >
        <
        p className = "text-sm text-gray-600" >
        <
        Link href = "/login"
        className = "font-medium text-blue-600 hover:text-blue-500" >
        Back to sign in
        <
        /Link> <
        /p> <
        /div> <
        /div> <
        /div>
    );
}

// Loading fallback component
function LoadingFallback() {
    return ( <
        div className = "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" >
        <
        div className = "max-w-md w-full text-center" >
        <
        h1 className = "text-center text-3xl font-extrabold text-gray-900" >
        Camsole <
        /h1> <
        div className = "mt-6" >
        <
        div className = "animate-pulse flex justify-center" >
        <
        svg className = "animate-spin h-10 w-10 text-blue-600"
        xmlns = "http://www.w3.org/2000/svg"
        fill = "none"
        viewBox = "0 0 24 24" >
        <
        circle className = "opacity-25"
        cx = "12"
        cy = "12"
        r = "10"
        stroke = "currentColor"
        strokeWidth = "4" >
        < /circle> <
        path className = "opacity-75"
        fill = "currentColor"
        d = "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" >
        < /path> <
        /svg> <
        /div> <
        p className = "mt-4 text-gray-600" > Loading password reset form... < /p> <
        /div> <
        /div> <
        /div>
    );
}

// Main component with suspense boundary
export default function ResetPasswordPage() {
    return ( <
        Suspense fallback = { < LoadingFallback / > } >
        <
        ResetPasswordContent / >
        <
        /Suspense>
    );
}