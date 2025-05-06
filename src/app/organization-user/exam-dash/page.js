"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../lib/auth-context";
import { withAuth } from "../../lib/auth-context";
import {
    FaCalendarAlt,
    FaClock,
    FaPlayCircle,
    FaCheckCircle,
    FaHourglass,
    FaExclamationCircle,
    FaSearch,
} from "react-icons/fa";

function formatDuration(duration) {
    if (!duration) return "Not specified";
    return duration;
}

function ExamDashboard() {
    const { user } = useAuth();
    const [exams, setExams] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all"); // 'all', 'upcoming', 'completed'
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async() => {
        try {
            setLoading(true);
            const response = await fetch("/api/exams/student");

            if (!response.ok) {
                throw new Error("Failed to fetch exams");
            }

            const data = await response.json();
            setExams(data);
            applyFilters(data, filter, searchTerm);
        } catch (err) {
            console.error("Error fetching exams:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Apply filters and search
    const applyFilters = (data, currentFilter, search) => {
        let filtered = [...data];

        // Apply status filter
        if (currentFilter === "upcoming") {
            filtered = filtered.filter((exam) => exam.status === "upcoming");
        } else if (currentFilter === "completed") {
            filtered = filtered.filter((exam) => exam.status === "completed");
        } else if (currentFilter === "in-progress") {
            filtered = filtered.filter((exam) => exam.status === "in-progress");
        }

        // Apply search
        if (search.trim()) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(
                (exam) =>
                exam.title.toLowerCase().includes(searchLower) ||
                (exam.description &&
                    exam.description.toLowerCase().includes(searchLower))
            );
        }

        setFilteredExams(filtered);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        applyFilters(exams, newFilter, searchTerm);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        applyFilters(exams, filter, value);
    };

    // Get status badge styling
    const getStatusBadge = (status) => {
        switch (status) {
            case "upcoming":
                return {
                    color: "bg-blue-100 text-blue-800",
                    icon: < FaHourglass className = "mr-1" / > ,
                };
            case "completed":
                return {
                    color: "bg-green-100 text-green-800",
                    icon: < FaCheckCircle className = "mr-1" / > ,
                };
            case "in-progress":
                return {
                    color: "bg-yellow-100 text-yellow-800",
                    icon: < FaPlayCircle className = "mr-1" / > ,
                };
            default:
                return {
                    color: "bg-gray-100 text-gray-800",
                    icon: null,
                };
        }
    };

    // Format date
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

    if (error) {
        return ( <
            div className = "p-4 md:p-6" >
            <
            div className = "bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6"
            role = "alert" >
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
            p className = "font-bold" > Error < /p> <
            p > { error } < /p> < /
            div > <
            /div> < /
            div > <
            /div>
        );
    }

    return ( <
            div className = "p-4 md:p-6" >
            <
            div className = "mb-6" >
            <
            h1 className = "text-2xl md:text-3xl font-bold mb-2" > Exam Dashboard < /h1> <
            p className = "text-gray-600" > View and manage your exams < /p> < /
            div >

            { /* Search and filter */ } <
            div className = "flex flex-col md:flex-row gap-4 mb-6" >
            <
            div className = "relative flex-grow" >
            <
            div className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
            <
            FaSearch className = "text-gray-400" / >
            <
            /div> <
            input type = "text"
            placeholder = "Search exams..."
            value = { searchTerm }
            onChange = { handleSearch }
            className = "pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /
            >
            <
            /div>

            <
            div className = "flex space-x-2" >
            <
            button onClick = {
                () => handleFilterChange("all")
            }
            className = { `px-4 py-2 rounded-md ${
							filter === "all"
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700"
						}` } >
            All <
            /button> <
            button onClick = {
                () => handleFilterChange("upcoming")
            }
            className = { `px-4 py-2 rounded-md ${
							filter === "upcoming"
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700"
						}` } >
            Upcoming <
            /button> <
            button onClick = {
                () => handleFilterChange("in-progress")
            }
            className = { `px-4 py-2 rounded-md ${
							filter === "in-progress"
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700"
						}` } >
            In Progress <
            /button> <
            button onClick = {
                () => handleFilterChange("completed")
            }
            className = { `px-4 py-2 rounded-md ${
							filter === "completed"
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700"
						}` } >
            Completed <
            /button> < /
            div > <
            /div>

            { /* Exams list */ } {
                filteredExams.length === 0 ? ( <
                        div className = "bg-gray-50 rounded-lg p-8 text-center" >
                        <
                        p className = "text-gray-500 text-lg" >
                        No exams found matching your criteria <
                        /p> {
                        filter !== "all" && ( <
                            button onClick = {
                                () => handleFilterChange("all")
                            }
                            className = "mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" >
                            View all exams <
                            /button>
                        )
                    } <
                    /div>
            ): ( <
                div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" > {
                    filteredExams.map((exam) => {
                        const statusBadge = getStatusBadge(exam.status);
                        return ( <
                            div key = { exam._id }
                            className = "bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6" >
                            <
                            div className = "flex justify-between items-start mb-2" >
                            <
                            h2 className = "text-xl font-semibold text-gray-800" > { exam.title } <
                            /h2> <
                            span className = { `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}` } > { statusBadge.icon } {
                                exam.status === "upcoming" ?
                                    "Upcoming" :
                                    exam.status === "in-progress" ?
                                    "In Progress" :
                                    "Completed"
                            } <
                            /span> < /
                            div >

                            <
                            p className = "text-gray-600 text-sm mb-4 line-clamp-2" > { exam.description || "No description available" } <
                            /p>

                            <
                            div className = "space-y-2" >
                            <
                            div className = "flex items-center text-sm text-gray-500" >
                            <
                            FaCalendarAlt className = "mr-2" / >
                            <
                            span > { formatDate(exam.date) } < /span> < /
                            div >

                            <
                            div className = "flex items-center text-sm text-gray-500" >
                            <
                            FaClock className = "mr-2" / >
                            <
                            span > Duration: { formatDuration(exam.duration) } < /span> < /
                            div >

                            <
                            div className = "flex items-center text-sm text-gray-500" >
                            <
                            span > Questions: { exam.questions ? .length || 0 } < /span> < /
                            div > <
                            /div>

                            <
                            div className = "mt-6" > {
                                exam.status === "upcoming" && ( <
                                    span className = "text-gray-500 text-sm" >
                                    Not yet available <
                                    /span>
                                )
                            }

                            {
                                exam.status === "in-progress" && ( <
                                    Link href = { `/organization-user/exam/take-exam?id=${exam._id}` }
                                    className = "inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" >
                                    <
                                    FaPlayCircle className = "mr-2" / > Resume Exam <
                                    /Link>
                                )
                            }

                            {
                                exam.status === "completed" && ( <
                                    Link href = { `/organization-user/result?id=${exam.result?._id}` }
                                    className = "inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" >
                                    <
                                    FaCheckCircle className = "mr-2" / > View Result <
                                    /Link>
                                )
                            } <
                            /div> < /
                            div >
                        );
                    })
                } <
                /div>
            )
        } <
        /div>
);
}

export default withAuth(ExamDashboard);