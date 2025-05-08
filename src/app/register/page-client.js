"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaCheck,
    FaExclamationCircle,
    FaUserGraduate,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterClient() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
        class: "",
    });

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [loadingClasses, setLoadingClasses] = useState(true);
    const router = useRouter();
    const { register } = useAuth();

    // Fetch classes for student registration or use hardcoded classes if API fails
    useEffect(() => {
        const fetchClasses = async() => {
            try {
                const response = await fetch("/api/classes");
                if (response.ok) {
                    const data = await response.json();
                    const classesData = data.classes || data || [];

                    // If classes are returned from API, use them
                    if (classesData.length > 0) {
                        setClasses(classesData);
                    } else {
                        // Use default classes if no classes returned
                        createDefaultClasses();
                    }
                } else {
                    console.error("Failed to fetch classes");
                    createDefaultClasses();
                }
            } catch (err) {
                console.error("Error fetching classes:", err);
                createDefaultClasses();
            } finally {
                setLoadingClasses(false);
            }
        };

        // Create JSS1 A/B to SS3 A/B classes
        const createDefaultClasses = () => {
            const defaultClasses = [];
            ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"].forEach((level) => {
                ["A", "B"].forEach((section) => {
                    defaultClasses.push({
                        _id: `${level}${section}`,
                        name: `${level} ${section}`,
                    });
                });
            });
            setClasses(defaultClasses);
        };

        fetchClasses();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRoleChange = (role) => {
        setFormData((prev) => ({
            ...prev,
            role,
            // Reset class if switching to teacher role
            ...(role === "teacher" && { class: "" }),
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            // Validate inputs
            if (!formData.name || !formData.email || !formData.password) {
                throw new Error("Please fill in all required fields");
            }

            if (formData.password !== formData.confirmPassword) {
                throw new Error("Passwords do not match");
            }

            if (formData.password.length < 8) {
                throw new Error("Password must be at least 8 characters long");
            }

            if (formData.role === "student" && !formData.class) {
                throw new Error("Please select a class");
            }

            // Register user
            const result = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                class: formData.class || undefined,
            });

            setSuccessMessage(
                "Registration successful! Please check your email to verify your account."
            );

            // Clear form
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "student",
                class: "",
            });

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
            console.error("Registration error:", err);
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
        h1 className = "text-center text-3xl font-extrabold text-gray-900" > { " " }
        Camsole { " " } <
        /h1>{" "} <
        h2 className = "mt-6 text-center text-2xl font-bold text-gray-900" >
        Create a new account { " " } <
        /h2>{" "} <
        div className = "mt-4 flex justify-center" >
        <
        div className = "flex border border-gray-300 rounded-md overflow-hidden" >
        <
        button className = { `px-4 py-2 focus:outline-none ${
									formData.role === "student"
										? "bg-blue-600 text-white"
										: "bg-white text-gray-700 hover:bg-gray-50"
								}` }
        onClick = {
            () => handleRoleChange("student") }
        type = "button" >
        Student { " " } <
        /button>{" "} <
        button className = { `px-4 py-2 focus:outline-none ${
									formData.role === "teacher"
										? "bg-blue-600 text-white"
										: "bg-white text-gray-700 hover:bg-gray-50"
								}` }
        onClick = {
            () => handleRoleChange("teacher") }
        type = "button" >
        Teacher / Admin { " " } <
        /button>{" "} <
        /div>{" "} <
        /div>{" "} <
        /div> {
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
                h3 className = "text-sm font-medium text-red-800" > { error } < /h3>{" "} <
                /div>{" "} <
                /div>{" "} <
                /div>
            )
        } {
            successMessage && ( <
                div className = "rounded-md bg-green-50 p-4" >
                <
                div className = "flex" >
                <
                div className = "flex-shrink-0" >
                <
                FaCheck className = "h-5 w-5 text-green-400" / >
                <
                /div>{" "} <
                div className = "ml-3" >
                <
                h3 className = "text-sm font-medium text-green-800" > { " " } { successMessage } { " " } <
                /h3>{" "} <
                /div>{" "} <
                /div>{" "} <
                /div>
            )
        } <
        form className = "mt-8 space-y-6"
        onSubmit = { handleSubmit } >
        <
        div className = "rounded-md shadow-sm -space-y-px" >
        <
        div >
        <
        label htmlFor = "name"
        className = "sr-only" > { " " }
        Full Name { " " } <
        /label>{" "} <
        div className = "relative" >
        <
        div className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
        <
        FaUser className = "h-5 w-5 text-gray-400" / >
        <
        /div>{" "} <
        input id = "name"
        name = "name"
        type = "text"
        autoComplete = "name"
        required value = { formData.name }
        onChange = { handleChange }
        className = "appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder = "Full Name" /
        >
        <
        /div>{" "} <
        /div> <
        div >
        <
        label htmlFor = "email"
        className = "sr-only" > { " " }
        Email address { " " } <
        /label>{" "} <
        div className = "relative" >
        <
        div className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
        <
        FaEnvelope className = "h-5 w-5 text-gray-400" / >
        <
        /div>{" "} <
        input id = "email"
        name = "email"
        type = "email"
        autoComplete = "email"
        required value = { formData.email }
        onChange = { handleChange }
        className = "appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder = "Email address" /
        >
        <
        /div>{" "} <
        /div> <
        div >
        <
        label htmlFor = "password"
        className = "sr-only" > { " " }
        Password { " " } <
        /label>{" "} <
        div className = "relative" >
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
        required value = { formData.password }
        onChange = { handleChange }
        className = "appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder = "Password (minimum 8 characters)" /
        >
        <
        /div>{" "} <
        /div> <
        div >
        <
        label htmlFor = "confirmPassword"
        className = "sr-only" > { " " }
        Confirm Password { " " } <
        /label>{" "} <
        div className = "relative" >
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
        required value = { formData.confirmPassword }
        onChange = { handleChange }
        className = { `appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border ${
										formData.confirmPassword &&
										formData.password !== formData.confirmPassword
											? "border-red-300 focus:ring-red-500 focus:border-red-500"
											: "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
									} placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm ${
										formData.role === "student" ? "" : "rounded-b-md"
									}` }
        placeholder = "Confirm Password" /
        >
        <
        /div>{" "} {
            formData.confirmPassword &&
                formData.password !== formData.confirmPassword && ( <
                    p className = "text-red-600 text-xs mt-1" > { " " }
                    Passwords do not match { " " } <
                        /p>
                )
        } { " " } <
        /div> {
            formData.role === "student" && ( <
                div >
                <
                label htmlFor = "class"
                className = "sr-only" > { " " }
                Class { " " } <
                /label>{" "} <
                div className = "relative" >
                <
                div className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
                <
                FaUserGraduate className = "h-5 w-5 text-gray-400" / >
                <
                /div>{" "} <
                select id = "class"
                name = "class"
                required value = { formData.class }
                onChange = { handleChange }
                className = "appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" >
                <
                option value = "" > Select your class < /option>{" "} {
                    loadingClasses ? ( <
                        option disabled > Loading classes... < /option>
                    ) : classes && classes.length > 0 ? (
                        classes.map((cls, index) => ( <
                            option key = { cls._id || index }
                            value = { cls.name || cls } > { " " } { cls.name || cls } { " " } <
                            /option>
                        ))
                    ) : ( <
                        option disabled > No classes available < /option>
                    )
                } { " " } <
                /select>{" "} <
                /div>{" "} <
                /div>
            )
        } { " " } <
        /div> <
        div >
        <
        button type = "submit"
        disabled = { loading }
        className = { `group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
								loading ? "opacity-70 cursor-not-allowed" : ""
							}` } >
        { " " } {
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
                strokeWidth = "4" >
                { " " } <
                /circle>{" "} <
                path className = "opacity-75"
                fill = "currentColor"
                d = "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" >
                { " " } <
                /path>{" "} <
                /svg>{" "} <
                /span>
            ) : null
        }
        Create Account { " " } <
        /button>{" "} <
        /div>{" "} <
        /form> <
        div className = "text-center mt-4" >
        <
        p className = "text-sm text-gray-600" >
        Already have an account ? { " " } <
        Link href = "/login"
        className = "font-medium text-blue-600 hover:text-blue-500" >
        Sign in
        <
        /Link>{" "} <
        /p>{" "} <
        /div>{" "} <
        /div>{" "} <
        /div>
    );
}