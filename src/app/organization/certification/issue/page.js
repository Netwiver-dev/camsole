"use client";

import { useState, useEffect } from "react";
import { withAuth } from '@/contexts/AuthContext';
import {
    FaSearch,
    FaChalkboardTeacher,
    FaUserGraduate,
    FaArrowLeft,
    FaCheck,
} from "react-icons/fa";
import Link from "next/link";

function IssueCertificatePage() {
    const [students, setStudents] = useState([]);
    const [exams, setExams] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState(1);
    const [success, setSuccess] = useState(false);

    const [selectedExamId, setSelectedExamId] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [selectedResultId, setSelectedResultId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Load exams on component mount
    useEffect(() => {
        fetchExams();
    }, []);

    // Fetch results when exam is selected
    useEffect(() => {
        if (selectedExamId) {
            fetchStudents();
        }
    }, [selectedExamId]);

    // Fetch students' results when student is selected
    useEffect(() => {
        if (selectedExamId && selectedStudentId) {
            fetchResults();
        }
    }, [selectedExamId, selectedStudentId]);

    const fetchExams = async() => {
        try {
            setLoading(true);

            const response = await fetch("/api/exams/teacher");

            if (!response.ok) {
                throw new Error("Failed to fetch exams");
            }

            const data = await response.json();
            setExams(data);
        } catch (err) {
            console.error("Error fetching exams:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async() => {
        try {
            setLoading(true);

            const response = await fetch(`/api/exams/${selectedExamId}/students`);

            if (!response.ok) {
                throw new Error("Failed to fetch students");
            }

            const data = await response.json();
            setStudents(data);
        } catch (err) {
            console.error("Error fetching students:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchResults = async() => {
        try {
            setLoading(true);

            const response = await fetch(
                `/api/exams/${selectedExamId}/results?studentId=${selectedStudentId}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch results");
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            console.error("Error fetching results:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleIssueCertificate = async() => {
        if (!selectedResultId) {
            alert("Please select a result first");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("/api/certificates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    resultId: selectedResultId,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to issue certificate");
            }

            setSuccess(true);
        } catch (err) {
            console.error("Error issuing certificate:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleNext = () => {
        if (step === 1 && !selectedExamId) {
            alert("Please select an exam");
            return;
        }

        if (step === 2 && !selectedStudentId) {
            alert("Please select a student");
            return;
        }

        if (step < 3) {
            setStep(step + 1);
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

    // Filter students by search query
    const filteredStudents = students.filter(
        (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Find selected exam, student, result
    const selectedExam = exams.find((exam) => exam._id === selectedExamId);
    const selectedStudent = students.find(
        (student) => student._id === selectedStudentId
    );
    const selectedResult = results.find(
        (result) => result._id === selectedResultId
    );

    if (success) {
        return ( <
            div className = "p-6" >
            <
            div className = "bg-white shadow-md rounded-lg p-8 text-center max-w-2xl mx-auto" >
            <
            div className = "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6" >
            <
            FaCheck className = "text-green-600 text-2xl" / >
            <
            /div>

            <
            h2 className = "text-2xl font-bold text-gray-800 mb-2" >
            Certificate Issued Successfully <
            /h2>

            <
            p className = "text-gray-600 mb-6" >
            The certificate has been issued to the student and can now be accessed in their portal. <
            /p>

            <
            div className = "flex justify-center space-x-4" >
            <
            Link href = "/organization/certification"
            className = "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" >
            View All Certificates <
            /Link>

            <
            button onClick = {
                () => {
                    setSelectedExamId("");
                    setSelectedStudentId("");
                    setSelectedResultId("");
                    setStep(1);
                    setSuccess(false);
                }
            }
            className = "px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50" >
            Issue Another Certificate <
            /button> < /
            div > <
            /div> < /
            div >
        );
    }

    return ( <
        div className = "p-6" >
        <
        div className = "mb-6 flex items-center" >
        <
        Link href = "/organization/certification"
        className = "mr-4 text-gray-500 hover:text-gray-700" >
        <
        FaArrowLeft / >
        <
        /Link> <
        div >
        <
        h1 className = "text-2xl md:text-3xl font-bold mb-2" >
        Issue Certificate <
        /h1> <
        p className = "text-gray-600" >
        Create and issue a certificate to a student <
        /p> < /
        div > <
        /div>

        {
            error && ( <
                div className = "bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" >
                <
                p className = "font-bold" > Error < /p> <
                p > { error } < /p> < /
                div >
            )
        }

        { /* Progress Indicator */ } <
        div className = "flex items-center mb-8 max-w-3xl mx-auto" >
        <
        div className = "flex-1 flex flex-col items-center" >
        <
        div className = { `w-10 h-10 rounded-full flex items-center justify-center text-white ${
                            step >= 1 ? "bg-blue-600" : "bg-gray-300"
                        }` } >
        1 <
        /div> <
        span className = "text-sm mt-1" > Select Exam < /span> < /
        div >

        <
        div className = { `flex-1 h-1 ${step >= 2 ? "bg-blue-600" : "bg-gray-300"}` } >
        <
        /div>

        <
        div className = "flex-1 flex flex-col items-center" >
        <
        div className = { `w-10 h-10 rounded-full flex items-center justify-center text-white ${
                            step >= 2 ? "bg-blue-600" : "bg-gray-300"
                        }` } >
        2 <
        /div> <
        span className = "text-sm mt-1" > Select Student < /span> < /
        div >

        <
        div className = { `flex-1 h-1 ${step >= 3 ? "bg-blue-600" : "bg-gray-300"}` } >
        <
        /div>

        <
        div className = "flex-1 flex flex-col items-center" >
        <
        div className = { `w-10 h-10 rounded-full flex items-center justify-center text-white ${
                            step >= 3 ? "bg-blue-600" : "bg-gray-300"
                        }` } >
        3 <
        /div> <
        span className = "text-sm mt-1" > Review & Issue < /span> < /
        div > <
        /div>

        <
        div className = "bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto" > { /* Step 1: Select Exam */ } {
            step === 1 && ( <
                div >
                <
                h2 className = "text-xl font-semibold mb-4" > Select Exam < /h2>

                {
                    loading ? ( <
                        div className = "flex justify-center py-10" >
                        <
                        div className = "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" > < /div> < /
                        div >
                    ) : exams.length > 0 ? ( <
                        div className = "space-y-4" > {
                            exams.map((exam) => ( <
                                div key = { exam._id }
                                className = { `border p-4 rounded-md cursor-pointer hover:bg-blue-50 ${
                                            selectedExamId === exam._id
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200"
                                        }` }
                                onClick = {
                                    () => setSelectedExamId(exam._id)
                                } >
                                <
                                div className = "flex items-start" >
                                <
                                div className = "flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3" >
                                <
                                FaChalkboardTeacher className = "text-blue-600" / >
                                <
                                /div>

                                <
                                div className = "flex-1" >
                                <
                                h3 className = "text-lg font-medium text-gray-900 mb-1" > { exam.title } <
                                /h3> <
                                p className = "text-sm text-gray-500 mb-2" > {
                                    exam.description ?
                                    exam.description.length > 100 ?
                                    exam.description.substring(0, 100) + "..." :
                                    exam.description : "No description"
                                } <
                                /p>

                                <
                                div className = "flex items-center text-xs text-gray-500" >
                                <
                                span className = "mr-3" >
                                Date: { formatDate(exam.date) } <
                                /span> <
                                span > Questions: { exam.questions ? .length || 0 } < /span> < /
                                div > <
                                /div>

                                {
                                    selectedExamId === exam._id && ( <
                                        div className = "ml-3 flex-shrink-0" >
                                        <
                                        FaCheck className = "text-blue-600" / >
                                        <
                                        /div>
                                    )
                                } <
                                /div> < /
                                div >
                            ))
                        } <
                        /div>
                    ) : ( <
                        div className = "text-center py-10" >
                        <
                        p className = "text-gray-500" >
                        No exams found.Please create an exam first. <
                        /p> <
                        Link href = "/organization/examination-setup"
                        className = "mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block" >
                        Create Exam <
                        /Link> < /
                        div >
                    )
                } <
                /div>
            )
        }

        { /* Step 2: Select Student */ } {
            step === 2 && ( <
                div >
                <
                h2 className = "text-xl font-semibold mb-4" > Select Student < /h2>

                <
                div className = "mb-4" >
                <
                div className = "relative" >
                <
                input type = "text"
                placeholder = "Search students by name or email..."
                value = { searchQuery }
                onChange = {
                    (e) => setSearchQuery(e.target.value)
                }
                className = "w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /
                >
                <
                FaSearch className = "absolute left-3 top-3 text-gray-400" / >
                <
                /div> < /
                div >

                {
                    loading ? ( <
                        div className = "flex justify-center py-10" >
                        <
                        div className = "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" > < /div> < /
                        div >
                    ) : filteredStudents.length > 0 ? ( <
                        div className = "space-y-4" > {
                            filteredStudents.map((student) => ( <
                                div key = { student._id }
                                className = { `border p-4 rounded-md cursor-pointer hover:bg-blue-50 ${
                                            selectedStudentId === student._id
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200"
                                        }` }
                                onClick = {
                                    () => setSelectedStudentId(student._id)
                                } >
                                <
                                div className = "flex items-center" >
                                <
                                div className = "flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3" >
                                <
                                FaUserGraduate className = "text-gray-500" / >
                                <
                                /div>

                                <
                                div >
                                <
                                h3 className = "text-lg font-medium text-gray-900" > { student.name } <
                                /h3> <
                                p className = "text-sm text-gray-500" > { student.email } < /p> < /
                                div >

                                {
                                    selectedStudentId === student._id && ( <
                                        div className = "ml-auto" >
                                        <
                                        FaCheck className = "text-blue-600" / >
                                        <
                                        /div>
                                    )
                                } <
                                /div> < /
                                div >
                            ))
                        } <
                        /div>
                    ) : ( <
                        div className = "text-center py-10" >
                        <
                        p className = "text-gray-500" > {
                            searchQuery ?
                            "No students found matching your search." : "No students have taken this exam yet."
                        } <
                        /p> < /
                        div >
                    )
                } <
                /div>
            )
        }

        { /* Step 3: Review and Issue */ } {
            step === 3 && ( <
                    div >
                    <
                    h2 className = "text-xl font-semibold mb-6" >
                    Review & Issue Certificate <
                    /h2>

                    <
                    div className = "border border-gray-200 rounded-md p-4 mb-6" >
                    <
                    h3 className = "text-lg font-medium mb-4" > Exam Details < /h3>

                    <
                    div className = "grid grid-cols-1 md:grid-cols-2 gap-4 mb-2" >
                    <
                    div >
                    <
                    p className = "text-sm text-gray-500" > Title < /p> <
                    p className = "font-medium" > { selectedExam ? .title || "N/A" } < /p> < /
                    div >

                    <
                    div >
                    <
                    p className = "text-sm text-gray-500" > Date < /p> <
                    p className = "font-medium" > { formatDate(selectedExam ? .date) || "N/A" } <
                    /p> < /
                    div > <
                    /div> < /
                    div >

                    <
                    div className = "border border-gray-200 rounded-md p-4 mb-6" >
                    <
                    h3 className = "text-lg font-medium mb-4" > Student Details < /h3>

                    <
                    div className = "grid grid-cols-1 md:grid-cols-2 gap-4 mb-2" >
                    <
                    div >
                    <
                    p className = "text-sm text-gray-500" > Name < /p> <
                    p className = "font-medium" > { selectedStudent ? .name || "N/A" } <
                    /p> < /
                    div >

                    <
                    div >
                    <
                    p className = "text-sm text-gray-500" > Email < /p> <
                    p className = "font-medium" > { selectedStudent ? .email || "N/A" } <
                    /p> < /
                    div > <
                    /div> < /
                    div >

                    <
                    div className = "border border-gray-200 rounded-md p-4 mb-6" >
                    <
                    h3 className = "text-lg font-medium mb-4" > Exam Results < /h3>

                    {
                        loading ? ( <
                                div className = "flex justify-center py-6" >
                                <
                                div className = "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" > < /div> < /
                                div >
                            ) : results.length > 0 ? ( <
                                div className = "space-y-4" > {
                                    results.map((result) => ( <
                                            div key = { result._id }
                                            className = { `border p-4 rounded-md cursor-pointer hover:bg-blue-50 ${
                                                selectedResultId === result._id
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200"
                                            }` }
                                            onClick = {
                                                () => setSelectedResultId(result._id)
                                            } >
                                            <
                                            div className = "flex justify-between items-center" >
                                            <
                                            div >
                                            <
                                            div className = "flex items-center mb-2" >
                                            <
                                            span className = "font-medium mr-2" >
                                            Result from { formatDate(result.createdAt) } <
                                            /span> {
                                            result.certificate && ( <
                                                span className = "bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full" >
                                                Certificate Already Issued <
                                                /span>
                                            )
                                        } <
                                        /div>

                                        <
                                        div className = "grid grid-cols-3 gap-4" >
                                        <
                                        div >
                                        <
                                        p className = "text-xs text-gray-500" > Score < /p> <
                                        p className = "font-medium" > { result.score }
                                        /{" "} { selectedExam ? .questions ? .length || 0 } < /
                                        p > <
                                        /div>

                                        <
                                        div >
                                        <
                                        p className = "text-xs text-gray-500" >
                                        Percentage <
                                        /p> <
                                        p className = { `font-medium ${
                                                                    result.percentage >= 70
                                                                        ? "text-green-600"
                                                                        : result.percentage >= 50
                                                                        ? "text-yellow-600"
                                                                        : "text-red-600"
                                                                }` } > { result.percentage ? .toFixed(1) } %
                                        <
                                        /p> < /
                                        div >

                                        <
                                        div >
                                        <
                                        p className = "text-xs text-gray-500" > Status < /p> <
                                        p className = { `font-medium ${
                                                                    result.passed
                                                                        ? "text-green-600"
                                                                        : "text-red-600"
                                                                }` } > { result.passed ? "Passed" : "Failed" } <
                                        /p> < /
                                        div > <
                                        /div> < /
                                        div >

                                        {
                                            selectedResultId === result._id && ( <
                                                div >
                                                <
                                                FaCheck className = "text-blue-600" / >
                                                <
                                                /div>
                                            )
                                        } <
                                        /div> < /
                                        div >
                                    ))
                            } <
                            /div>
                    ): ( <
                        div className = "text-center py-6" >
                        <
                        p className = "text-gray-500" >
                        No results found
                        for this student. <
                        /p> < /
                        div >
                    )
                } <
                /div>

            <
            div className = "border border-gray-200 rounded-md p-4 mb-6" >
                <
                h3 className = "text-lg font-medium mb-4" >
                Certificate Information <
                /h3>

            <
            div className = "mb-4" >
                <
                p className = "text-sm text-gray-500 mb-1" > Certificate Type < /p> <
            p className = "font-medium" > Course Completion Certificate < /p> < /
            div >

                <
                div className = "mb-4" >
                <
                p className = "text-sm text-gray-500 mb-1" > Issue Date < /p> <
            p className = "font-medium" > { formatDate(new Date()) } < /p> < /
            div >

                <
                div >
                <
                p className = "text-sm text-gray-500 mb-1" > Verification < /p> <
            p className = "font-medium" >
                Certificate will include a unique verification code and QR code <
                /p> < /
            div > <
                /div> < /
            div >
        )
    }

    <
    div className = "mt-8 flex justify-between" >
        <
        button type = "button"
    onClick = { handleBack }
    disabled = { step === 1 }
    className = { `px-4 py-2 ${
                            step === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        } rounded-md` } >
        Back <
        /button>

    {
        step < 3 ? ( <
            button type = "button"
            onClick = { handleNext }
            disabled = { loading }
            className = "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" >
            Next <
            /button>
        ) : ( <
            button type = "button"
            onClick = { handleIssueCertificate }
            disabled = {!selectedResultId || loading }
            className = "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" > { loading ? "Issuing..." : "Issue Certificate" } <
            /button>
        )
    } <
    /div> < /
    div > <
        /div>
);
}

export default withAuth(IssueCertificatePage);