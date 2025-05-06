'use client';

import { useState, useEffect } from 'react';
import { withAuth } from '../../lib/auth-context';
import { FaSearch } from 'react-icons/fa';
import UpcomingExams from './UpcomingExams';
import OngoingExams from './OngoingExams';
import PastQuestions from './PastQuestions';

function ExamDashboard() {
    const [exams, setExams] = useState({
        upcoming: [],
        ongoing: [],
        completed: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async() => {
        try {
            setLoading(true);

            const response = await fetch('/api/exams');

            if (!response.ok) {
                throw new Error('Failed to fetch exams');
            }

            const allExams = await response.json();

            // Categorize exams
            const categorizedExams = {
                upcoming: allExams.filter(exam => exam.status === 'upcoming'),
                ongoing: allExams.filter(exam => exam.status === 'in-progress'),
                completed: allExams.filter(exam => exam.status === 'completed')
            };

            setExams(categorizedExams);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching exams:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredExams = {
        upcoming: exams.upcoming.filter(exam =>
            exam.title ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.description ? .toLowerCase().includes(searchTerm.toLowerCase())
        ),
        ongoing: exams.ongoing.filter(exam =>
            exam.title ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.description ? .toLowerCase().includes(searchTerm.toLowerCase())
        ),
        completed: exams.completed.filter(exam =>
            exam.title ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.description ? .toLowerCase().includes(searchTerm.toLowerCase())
        )
    };

    if (loading) {
        return ( <
            div className = "flex items-center justify-center min-h-screen" >
            <
            div className = "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" > < /div> <
            /div>
        );
    }

    return ( <
        div className = "p-6" >
        <
        div className = "mb-6" >
        <
        h1 className = "text-2xl font-bold mb-2" > Exam Dashboard < /h1> <
        p className = "text-gray-600" > View and manage your examinations < /p> <
        /div>

        {
            error && ( <
                div className = "bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6"
                role = "alert" >
                <
                p className = "font-bold" > Error < /p> <
                p > { error } < /p> <
                /div>
            )
        }

        { /* Search and Tab Controls */ } <
        div className = "mb-6" >
        <
        div className = "flex flex-col md:flex-row md:items-center md:justify-between mb-4" >
        <
        div className = "md:mb-0 mb-4" >
        <
        div className = "relative max-w-xs" >
        <
        input type = "text"
        className = "w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder = "Search exams..."
        value = { searchTerm }
        onChange = {
            (e) => setSearchTerm(e.target.value) }
        /> <
        div className = "absolute inset-y-0 left-0 flex items-center pl-3" >
        <
        FaSearch className = "text-gray-400" / >
        <
        /div> <
        /div> <
        /div> <
        div className = "flex space-x-2" >
        <
        button className = { `px-4 py-2 rounded-lg ${
                activeTab === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }` }
        onClick = {
            () => setActiveTab('upcoming') } >
        Upcoming({ filteredExams.upcoming.length }) <
        /button> <
        button className = { `px-4 py-2 rounded-lg ${
                activeTab === 'ongoing' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }` }
        onClick = {
            () => setActiveTab('ongoing') } >
        Ongoing({ filteredExams.ongoing.length }) <
        /button> <
        button className = { `px-4 py-2 rounded-lg ${
                activeTab === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }` }
        onClick = {
            () => setActiveTab('completed') } >
        Completed({ filteredExams.completed.length }) <
        /button> <
        /div> <
        /div> <
        /div>

        { /* Exam Content */ } <
        div > {
            activeTab === 'upcoming' && ( <
                UpcomingExams exams = { filteredExams.upcoming }
                />
            )
        }

        {
            activeTab === 'ongoing' && ( <
                OngoingExams exams = { filteredExams.ongoing }
                />
            )
        }

        {
            activeTab === 'completed' && ( <
                PastQuestions exams = { filteredExams.completed }
                />
            )
        } <
        /div> <
        /div>
    );
}

export default withAuth(ExamDashboard);