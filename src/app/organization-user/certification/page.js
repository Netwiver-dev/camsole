"use client";

import { useState, useEffect } from 'react';
import { withAuth } from '../../lib/auth-context';
import { useAuth } from '../../lib/auth-context';
import { FaDownload, FaExternalLinkAlt, FaSpinner, FaMedal, FaSearch } from 'react-icons/fa';
import Link from 'next/link';

function CertificatePage() {
    const { user } = useAuth();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async() => {
        try {
            setLoading(true);

            const response = await fetch('/api/certificates');

            if (!response.ok) {
                throw new Error('Failed to fetch certificates');
            }

            const data = await response.json();
            setCertificates(data);

        } catch (err) {
            console.error('Error fetching certificates:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadCertificate = async(certificateId) => {
        try {
            const response = await fetch(`/api/certificates/${certificateId}/pdf`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Failed to download certificate');
            }

            // Create a blob from the PDF Stream
            const blob = await response.blob();
            // Create a link element, use it to download the blob, and then remove it
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `certificate-${certificateId}.pdf`;
            link.click();
        } catch (err) {
            console.error('Error downloading certificate:', err);
            alert('Failed to download certificate.');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Filter certificates based on search query
    const filteredCertificates = certificates.filter(cert =>
        cert.exam ? .title.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        div className = "mb-6" >
        <
        h1 className = "text-2xl md:text-3xl font-bold mb-2" > My Certificates < /h1> <
        p className = "text-gray-600" > View and download your earned certificates < /p> < /
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

        { /* Search and filter */ } <
        div className = "mb-6" >
        <
        div className = "relative" >
        <
        div className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
        <
        FaSearch className = "text-gray-400" / >
        <
        /div> <
        input type = "text"
        className = "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder = "Search certificates by exam title..."
        value = { searchQuery }
        onChange = {
            (e) => setSearchQuery(e.target.value)
        }
        /> < /
        div > <
        /div>

        {
            certificates.length === 0 ? ( <
                div className = "bg-white rounded-lg shadow p-6 text-center" >
                <
                div className = "mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4" >
                <
                FaMedal className = "text-blue-600 text-2xl" / >
                <
                /div> <
                h3 className = "text-lg font-medium text-gray-900" > No Certificates Yet < /h3> <
                p className = "mt-2 text-gray-500" >
                Complete exams with passing grades to earn certificates. <
                /p> <
                div className = "mt-6" >
                <
                Link href = "/organization-user/exam-dash"
                className = "text-blue-600 hover:text-blue-800 font-medium" >
                Browse Available Exams <
                /Link> < /
                div > <
                /div>
            ) : ( <
                div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" > {
                    filteredCertificates.map((certificate) => ( <
                        div key = { certificate._id }
                        className = "bg-white rounded-lg shadow overflow-hidden" >
                        <
                        div className = "p-1 bg-gradient-to-r from-blue-500 to-purple-600" > < /div> <
                        div className = "p-6" >
                        <
                        div className = "flex justify-between items-start" >
                        <
                        h3 className = "text-lg font-medium text-gray-900" > { certificate.exam ? .title } < /h3> <
                        span className = "bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded" > { certificate.exam ? .category || 'Certificate' } <
                        /span> < /
                        div >

                        <
                        div className = "mt-4 space-y-2" >
                        <
                        div >
                        <
                        p className = "text-sm text-gray-500" > Issue Date < /p> <
                        p className = "font-medium" > { formatDate(certificate.issueDate) } < /p> < /
                        div >

                        <
                        div >
                        <
                        p className = "text-sm text-gray-500" > Certificate ID < /p> <
                        p className = "font-medium font-mono text-sm" > { certificate.certificateId } < /p> < /
                        div >

                        <
                        div >
                        <
                        p className = "text-sm text-gray-500" > Score < /p> <
                        p className = "font-medium" > { certificate.result ? .percentage ? .toFixed(1) } % < /p> < /
                        div > <
                        /div>

                        <
                        div className = "mt-6 flex space-x-3" >
                        <
                        button onClick = {
                            () => downloadCertificate(certificate.certificateId)
                        }
                        className = "flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700" >
                        <
                        FaDownload className = "mr-2" / > Download <
                        /button>

                        <
                        Link href = { `/verify-certificate?id=${certificate.certificateId}` }
                        target = "_blank"
                        className = "inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" >
                        <
                        FaExternalLinkAlt className = "mr-2" / > Verify <
                        /Link> < /
                        div > <
                        /div> < /
                        div >
                    ))
                } <
                /div>
            )
        }

        <
        div className = "mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6" >
        <
        h3 className = "text-lg font-medium text-gray-900 mb-4" > Verify a Certificate < /h3> <
        p className = "text-gray-600 mb-4" >
        Anyone can verify the authenticity of a Camsole certificate using the verification tool. <
        /p> <
        Link href = "/verify-certificate"
        target = "_blank"
        className = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700" >
        <
        FaExternalLinkAlt className = "mr-2" / > Go to Certificate Verification <
        /Link> < /
        div > <
        /div>
    );
}

export default withAuth(CertificatePage);