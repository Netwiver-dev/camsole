"use client";

import { useState, useEffect } from "react";
import { useAuth, withAuth } from "@/contexts/AuthContext";
import {
    FaCalendarAlt,
    FaCheckCircle,
    FaGraduationCap,
    FaClock,
} from "react-icons/fa";
import Link from "next/link";

function StudentDashboard() {
    const { user } = useAuth();
    const [upcomingExams, setUpcomingExams] = useState([]);
    const [recentResults, setRecentResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalExams: 0,
        examsTaken: 0,
        averageScore: 0,
        highestScore: 0,
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async() => {
        try {
            setLoading(true);

            // Fetch exams
            const examsResponse = await fetch("/api/exams/student");
            const exams = await examsResponse.json();

            if (!Array.isArray(exams)) {
                throw new Error("Failed to fetch exams");
            }

            // Upcoming exams
            const upcoming = exams
                .filter((exam) => exam.status === "upcoming")
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 3);

            setUpcomingExams(upcoming);

            // Recent results
            const completed = exams
                .filter((exam) => exam.status === "completed" && exam.result)
                .sort(
                    (a, b) =>
                    new Date(b.result.endTime || b.date) -
                    new Date(a.result.endTime || a.date)
                )
                .slice(0, 5);

            setRecentResults(completed);

            // Calculate stats
            const totalExams = exams.length;
            const examsTaken = exams.filter(
                (exam) => exam.status === "completed"
            ).length;

            let totalScore = 0;
            let highestScore = 0;

            completed.forEach((exam) => {
                totalScore += exam.result.percentage;
                if (exam.result.percentage > highestScore) {
                    highestScore = exam.result.percentage;
                }
            });

            const averageScore =
                examsTaken > 0 ? (totalScore / examsTaken).toFixed(1) : 0;

            setStats({
                totalExams,
                examsTaken,
                averageScore,
                highestScore: highestScore.toFixed(1),
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
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
        div className = "p-4 md:p-6" > {
            error && ( <
                div className = "bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6"
                role = "alert" >
                <
                p className = "font-bold" > Error < /p> <
                p > { error } < /p> < /
                div >
            )
        }

        <
        div className = "mb-6" >
        <
        h1 className = "text-2xl md:text-3xl font-bold mb-2" >
        Welcome, { user ? .name || "Student" } <
        /h1> <
        p className = "text-gray-600" >
        Here 's an overview of your academic progress < /
        p > <
        /div>

        { /* Stats Cards */ } <
        div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" >
        <
        div className = "bg-white rounded-lg shadow p-6" >
        <
        div className = "flex justify-between items-center" >
        <
        div >
        <
        p className = "text-sm text-gray-500" > Total Exams < /p> <
        p className = "text-2xl font-bold" > { stats.totalExams } < /p> < /
        div > <
        div className = "bg-blue-100 rounded-full p-3" >
        <
        FaGraduationCap className = "text-blue-600 text-xl" / >
        <
        /div> < /
        div > <
        /div>

        <
        div className = "bg-white rounded-lg shadow p-6" >
        <
        div className = "flex justify-between items-center" >
        <
        div >
        <
        p className = "text-sm text-gray-500" > Exams Taken < /p> <
        p className = "text-2xl font-bold" > { stats.examsTaken } < /p> < /
        div > <
        div className = "bg-green-100 rounded-full p-3" >
        <
        FaCheckCircle className = "text-green-600 text-xl" / >
        <
        /div> < /
        div > <
        /div>

        <
        div className = "bg-white rounded-lg shadow p-6" >
        <
        div className = "flex justify-between items-center" >
        <
        div >
        <
        p className = "text-sm text-gray-500" > Average Score < /p> <
        p className = "text-2xl font-bold" > { stats.averageScore } % < /p> < /
        div > <
        div className = "bg-yellow-100 rounded-full p-3" >
        <
        FaGraduationCap className = "text-yellow-600 text-xl" / >
        <
        /div> < /
        div > <
        /div>

        <
        div className = "bg-white rounded-lg shadow p-6" >
        <
        div className = "flex justify-between items-center" >
        <
        div >
        <
        p className = "text-sm text-gray-500" > Highest Score < /p> <
        p className = "text-2xl font-bold" > { stats.highestScore } % < /p> < /
        div > <
        div className = "bg-purple-100 rounded-full p-3" >
        <
        FaGraduationCap className = "text-purple-600 text-xl" / >
        <
        /div> < /
        div > <
        /div> < /
        div >

        <
        div className = "grid grid-cols-1 lg:grid-cols-3 gap-6" > { /* Upcoming Exams */ } <
        div className = "lg:col-span-2" >
        <
        div className = "bg-white rounded-lg shadow" >
        <
        div className = "p-6 border-b border-gray-200" >
        <
        h2 className = "text-lg font-semibold" > Upcoming Exams < /h2> < /
        div > <
        div className = "p-6" > {
            upcomingExams.length === 0 ? ( <
                div className = "text-center py-6" >
                <
                p className = "text-gray-500" > No upcoming exams scheduled < /p> < /
                div >
            ) : ( <
                div className = "space-y-6" > {
                    upcomingExams.map((exam) => ( <
                        div key = { exam._id }
                        className = "flex items-start" >
                        <
                        div className = "bg-blue-100 rounded-lg p-3 text-blue-600 mr-4" >
                        <
                        FaCalendarAlt className = "text-xl" / >
                        <
                        /div> <
                        div >
                        <
                        h3 className = "font-medium" > { exam.title } < /h3> <
                        p className = "text-sm text-gray-500 mt-1" > { formatDate(exam.date) } <
                        /p> <
                        p className = "text-sm text-gray-500 flex items-center mt-1" >
                        <
                        FaClock className = "mr-1" / > Duration: { exam.duration } <
                        /p> < /
                        div > <
                        /div>
                    ))
                } <
                /div>
            )
        }

        <
        div className = "mt-6" >
        <
        Link href = "/organization-user/exam-dash"
        className = "text-blue-600 hover:text-blue-800 font-medium" >
        View All Exams <
        /Link> < /
        div > <
        /div> < /
        div > <
        /div>

        { /* Recent Results */ } <
        div className = "lg:col-span-1" >
        <
        div className = "bg-white rounded-lg shadow h-full" >
        <
        div className = "p-6 border-b border-gray-200" >
        <
        h2 className = "text-lg font-semibold" > Recent Results < /h2> < /
        div > <
        div className = "p-6" > {
            recentResults.length === 0 ? ( <
                div className = "text-center py-6" >
                <
                p className = "text-gray-500" > No exam results yet < /p> < /
                div >
            ) : ( <
                div className = "space-y-4" > {
                    recentResults.map((exam) => ( <
                        Link key = { exam._id }
                        href = { `/organization-user/result?id=${exam.result._id}` }
                        className = "block p-3 border border-gray-200 rounded-lg hover:bg-gray-50" >
                        <
                        div className = "flex justify-between items-center" >
                        <
                        h3 className = "font-medium" > { exam.title } < /h3> <
                        span className = { `text-sm font-medium px-2 py-1 rounded-full ${
                                                        exam.result.percentage >= 70
                                                            ? "bg-green-100 text-green-800"
                                                            : exam.result.percentage >= 50
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }` } > { exam.result.percentage } %
                        <
                        /span> < /
                        div > <
                        p className = "text-sm text-gray-500 mt-1" > { formatDate(exam.date) } <
                        /p> < /
                        Link >
                    ))
                } <
                /div>
            )
        }

        {
            recentResults.length > 0 && ( <
                div className = "mt-6" >
                <
                Link href = "/organization-user/exam-dash"
                className = "text-blue-600 hover:text-blue-800 font-medium" >
                View All Results <
                /Link> < /
                div >
            )
        } <
        /div> < /
        div > <
        /div> < /
        div > <
        /div>
    );
}

export default withAuth(StudentDashboard);