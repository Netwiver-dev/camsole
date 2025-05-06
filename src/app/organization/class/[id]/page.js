'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaUserPlus, FaTimes, FaEnvelope, FaSearch, FaSort, FaSortUp, FaSortDown, FaExclamationCircle } from 'react-icons/fa';

export default function ClassDetailPage() {
    const params = useParams();
    const router = useRouter();
    const classId = params.id;

    const [classData, setClassData] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    const [newStudentEmail, setNewStudentEmail] = useState('');
    const [addStudentError, setAddStudentError] = useState('');
    const [addingStudent, setAddingStudent] = useState(false);

    useEffect(() => {
        if (classId) {
            fetchClassData();
        }
    }, [classId]);

    useEffect(() => {
        if (students.length) {
            const filtered = students.filter(student =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase())
            );

            // Apply sorting
            const sorted = [...filtered].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });

            setFilteredStudents(sorted);
        }
    }, [searchTerm, students, sortConfig]);

    const fetchClassData = async() => {
        try {
            setLoading(true);

            // Fetch class details
            const classResponse = await fetch(`/api/classes?id=${classId}`);

            if (!classResponse.ok) {
                throw new Error('Failed to fetch class details');
            }

            const classData = await classResponse.json();
            setClassData(classData);

            // Fetch students in this class
            const studentsResponse = await fetch(`/api/users?class=${classData.name}&role=student`);

            if (!studentsResponse.ok) {
                throw new Error('Failed to fetch students');
            }

            const studentsData = await studentsResponse.json();
            setStudents(studentsData);
            setFilteredStudents(studentsData);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching class data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <FaSort className = "ml-1 text-gray-400" / > ;
        return sortConfig.direction === 'ascending' ?
            <
            FaSortUp className = "ml-1 text-blue-600" / > :
            <
            FaSortDown className = "ml-1 text-blue-600" / > ;
    };

    const handleAddStudent = async(e) => {
        e.preventDefault();
        setAddStudentError('');
        setAddingStudent(true);

        try {
            if (!newStudentEmail.trim()) {
                throw new Error('Please enter an email address');
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newStudentEmail)) {
                throw new Error('Please enter a valid email address');
            }

            // Add student to class (or invite if not registered)
            const response = await fetch('/api/users/invite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: newStudentEmail,
                    class: classData.name,
                    role: 'student'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add student');
            }

            // Refresh student list
            fetchClassData();
            setNewStudentEmail('');
            setShowAddModal(false);

        } catch (err) {
            setAddStudentError(err.message);
        } finally {
            setAddingStudent(false);
        }
    };

    const handleRemoveStudent = async(studentId) => {
        if (!confirm('Are you sure you want to remove this student from the class?')) {
            return;
        }

        try {
            const response = await fetch(`/api/users/class-assignment?id=${studentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    class: classData.name,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to remove student');
            }

            // Refresh student list
            fetchClassData();

        } catch (err) {
            setError(err.message);
            console.error('Error removing student:', err);
        }
    };

    if (loading) {
        return ( <
            div className = "flex items-center justify-center min-h-screen" >
            <
            div className = "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" > < /div> <
            /div>
        );
    }

    if (error) {
        return ( <
            div className = "p-4 md:p-6" >
            <
            div className = "bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6"
            role = "alert" >
            <
            p className = "font-bold" > Error < /p> <
            p > { error } < /p> <
            button onClick = {
                () => router.back() }
            className = "mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" >
            Go Back <
            /button> <
            /div> <
            /div>
        );
    }

    if (!classData) {
        return ( <
            div className = "p-4 md:p-6" >
            <
            div className = "bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6"
            role = "alert" >
            <
            p className = "font-bold" > Error < /p> <
            p > Class not found < /p> <
            button onClick = {
                () => router.push('/organization/class-management') }
            className = "mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" >
            Back to Classes <
            /button> <
            /div> <
            /div>
        );
    }

    return ( <
        div className = "p-4 md:p-6" >
        <
        div className = "flex items-center mb-6" >
        <
        button onClick = {
            () => router.back() }
        className = "flex items-center text-blue-600 hover:text-blue-800 mr-4" >
        <
        FaArrowLeft className = "mr-1" / > Back <
        /button> <
        h1 className = "text-2xl md:text-3xl font-bold" > { classData.name } < /h1> <
        /div>

        {
            classData.description && ( <
                div className = "bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100" >
                <
                p className = "text-gray-800" > { classData.description } < /p> <
                /div>
            )
        }

        <
        div className = "flex flex-col md:flex-row md:items-center justify-between mb-6" >
        <
        div className = "mb-4 md:mb-0" >
        <
        h2 className = "text-xl font-semibold" > Students({ students.length }) < /h2> <
        /div>

        <
        div className = "flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3" >
        <
        div className = "relative" >
        <
        div className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
        <
        FaSearch className = "text-gray-400" / >
        <
        /div> <
        input type = "text"
        placeholder = "Search students..."
        value = { searchTerm }
        onChange = {
            (e) => setSearchTerm(e.target.value) }
        className = "pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" /
        >
        <
        /div>

        <
        button onClick = {
            () => setShowAddModal(true) }
        className = "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center" >
        <
        FaUserPlus className = "mr-2" / > Add Student <
        /button> <
        /div> <
        /div>

        { /* Students list */ } {
            filteredStudents.length === 0 ? ( <
                div className = "bg-white rounded-lg shadow-md p-6 text-center" > {
                    searchTerm ? ( <
                        p className = "text-gray-500" > No students match your search. < /p>
                    ) : ( <
                        div >
                        <
                        p className = "text-gray-500 mb-4" > No students in this class yet. < /p> <
                        button onClick = {
                            () => setShowAddModal(true) }
                        className = "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition" >
                        Add Your First Student <
                        /button> <
                        /div>
                    )
                } <
                /div>
            ) : ( <
                div className = "bg-white rounded-lg shadow-md overflow-hidden" >
                <
                div className = "overflow-x-auto" >
                <
                table className = "min-w-full divide-y divide-gray-200" >
                <
                thead className = "bg-gray-50" >
                <
                tr >
                <
                th className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick = {
                    () => handleSort('name') } >
                <
                div className = "flex items-center" >
                Name { getSortIcon('name') } <
                /div> <
                /th> <
                th className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick = {
                    () => handleSort('email') } >
                <
                div className = "flex items-center" >
                Email { getSortIcon('email') } <
                /div> <
                /th> <
                th className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick = {
                    () => handleSort('verified') } >
                <
                div className = "flex items-center" >
                Status { getSortIcon('verified') } <
                /div> <
                /th> <
                th className = "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" >
                Actions <
                /th> <
                /tr> <
                /thead> <
                tbody className = "bg-white divide-y divide-gray-200" > {
                    filteredStudents.map(student => ( <
                        tr key = { student._id }
                        className = "hover:bg-gray-50" >
                        <
                        td className = "px-6 py-4 whitespace-nowrap" >
                        <
                        div className = "text-sm font-medium text-gray-900" > { student.name } < /div> <
                        /td> <
                        td className = "px-6 py-4 whitespace-nowrap" >
                        <
                        div className = "text-sm text-gray-500" > { student.email } < /div> <
                        /td> <
                        td className = "px-6 py-4 whitespace-nowrap" > {
                            student.verified ? ( <
                                span className = "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800" >
                                Verified <
                                /span>
                            ) : ( <
                                span className = "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800" >
                                Pending Verification <
                                /span>
                            )
                        } <
                        /td> <
                        td className = "px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2" >
                        <
                        button onClick = {
                            () => handleRemoveStudent(student._id) }
                        className = "text-red-600 hover:text-red-900"
                        title = "Remove from class" >
                        Remove <
                        /button> <
                        /td> <
                        /tr>
                    ))
                } <
                /tbody> <
                /table> <
                /div> <
                /div>
            )
        }

        { /* Modal for adding a student */ } {
            showAddModal && ( <
                div className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4" >
                <
                div className = "bg-white rounded-lg shadow-xl max-w-md w-full" >
                <
                div className = "flex justify-between items-center border-b px-6 py-4" >
                <
                h2 className = "text-xl font-semibold" > Add Student to Class < /h2> <
                button onClick = {
                    () => {
                        setShowAddModal(false);
                        setNewStudentEmail('');
                        setAddStudentError('');
                    }
                }
                className = "text-gray-500 hover:text-gray-700" >
                <
                FaTimes / >
                <
                /button> <
                /div>

                <
                form onSubmit = { handleAddStudent } >
                <
                div className = "p-6" >
                <
                p className = "text-gray-600 mb-4" >
                Enter the email address of the student you want to add.If they don 't have an account yet, they will receive an invitation email. <
                /p>

                {
                    addStudentError && ( <
                        div className = "bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4"
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
                        p > { addStudentError } < /p> <
                        /div> <
                        /div> <
                        /div>
                    )
                }

                <
                div className = "relative" >
                <
                div className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
                <
                FaEnvelope className = "text-gray-400" / >
                <
                /div> <
                input type = "email"
                value = { newStudentEmail }
                onChange = {
                    (e) => setNewStudentEmail(e.target.value) }
                className = "pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                placeholder = "student@example.com"
                required /
                >
                <
                /div> <
                /div>

                <
                div className = "bg-gray-50 px-6 py-4 flex justify-end space-x-3" >
                <
                button type = "button"
                onClick = {
                    () => {
                        setShowAddModal(false);
                        setNewStudentEmail('');
                        setAddStudentError('');
                    }
                }
                className = "px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50" >
                Cancel <
                /button> <
                button type = "submit"
                disabled = { addingStudent }
                className = { `px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                    addingStudent ? 'opacity-70 cursor-not-allowed' : ''
                  }` } >
                { addingStudent ? 'Adding...' : 'Add Student' } <
                /button> <
                /div> <
                /form> <
                /div> <
                /div>
            )
        } <
        /div>
    );
}