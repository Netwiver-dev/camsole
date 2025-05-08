"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    FaEnvelope,
    FaLock,
    FaExclamationCircle,
    FaUserGraduate,
    FaChalkboardTeacher,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginClient() {
    const [activeTab, setActiveTab] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!email || !password) {
                throw new Error("Please fill in all fields");
            }
            const user = await login(email, password);
            if (user.role === "student") {
                router.push("/organization-user/home");
            } else {
                router.push("/organization/home");
            }
        } catch (err) {
            setError(err.message || "Login failed. Please check your credentials.");
            console.error("Login error:", err);
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
        h2 className = "mt-6 text-center text-2xl font-bold text-gray-900" > { activeTab === "student" ? "Student Login" : "Teacher/Admin Login" } <
        /h2> <
        /div>

        <
        div className = "flex justify-center mb-6" >
        <
        div className = "flex rounded-md shadow-sm" >
        <
        button className = { `py-2 px-4 border ${
								activeTab === "student"
									? "bg-blue-600 text-white border-blue-600"
									: "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
							} rounded-l-md` }
        onClick = {
            () => setActiveTab("student") } >
        <
        FaUserGraduate className = "inline-block mr-2" / >
        Student <
        /button> <
        button className = { `py-2 px-4 border ${
								activeTab === "teacher"
									? "bg-blue-600 text-white border-blue-600"
									: "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
							} rounded-r-md` }
        onClick = {
            () => setActiveTab("teacher") } >
        <
        FaChalkboardTeacher className = "inline-block mr-2" / >
        Teacher / Admin <
        /button> <
        /div> <
        /div>

        {
            error && ( <
                div className = "rounded-md bg-red-50 p-4 mb-4" >
                <
                div className = "flex" >
                <
                FaExclamationCircle className = "h-5 w-5 text-red-400 flex-shrink-0" / >
                <
                div className = "ml-3" >
                <
                h3 className = "text-sm font-medium text-red-800" > { error } < /h3> <
                /div> <
                /div> <
                /div>
            )
        }

        <
        form className = "mt-8 space-y-6"
        onSubmit = { handleSubmit } >
        <
        div className = "rounded-md shadow-sm -space-y-px" >
        <
        div >
        <
        label htmlFor = "email"
        className = "sr-only" >
        Email address <
        /label> <
        div className = "relative" >
        <
        div className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
        <
        FaEnvelope className = "h-5 w-5 text-gray-400" / >
        <
        /div> <
        input id = "email"
        name = "email"
        type = "email"
        autoComplete = "email"
        required value = { email }
        onChange = {
            (e) => setEmail(e.target.value) }
        className = "appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder = "Email address" /
        >
        <
        /div> <
        /div> <
        div >
        <
        label htmlFor = "password"
        className = "sr-only" >
        Password <
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
        autoComplete = "current-password"
        required value = { password }
        onChange = {
            (e) => setPassword(e.target.value) }
        className = "appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder = "Password" /
        >
        <
        /div> <
        /div> <
        /div>

        <
        div >
        <
        button type = "submit"
        disabled = { loading }
        className = { `group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 ${
								loading ? "opacity-70 cursor-not-allowed" : ""
							}` } >
        {
            loading && ( <
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
            )
        }
        Sign in
        <
        /button> <
        /div> <
        /form>

        <
        div className = "text-center mt-4" >
        <
        p className = "text-sm text-gray-600" >
        Don & apos; t have an account ? { " " } <
        Link href = "/register"
        className = "font-medium text-blue-600 hover:text-blue-500" >
        Register <
        /Link> <
        /p> <
        /div> <
        /div> <
        /div>
    );
}