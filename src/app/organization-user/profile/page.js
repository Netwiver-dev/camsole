"use client";

import { useState, useEffect } from "react";
import { useAuth, withAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import {
    FaUser,
    FaEnvelope,
    FaSchool,
    FaGraduationCap,
    FaCalendarAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaEdit,
} from "react-icons/fa";

function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        class: "",
        phone: "",
    });
    const [updateStatus, setUpdateStatus] = useState({
        success: false,
        message: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async() => {
        try {
            setLoading(true);

            const response = await fetch("/api/profile", { credentials: "include" });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || "Failed to fetch profile");
            }

            const data = await response.json();
            setProfile(data);
            setFormData({
                name: data.name || "",
                email: data.email || "",
                class: data.class || "",
                phone: data.phone || "",
            });
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update profile");
            }

            const updatedProfile = await response.json();
            setProfile(updatedProfile);
            setUpdateStatus({
                success: true,
                message: "Profile updated successfully",
            });
            setIsEditing(false);

            // Reset status message after 3 seconds
            setTimeout(() => {
                setUpdateStatus({ success: false, message: "" });
            }, 3000);
        } catch (err) {
            console.error("Error updating profile:", err);
            setUpdateStatus({
                success: false,
                message: err.message,
            });
        }
    };

    if (loading) {
        return ( <
            div className = "flex items-center justify-center min-h-screen" >
            <
            div className = "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" > < /div> < /
            div >
        );
    }

    return ( <
        div className = "p-4 md:p-6" >
        <
        div className = "max-w-3xl mx-auto" >
        <
        div className = "mb-6" >
        <
        h1 className = "text-2xl md:text-3xl font-bold mb-2" > My Profile < /h1> <
        p className = "text-gray-600" >
        View and manage your account information <
        /p> < /
        div >

        {
            error && ( <
                div className = "bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" >
                <
                p className = "font-bold" > Error < /p> <
                p > { error } < /p> < /
                div >
            )
        }

        {
            updateStatus.message && ( <
                div className = { `border-l-4 p-4 mb-6 ${
                            updateStatus.success
                                ? "bg-green-50 border-green-500 text-green-700"
                                : "bg-red-50 border-red-500 text-red-700"
                        }` } >
                <
                div className = "flex" > {
                    updateStatus.success ? ( <
                        FaCheckCircle className = "h-5 w-5 text-green-400 mr-3" / >
                    ) : ( <
                        FaTimesCircle className = "h-5 w-5 text-red-400 mr-3" / >
                    )
                } <
                p > { updateStatus.message } < /p> < /
                div > <
                /div>
            )
        }

        <
        div className = "bg-white rounded-lg shadow overflow-hidden" > { /* Profile header */ } <
        div className = "bg-blue-600 text-white p-6" >
        <
        div className = "flex items-center" >
        <
        div className = "h-24 w-24 rounded-full bg-blue-400 flex items-center justify-center text-white text-4xl font-bold" > { profile ? .name ? .charAt(0) || < FaUser / > } <
        /div> <
        div className = "ml-6" >
        <
        h2 className = "text-2xl font-bold" > { profile ? .name } < /h2> <
        p className = "text-blue-100" > {
            profile ? .role === "student" ?
            "Student" :
            "Organization User"
        } <
        /p> < /
        div > <
        /div> < /
        div >

        { /* Profile content */ } <
        div className = "p-6" > {!isEditing ? ( <
                div >
                <
                div className = "mb-6" >
                <
                div className = "flex justify-between" >
                <
                h3 className = "text-lg font-semibold mb-4" >
                Personal Information <
                /h3> <
                button onClick = {
                    () => setIsEditing(true)
                }
                className = "flex items-center text-blue-600 hover:text-blue-800" >
                <
                FaEdit className = "mr-1" / > Edit <
                /button> < /
                div >

                <
                div className = "grid grid-cols-1 md:grid-cols-2 gap-6" >
                <
                div >
                <
                p className = "text-sm text-gray-500 mb-1" > Full Name < /p> <
                div className = "flex items-center" >
                <
                FaUser className = "text-gray-400 mr-2" / >
                <
                p className = "font-medium" > { profile ? .name } < /p> < /
                div > <
                /div>

                <
                div >
                <
                p className = "text-sm text-gray-500 mb-1" > Email < /p> <
                div className = "flex items-center" >
                <
                FaEnvelope className = "text-gray-400 mr-2" / >
                <
                p className = "font-medium" > { profile ? .email } < /p> < /
                div > <
                /div>

                <
                div >
                <
                p className = "text-sm text-gray-500 mb-1" >
                Class / Department <
                /p> <
                div className = "flex items-center" >
                <
                FaSchool className = "text-gray-400 mr-2" / >
                <
                p className = "font-medium" > { profile ? .class || "Not specified" } <
                /p> < /
                div > <
                /div>

                <
                div >
                <
                p className = "text-sm text-gray-500 mb-1" > Phone < /p> <
                div className = "flex items-center" >
                <
                FaEnvelope className = "text-gray-400 mr-2" / >
                <
                p className = "font-medium" > { profile ? .phone || "Not specified" } <
                /p> < /
                div > <
                /div> < /
                div > <
                /div>

                <
                div >
                <
                h3 className = "text-lg font-semibold mb-4" >
                Account Information <
                /h3>

                <
                div className = "grid grid-cols-1 md:grid-cols-2 gap-6" >
                <
                div >
                <
                p className = "text-sm text-gray-500 mb-1" > Account Type < /p> <
                div className = "flex items-center" >
                <
                FaGraduationCap className = "text-gray-400 mr-2" / >
                <
                p className = "font-medium capitalize" > { profile ? .role || "Student" } <
                /p> < /
                div > <
                /div>

                <
                div >
                <
                p className = "text-sm text-gray-500 mb-1" > Member Since < /p> <
                div className = "flex items-center" >
                <
                FaCalendarAlt className = "text-gray-400 mr-2" / >
                <
                p className = "font-medium" > {
                    profile ? .createdAt ?
                    new Date(profile.createdAt).toLocaleDateString(
                        "en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }
                    ) :
                    "Unknown"
                } <
                /p> < /
                div > <
                /div> < /
                div > <
                /div> < /
                div >
            ) : ( <
                form onSubmit = { handleSubmit } >
                <
                h3 className = "text-lg font-semibold mb-4" > Edit Profile < /h3>

                <
                div className = "grid grid-cols-1 md:grid-cols-2 gap-6" >
                <
                div >
                <
                label htmlFor = "name"
                className = "block text-sm font-medium text-gray-700 mb-1" >
                Full Name <
                /label> <
                input type = "text"
                id = "name"
                name = "name"
                value = { formData.name }
                onChange = { handleChange }
                className = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required /
                >
                <
                /div>

                <
                div >
                <
                label htmlFor = "email"
                className = "block text-sm font-medium text-gray-700 mb-1" >
                Email <
                /label> <
                input type = "email"
                id = "email"
                name = "email"
                value = { formData.email }
                onChange = { handleChange }
                className = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required readOnly disabled /
                >
                <
                p className = "text-xs text-gray-500 mt-1" >
                Email cannot be changed <
                /p> < /
                div >

                <
                div >
                <
                label htmlFor = "class"
                className = "block text-sm font-medium text-gray-700 mb-1" >
                Class / Department <
                /label> <
                input type = "text"
                id = "class"
                name = "class"
                value = { formData.class }
                onChange = { handleChange }
                className = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" /
                >
                <
                /div>

                <
                div >
                <
                label htmlFor = "phone"
                className = "block text-sm font-medium text-gray-700 mb-1" >
                Phone <
                /label> <
                input type = "tel"
                id = "phone"
                name = "phone"
                value = { formData.phone }
                onChange = { handleChange }
                className = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" /
                >
                <
                /div> < /
                div >

                <
                div className = "mt-6 flex justify-end space-x-4" >
                <
                button type = "button"
                onClick = {
                    () => setIsEditing(false)
                }
                className = "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" >
                Cancel <
                /button> <
                button type = "submit"
                className = "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" >
                Save Changes <
                /button> < /
                div > <
                /form>
            )
        }

        { /* Password change section */ } <
        div className = "mt-8 border-t border-gray-200 pt-6" >
        <
        h3 className = "text-lg font-semibold mb-4" > Security < /h3>

        <
        Link href = "/reset-password"
        className = "inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700" >
        Change Password <
        /Link> < /
        div > <
        /div> < /
        div > <
        /div> < /
        div >
    );
}

export default withAuth(ProfilePage);