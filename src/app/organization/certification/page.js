"use client";

import { useState, useEffect } from 'react';
import { withAuth } from '@/contexts/AuthContext';
import { FaSearch, FaFilePdf, FaUserGraduate, FaDownload, FaEye } from 'react-icons/fa';
import Link from 'next/link';

function CertificationPage() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async() => {
        try {
            setLoading(true);

            const response = await fetch('/api/certificates/teacher');

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

    const handleDownloadCertificate = async(certificateId) => {
        try {
            const response = await fetch(`/api/certificates/${certificateId}/pdf`);

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

    const handleViewCertificate = (certificateId) => {
        window.open(`/verify-certificate?id=${certificateId}`, '_blank');
    };

    // Filter certificates by student name or exam title
    const filteredCertificates = certificates.filter(cert =>
        cert.student ? .name ? .toLowerCase().includes(filter.toLowerCase()) ||
        cert.exam ? .title ? .toLowerCase().includes(filter.toLowerCase()) ||
        cert.certificateId ? .toLowerCase().includes(filter.toLowerCase())
    );

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return ( <
        div className = "p-6" >
        <
        div className = "mb-6" >
        <
        h1 className = "text-2xl md:text-3xl font-bold mb-2" > Certificate Management < /h1> <
        p className = "text-gray-600" > View and manage issued certificates < /p> < /
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

        { /* Search and Filter */ } <
        div className = "bg-white shadow-md rounded-lg p-4 mb-6" >
        <
        div className = "flex flex-col md:flex-row md:items-center gap-4" >
        <
        div className = "md:flex-1" >
        <
        div className = "relative" >
        <
        input type = "text"
        placeholder = "Search by student name, exam title or certificate ID..."
        value = { filter }
        onChange = {
            (e) => setFilter(e.target.value)
        }
        className = "w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /
        >
        <
        FaSearch className = "absolute left-3 top-3 text-gray-400" / >
        <
        /div> < /
        div >

        <
        div className = "md:w-auto" >
        <
        Link href = "/organization/certification/issue"
        className = "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block" >
        Issue New Certificate <
        /Link> < /
        div > <
        /div> < /
        div >

        {
            loading ? ( <
                div className = "flex justify-center py-10" >
                <
                div className = "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" > < /div> < /
                div >
            ) : filteredCertificates.length > 0 ? ( <
                div className = "bg-white shadow-md rounded-lg overflow-x-auto" >
                <
                table className = "min-w-full divide-y divide-gray-200" >
                <
                thead className = "bg-gray-50" >
                <
                tr >
                <
                th className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                Certificate ID <
                /th> <
                th className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                Student <
                /th> <
                th className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                Exam <
                /th> <
                th className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                Issue Date <
                /th> <
                th className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                Status <
                /th> <
                th className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                Actions <
                /th> < /
                tr > <
                /thead> <
                tbody className = "bg-white divide-y divide-gray-200" > {
                    filteredCertificates.map((certificate) => ( <
                        tr key = { certificate._id }
                        className = "hover:bg-gray-50" >
                        <
                        td className = "px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600" > { certificate.certificateId.slice(0, 10) }... <
                        /td> <
                        td className = "px-6 py-4 whitespace-nowrap" >
                        <
                        div className = "flex items-center" >
                        <
                        div className = "flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center" >
                        <
                        FaUserGraduate className = "text-gray-500" / >
                        <
                        /div> <
                        div className = "ml-4" >
                        <
                        div className = "text-sm font-medium text-gray-900" > { certificate.student ? .name || 'Unknown' } <
                        /div> <
                        div className = "text-sm text-gray-500" > { certificate.student ? .email || 'No email' } <
                        /div> < /
                        div > <
                        /div> < /
                        td > <
                        td className = "px-6 py-4 whitespace-nowrap" >
                        <
                        div className = "text-sm text-gray-900" > { certificate.exam ? .title || 'Unknown Exam' } <
                        /div> <
                        div className = "text-sm text-gray-500" >
                        Score: { certificate.result ? .percentage ? .toFixed(1) || 0 } %
                        <
                        /div> < /
                        td > <
                        td className = "px-6 py-4 whitespace-nowrap text-sm text-gray-500" > { formatDate(certificate.createdAt) } <
                        /td> <
                        td className = "px-6 py-4 whitespace-nowrap" >
                        <
                        span className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800" >
                        Active <
                        /span> < /
                        td > <
                        td className = "px-6 py-4 whitespace-nowrap text-sm font-medium" >
                        <
                        div className = "flex space-x-2" >
                        <
                        button onClick = {
                            () => handleDownloadCertificate(certificate._id)
                        }
                        className = "text-blue-600 hover:text-blue-900 flex items-center" >
                        <
                        FaDownload className = "mr-1" / > Download <
                        /button> <
                        button onClick = {
                            () => handleViewCertificate(certificate._id)
                        }
                        className = "text-green-600 hover:text-green-900 flex items-center" >
                        <
                        FaEye className = "mr-1" / > View <
                        /button> < /
                        div > <
                        /td> < /
                        tr >
                    ))
                } <
                /tbody> < /
                table > <
                /div>
            ) : ( <
                div className = "bg-white shadow-md rounded-lg p-8 text-center" >
                <
                div className = "mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center" >
                <
                FaFilePdf className = "text-gray-400 text-2xl" / >
                <
                /div> <
                h3 className = "text-lg font-medium text-gray-900 mb-1" > No certificates found < /h3> <
                p className = "text-gray-500" > { filter ? 'Try adjusting your search criteria' : 'No certificates have been issued yet' } <
                /p> <
                Link href = "/organization/certification/issue"
                className = "mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block" >
                Issue New Certificate <
                /Link> < /
                div >
            )
        } <
        /div>
    );
}

export default withAuth(CertificationPage);