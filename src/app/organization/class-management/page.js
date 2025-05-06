'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUserGraduate, FaExclamationCircle, FaSearch } from 'react-icons/fa';

export default function ClassManagement() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentClass, setCurrentClass] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClasses, setFilteredClasses] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (classes.length) {
            setFilteredClasses(
                classes.filter(cls =>
                    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (cls.description && cls.description.toLowerCase().includes(searchTerm.toLowerCase()))
                )
            );
        }
    }, [searchTerm, classes]);

    const fetchClasses = async() => {
        try {
            setLoading(true);
            const response = await fetch('/api/classes');

            if (!response.ok) {
                throw new Error('Failed to fetch classes');
            }

            const data = await response.json();
            setClasses(data);
            setFilteredClasses(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching classes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const openAddModal = () => {
        setCurrentClass(null);
        setFormData({
            name: '',
            description: '',
        });
        setShowModal(true);
    };

    const openEditModal = (cls) => {
        setCurrentClass(cls);
        setFormData({
            name: cls.name,
            description: cls.description || '',
        });
        setShowModal(true);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            let response;

            if (currentClass) {
                // Edit existing class
                response = await fetch(`/api/classes?id=${currentClass._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
            } else {
                // Add new class
                response = await fetch('/api/classes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
            }

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save class');
            }

            // Refresh classes
            await fetchClasses();
            setShowModal(false);

        } catch (err) {
            setError(err.message);
            console.error('Error saving class:', err);
        }
    };

    const handleDelete = async(classId) => {
        if (!confirm('Are you sure you want to delete this class? This will affect all students assigned to this class.')) {
            return;
        }

        try {
            const response = await fetch(`/api/classes?id=${classId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete class');
            }

            // Refresh classes
            await fetchClasses();

        } catch (err) {
            setError(err.message);
            console.error('Error deleting class:', err);
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

    return ( <
        div className = "p-4 md:p-6" >
        <
        div className = "flex flex-col md:flex-row md:items-center justify-between mb-6" >
        <
        h1 className = "text-2xl md:text-3xl font-bold mb-4 md:mb-0" > Class Management < /h1>

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
        placeholder = "Search classes..."
        value = { searchTerm }
        onChange = {
            (e) => setSearchTerm(e.target.value) }
        className = "pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" /
        >
        <
        /div>

        <
        button onClick = { openAddModal }
        className = "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center" >
        <
        FaPlus className = "mr-2" / > Add New Class <
        /button> <
        /div> <
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

        {
            filteredClasses.length === 0 ? ( <
                div className = "bg-white rounded-lg shadow-md p-6 text-center" > {
                    searchTerm ? ( <
                        p className = "text-gray-500" > No classes match your search.Please
                        try a different search term or create a new class. < /p>
                    ) : ( <
                        div >
                        <
                        FaUserGraduate className = "mx-auto text-gray-400 text-5xl mb-4" / >
                        <
                        p className = "text-gray-500 mb-4" > No classes created yet. < /p> <
                        button onClick = { openAddModal }
                        className = "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition" >
                        Create Your First Class <
                        /button> <
                        /div>
                    )
                } <
                /div>
            ) : ( <
                div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" > {
                    filteredClasses.map(cls => ( <
                        div key = { cls._id }
                        className = "bg-white rounded-lg shadow-md overflow-hidden" >
                        <
                        div className = "border-b px-6 py-4 bg-blue-50 flex justify-between items-center" >
                        <
                        h2 className = "text-xl font-semibold text-gray-800" > { cls.name } < /h2> <
                        div className = "flex space-x-2" >
                        <
                        button onClick = {
                            () => openEditModal(cls) }
                        className = "text-blue-600 hover:text-blue-800"
                        title = "Edit class" >
                        <
                        FaEdit / >
                        <
                        /button> <
                        button onClick = {
                            () => handleDelete(cls._id) }
                        className = "text-red-600 hover:text-red-800"
                        title = "Delete class" >
                        <
                        FaTrash / >
                        <
                        /button> <
                        /div> <
                        /div> <
                        div className = "px-6 py-4" > {
                            cls.description ? ( <
                                p className = "text-gray-600 mb-4" > { cls.description } < /p>
                            ) : ( <
                                p className = "text-gray-500 italic mb-4" > No description provided < /p>
                            )
                        }

                        <
                        div className = "flex justify-between items-center" >
                        <
                        div >
                        <
                        p className = "text-sm text-gray-500" >
                        Students: { cls.studentCount || 0 } <
                        /p> <
                        p className = "text-sm text-gray-500" >
                        Exams Assigned: { cls.examCount || 0 } <
                        /p> <
                        /div> <
                        button onClick = {
                            () => window.location.href = `/organization/class/${cls._id}` }
                        className = "text-blue-600 hover:text-blue-800 text-sm font-medium" >
                        View Details <
                        /button> <
                        /div> <
                        /div> <
                        /div>
                    ))
                } <
                /div>
            )
        }

        { /* Modal for adding/editing a class */ } {
            showModal && ( <
                div className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4" >
                <
                div className = "bg-white rounded-lg shadow-xl max-w-md w-full" >
                <
                div className = "border-b px-6 py-4" >
                <
                h2 className = "text-xl font-semibold" > { currentClass ? 'Edit Class' : 'Add New Class' } <
                /h2> <
                /div>

                <
                form onSubmit = { handleSubmit } >
                <
                div className = "p-6 space-y-4" >
                <
                div >
                <
                label htmlFor = "name"
                className = "block text-sm font-medium text-gray-700 mb-1" >
                Class Name < span className = "text-red-500" > * < /span> <
                /label> <
                input type = "text"
                id = "name"
                name = "name"
                value = { formData.name }
                onChange = { handleChange }
                className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder = "e.g., Grade 10 Science"
                required /
                >
                <
                /div>

                <
                div >
                <
                label htmlFor = "description"
                className = "block text-sm font-medium text-gray-700 mb-1" >
                Description <
                /label> <
                textarea id = "description"
                name = "description"
                value = { formData.description }
                onChange = { handleChange }
                rows = "3"
                className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder = "Class description (optional)" >
                < /textarea> <
                /div> <
                /div>

                <
                div className = "bg-gray-50 px-6 py-4 flex justify-end space-x-3" >
                <
                button type = "button"
                onClick = {
                    () => setShowModal(false) }
                className = "px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50" >
                Cancel <
                /button> <
                button type = "submit"
                className = "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" >
                { currentClass ? 'Update Class' : 'Create Class' } <
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