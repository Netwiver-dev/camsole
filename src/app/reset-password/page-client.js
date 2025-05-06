"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaLock, FaExclamationCircle, FaCheck } from "react-icons/fa";

export default function ResetPasswordPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Get token from URL
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
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return ( <
        div className = "min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" >
        <
        div className = "sm:mx-auto sm:w-full sm:max-w-md" >
        <
        h2 className = "mt-6 text-center text-3xl font-extrabold text-gray-900" >
        Reset Your Password { " " } <
        /h2>{" "} <
        /div> <
        div className = "mt-8 sm:mx-auto sm:w-full sm:max-w-md" >
        <
        div className = "bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10" > { " " } {
            success ? ( <
                div className = "text-center" >
                <
                div className = "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100" >
                <
                FaCheck className = "h-6 w-6 text-green-600" / >
                <
                /div>{" "} <
                h3 className = "mt-2 text-sm font-medium text-gray-900" > { " " }
                Password Reset Successful { " " } <
                /h3>{" "} <
                p className = "mt-1 text-sm text-gray-500" >
                Your password has been reset successfully.Redirecting to login... { " " } <
                /p>{" "} <
                /div>
            ) : tokenValid === false ? ( <
                div className = "text-center" >
                <
                div className = "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100" >
                <
                FaExclamationCircle className = "h-6 w-6 text-red-600" / >
                <
                /div>{" "} <
                h3 className = "mt-2 text-sm font-medium text-gray-900" > { " " }
                Invalid Reset Link { " " } <
                /h3>{" "} <
                p className = "mt-1 text-sm text-red-500" > { error } < /p>{" "} <
                div className = "mt-6" >
                <
                Link href = "/forgot-password"
                className = "text-sm font-medium text-indigo-600 hover:text-indigo-500" >
                Request a new password reset link { " " } <
                /Link>{" "} <
                /div>{" "} <
                /div>
            ) : tokenValid === null ? ( <
                p className = "text-center" > Verifying your reset token... < /p>
            ) : ( <
                form className = "space-y-6"
                onSubmit = { handleSubmit } > { " " } {
                    error && ( <
                        div className = "rounded-md bg-red-50 p-4" >
                        <
                        div className = "flex" >
                        <
                        div className = "flex-shrink-0" >
                        <
                        FaExclamationCircle className = "h-5 w-5 text-red-400" / >
                        <
                        /div>{" "} <
                        div className = "ml-3" >
                        <
                        h3 className = "text-sm font-medium text-red-800" > { " " } { error } { " " } <
                        /h3>{" "} <
                        /div>{" "} <
                        /div>{" "} <
                        /div>
                    )
                } <
                div >
                <
                label htmlFor = "password"
                className = "block text-sm font-medium text-gray-700" >
                New Password { " " } <
                /label>{" "} <
                div className = "mt-1 relative rounded-md shadow-sm" >
                <
                div className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
                <
                FaLock className = "h-5 w-5 text-gray-400" / >
                <
                /div>{" "} <
                input id = "password"
                name = "password"
                type = "password"
                autoComplete = "new-password"
                required className = "focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder = "New password"
                value = { formData.password }
                onChange = { handleChange }
                />{" "} <
                /div>{" "} <
                p className = "mt-2 text-xs text-gray-500" >
                Password must be at least 8 characters long { " " } <
                /p>{" "} <
                /div> <
                div >
                <
                label htmlFor = "confirmPassword"
                className = "block text-sm font-medium text-gray-700" >
                Confirm New Password { " " } <
                /label>{" "} <
                div className = "mt-1 relative rounded-md shadow-sm" >
                <
                div className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
                <
                FaLock className = "h-5 w-5 text-gray-400" / >
                <
                /div>{" "} <
                input id = "confirmPassword"
                name = "confirmPassword"
                type = "password"
                autoComplete = "new-password"
                required className = "focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder = "Confirm new password"
                value = { formData.confirmPassword }
                onChange = { handleChange }
                />{" "} <
                /div>{" "} <
                /div> <
                div >
                <
                button type = "submit"
                className = "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled = { loading } >
                { loading ? "Resetting..." : "Reset Password" } { " " } <
                /button>{" "} <
                /div> <
                div className = "text-sm text-center" >
                <
                Link href = "/login"
                className = "font-medium text-indigo-600 hover:text-indigo-500" >
                Back to login { " " } <
                /Link>{" "} <
                /div>{" "} <
                /form>
            )
        } { " " } <
        /div>{" "} <
        /div>{" "} <
        /div>
    );
}