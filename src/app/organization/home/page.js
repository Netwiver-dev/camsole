"use client";

import { useState, useEffect } from "react";
import { withAuth } from "@/contexts/AuthContext";
import {
    FaUserGraduate,
    FaClipboardCheck,
    FaChalkboardTeacher,
    FaAward,
} from "react-icons/fa";
import Link from "next/link";
import DashboardCards from "./DashboardCards";
import OrganisationPerformance from "./OrganisationPerformance";
import StudiesResources from "./StudiesResources";
import StarStudentsTable from "./StarStudentsTable";

function TeacherDashboard() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalExams: 0,
        examsCompleted: 0,
        certificatesIssued: 0,
        recentExams: [],
        recentResults: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async() => {
        try {
            setLoading(true);

            // Fetch dashboard data from the API
            const response = await fetch("/api/exams/teacher/dashboard");

            if (!response.ok) {
                throw new Error("Failed to fetch dashboard data");
            }

            const data = await response.json();
            setStats(data);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading) {
        return ( <
            div className = "flex items-center justify-center min-h-screen" >
            <
            div className = "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" > { " " } <
            /div>{" "} <
            /div>
        );
    }

    return ( <
        div className = "grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-gray-100" > { " " } {
            error && ( <
                div className = "col-span-full bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" >
                <
                p className = "font-bold" > Error < /p> <p> {error} </p > { " " } <
                /div>
            )
        } { /* Stats Overview */ } { " " } <
        div className = "col-span-full" >
        <
        div className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" > { " " } { /* Total Students */ } { " " } <
        div className = "bg-white rounded-lg shadow p-6" >
        <
        div className = "flex justify-between items-center" >
        <
        div >
        <
        p className = "text-sm text-gray-500" > Total Students < /p>{" "} <
        p className = "text-2xl font-bold" > { stats.totalStudents } < /p>{" "} <
        /div>{" "} <
        div className = "bg-blue-100 rounded-full p-3" >
        <
        FaUserGraduate className = "text-blue-600 text-xl" / >
        <
        /div>{" "} <
        /div>{" "} <
        /div> { /* Total Exams */ } { " " } <
        div className = "bg-white rounded-lg shadow p-6" >
        <
        div className = "flex justify-between items-center" >
        <
        div >
        <
        p className = "text-sm text-gray-500" > Total Exams < /p>{" "} <
        p className = "text-2xl font-bold" > { stats.totalExams } < /p>{" "} <
        /div>{" "} <
        div className = "bg-green-100 rounded-full p-3" >
        <
        FaChalkboardTeacher className = "text-green-600 text-xl" / >
        <
        /div>{" "} <
        /div>{" "} <
        /div> { /* Exams Completed */ } { " " } <
        div className = "bg-white rounded-lg shadow p-6" >
        <
        div className = "flex justify-between items-center" >
        <
        div >
        <
        p className = "text-sm text-gray-500" > Exams Completed < /p>{" "} <
        p className = "text-2xl font-bold" > { stats.examsCompleted } < /p>{" "} <
        /div>{" "} <
        div className = "bg-yellow-100 rounded-full p-3" >
        <
        FaClipboardCheck className = "text-yellow-600 text-xl" / >
        <
        /div>{" "} <
        /div>{" "} <
        /div> { /* Certificates Issued */ } { " " } <
        div className = "bg-white rounded-lg shadow p-6" >
        <
        div className = "flex justify-between items-center" >
        <
        div >
        <
        p className = "text-sm text-gray-500" > Certificates < /p>{" "} <
        p className = "text-2xl font-bold" > { " " } { stats.certificatesIssued } { " " } <
        /p>{" "} <
        /div>{" "} <
        div className = "bg-purple-100 rounded-full p-3" >
        <
        FaAward className = "text-purple-600 text-xl" / >
        <
        /div>{" "} <
        /div>{" "} <
        /div>{" "} <
        /div>{" "} <
        /div> { /* Left Column */ } { " " } <
        div className = "lg:col-span-2 space-y-6" >
        <
        DashboardCards / >
        <
        OrganisationPerformance / >
        <
        StarStudentsTable / >
        <
        /div> { /* Right Column */ } { " " } <
        div className = "space-y-6" >
        <
        StudiesResources / >
        <
        /div>{" "} <
        /div>
    );
}

export default withAuth(TeacherDashboard);