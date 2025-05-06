"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    FaCheckCircle,
    FaTimesCircle,
    FaSpinner,
    FaSearch,
    FaDownload,
} from "react-icons/fa";

export default function VerifyCertificateClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const certificateId = searchParams.get("id");

    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [verified, setVerified] = useState(false);
    const [manualId, setManualId] = useState("");

    useEffect(() => {
        if (certificateId) {
            verifyCertificate(certificateId);
        }
    }, [certificateId]);

    const verifyCertificate = async(id) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/certificates/${id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to verify certificate");
            }

            setCertificate(data);
            setVerified(data.verified);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setVerified(false);
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!manualId.trim()) return;

        // Remove any whitespace
        const id = manualId.trim();

        router.push(`/verify-certificate?id=${id}`);
    };

    const downloadCertificate = async() => {
        if (!certificateId) return;

        try {
            const response = await fetch(`/api/certificates/${certificateId}/pdf`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to download certificate");
            }

            // Create a blob from the PDF Stream
            const blob = await response.blob();
            // Create a link element, use it to download the blob, and then remove it
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `certificate-${certificateId}.pdf`;
            link.click();
        } catch (err) {
            console.error("Error downloading certificate:", err);
            alert("Failed to download certificate.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return ( <
        div className = "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" >
        <
        div className = "max-w-3xl mx-auto" >
        <
        div className = "text-center mb-8" >
        <
        h1 className = "text-3xl font-bold text-gray-900" >
        Certificate Verification <
        /h1> <
        p className = "mt-2 text-sm text-gray-600" >
        Verify the authenticity of a Camsole Examination System certificate <
        /p> < /
        div >

        <
        div className = "bg-white rounded-lg shadow-md p-6 mb-8" >
        <
        form onSubmit = { handleSubmit }
        className = "mb-6" >
        <
        div className = "flex" >
        <
        div className = "relative flex-grow" >
        <
        div className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
        <
        FaSearch className = "h-5 w-5 text-gray-400" / >
        <
        /div> <
        input type = "text"
        value = { manualId }
        onChange = {
            (e) => setManualId(e.target.value)
        }
        placeholder = "Enter certificate ID"
        className = "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /
        >
        <
        /div> <
        button type = "submit"
        className = "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
        Verify <
        /button> < /
        div > <
        /form>

        {
            loading && ( <
                div className = "text-center py-12" >
                <
                FaSpinner className = "animate-spin text-indigo-600 h-8 w-8 mx-auto" / >
                <
                p className = "mt-2 text-gray-500" > Verifying certificate... < /p> < /
                div >
            )
        }

        {
            !loading && error && ( <
                div className = "bg-red-50 border-l-4 border-red-400 p-4" >
                <
                div className = "flex items-center" >
                <
                FaTimesCircle className = "text-red-500 h-6 w-6 mr-3" / >
                <
                div >
                <
                p className = "text-red-800 font-medium" >
                Verification failed <
                /p> <
                p className = "text-red-700 text-sm" > { error } < /p> < /
                div > <
                /div> < /
                div >
            )
        }

        {
            !loading && certificate && ( <
                div >
                <
                div className = { `border-l-4 p-4 mb-6 ${verified
                                    ? "bg-green-50 border-green-400"
                                    : "bg-red-50 border-red-400"
                                }` } >
                <
                div className = "flex items-center" > {
                    verified ? ( <
                        FaCheckCircle className = "text-green-500 h-6 w-6 mr-3" / >
                    ) : ( <
                        FaTimesCircle className = "text-red-500 h-6 w-6 mr-3" / >
                    )
                } <
                div >
                <
                p className = { `font-medium ${verified ? "text-green-800" : "text-red-800"
                                            }` } > { verified ? "Valid Certificate" : "Invalid Certificate" } <
                /p> <
                p className = { `text-sm ${verified ? "text-green-700" : "text-red-700"
                                            }` } >
                Certificate ID: { certificateId } <
                /p> < /
                div > <
                /div> < /
                div >

                {
                    verified && ( <
                        div >
                        <
                        div className = "border-t border-gray-200 py-6" >
                        <
                        h2 className = "text-lg font-medium text-gray-900 mb-4" >
                        Certificate Information <
                        /h2>

                        <
                        div className = "grid grid-cols-1 md:grid-cols-2 gap-4" >
                        <
                        div >
                        <
                        p className = "text-sm text-gray-500" > Student Name < /p> <
                        p className = "font-medium" > { certificate.user ? .name } < /p> < /
                        div >

                        <
                        div >
                        <
                        p className = "text-sm text-gray-500" > Class < /p> <
                        p className = "font-medium" > { certificate.user ? .class } < /p> < /
                        div >

                        <
                        div >
                        <
                        p className = "text-sm text-gray-500" > Issue Date < /p> <
                        p className = "font-medium" > { formatDate(certificate.certificate.issueDate) } < /p> < /
                        div >

                        {
                            certificate.certificate.expiryDate && ( <
                                div >
                                <
                                p className = "text-sm text-gray-500" > Expiry Date < /p> <
                                p className = "font-medium" > { formatDate(certificate.certificate.expiryDate) } < /p> < /
                                div >
                            )
                        } <
                        /div> < /
                        div >

                        <
                        div className = "border-t border-gray-200 py-6" >
                        <
                        h2 className = "text-lg font-medium text-gray-900 mb-4" >
                        Exam Information <
                        /h2>

                        <
                        div className = "grid grid-cols-1 md:grid-cols-2 gap-4" >
                        <
                        div >
                        <
                        p className = "text-sm text-gray-500" > Exam Title < /p> <
                        p className = "font-medium" > { certificate.exam ? .title } < /p> < /
                        div >

                        <
                        div >
                        <
                        p className = "text-sm text-gray-500" > Exam Date < /p> <
                        p className = "font-medium" > { formatDate(certificate.exam ? .date) } < /p> < /
                        div >

                        <
                        div >
                        <
                        p className = "text-sm text-gray-500" > Score < /p> <
                        p className = "font-medium" > { certificate.result ? .score } < /p> < /
                        div >

                        <
                        div >
                        <
                        p className = "text-sm text-gray-500" > Percentage < /p> <
                        p className = "font-medium" > { certificate.result ? .percentage } % < /p> < /
                        div >

                        <
                        div >
                        <
                        p className = "text-sm text-gray-500" > Completion Date < /p> <
                        p className = "font-medium" > { formatDate(certificate.result ? .completedDate) } < /p> < /
                        div > <
                        /div> < /
                        div >

                        <
                        div className = "mt-6" >
                        <
                        button onClick = { downloadCertificate }
                        className = "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
                        <
                        FaDownload className = "mr-2" / > Download Certificate <
                        /button> < /
                        div > <
                        /div>
                    )
                } <
                /div>
            )
        } <
        /div>

        <
        div className = "text-center text-sm text-gray-500" >
        <
        p >
        Camsole Examination System & copy; { new Date().getFullYear() }.All rights reserved. <
        /p> < /
        div > <
        /div> < /
        div >
    );
}