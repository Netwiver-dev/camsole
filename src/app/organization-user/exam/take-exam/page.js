'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { withAuth } from '../../../lib/auth-context';
import { useAuth } from '../../../lib/auth-context';
import {
    FaFlag,
    FaRegFlag,
    FaClock,
    FaChevronLeft,
    FaChevronRight,
    FaCheck,
    FaTimes,
    FaExclamationTriangle,
    FaSave
} from 'react-icons/fa';

function TakeExam() {
    const { user, isOffline } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const examId = searchParams.get('id');

    // State
    const [exam, setExam] = useState(null);
    const [attempt, setAttempt] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [flaggedQuestions, setFlaggedQuestions] = useState([]);
    const [timeRemaining, setTimeRemaining] = useState('00:00');
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const [showQuestionList, setShowQuestionList] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Timer interval ref
    const timerIntervalRef = useRef(null);

    // Load exam data
    useEffect(() => {
        if (!examId) {
            setError('No exam ID provided');
            setLoading(false);
            return;
        }

        fetchExam();

        // Cleanup timer when unmounting
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, [examId]);

    // Set up before unload warning
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (exam && !isSubmitting) {
                // Cancel the event
                e.preventDefault();
                // Chrome requires returnValue to be set
                e.returnValue = '';

                // Custom message (note: most modern browsers show a generic message instead)
                return 'You are currently taking an exam. If you leave, your progress may be lost. Are you sure you want to exit?';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [exam, isSubmitting]);

    // Start the timer once exam is loaded
    useEffect(() => {
        if (attempt && attempt.timeRemaining) {
            startTimer(attempt.timeRemaining);
        }
    }, [attempt]);

    // Save progress every 30 seconds if changes were made
    useEffect(() => {
        if (!exam || !attempt) return;

        const saveInterval = setInterval(() => {
            saveProgress();
        }, 30000); // 30 seconds

        return () => clearInterval(saveInterval);
    }, [exam, attempt, answers, flaggedQuestions]);

    // Fetch exam data
    const fetchExam = async() => {
        try {
            setLoading(true);

            const response = await fetch(`/api/exams/${examId}/attempts`);

            if (!response.ok) {
                throw new Error('Failed to load exam');
            }

            const data = await response.json();

            setExam(data.exam);
            setAttempt(data.attempt);

            // Initialize answers and flagged questions
            if (data.attempt.answers) {
                setAnswers(data.attempt.answers);
            } else {
                setAnswers(new Array(data.exam.questions.length).fill(null));
            }

            if (data.attempt.flaggedQuestions) {
                setFlaggedQuestions(data.attempt.flaggedQuestions);
            }

            setTimeRemaining(data.attempt.timeRemaining);

        } catch (err) {
            setError(err.message);
            console.error('Error fetching exam:', err);
        } finally {
            setLoading(false);
        }
    };

    // Start timer function
    const startTimer = (initialTime) => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }

        // Parse the time (HH:MM format)
        let [hours, minutes] = initialTime.split(':').map(Number);
        let totalSeconds = hours * 3600 + minutes * 60;

        // Update the timer every second
        timerIntervalRef.current = setInterval(() => {
            totalSeconds -= 1;

            if (totalSeconds <= 0) {
                clearInterval(timerIntervalRef.current);
                // Auto-submit the exam
                submitExam(true);
                return;
            }

            // Convert back to HH:MM format
            const newHours = Math.floor(totalSeconds / 3600);
            const newMinutes = Math.floor((totalSeconds % 3600) / 60);
            const newSeconds = totalSeconds % 60;

            const formattedTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;

            setTimeRemaining(formattedTime);

            // Save progress every 5 minutes (300 seconds)
            if (totalSeconds % 300 === 0) {
                saveProgress();
            }

            // Warning when 5 minutes remaining
            if (totalSeconds === 300) {
                alert('You have 5 minutes remaining in this exam.');
            }

        }, 1000);
    };

    // Handle answer selection
    const handleSelectAnswer = (optionIndex) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    // Toggle flag for current question
    const toggleFlag = () => {
        const newFlaggedQuestions = [...flaggedQuestions];

        if (newFlaggedQuestions.includes(currentQuestionIndex)) {
            // Remove flag
            const index = newFlaggedQuestions.indexOf(currentQuestionIndex);
            newFlaggedQuestions.splice(index, 1);
        } else {
            // Add flag
            newFlaggedQuestions.push(currentQuestionIndex);
        }

        setFlaggedQuestions(newFlaggedQuestions);
    };

    // Navigate to previous question
    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    // Navigate to next question
    const goToNextQuestion = () => {
        if (currentQuestionIndex < exam.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    // Navigate to specific question
    const goToQuestion = (index) => {
        if (index >= 0 && index < exam.questions.length) {
            setCurrentQuestionIndex(index);
            setShowQuestionList(false);
        }
    };

    // Save exam progress
    const saveProgress = async() => {
        if (isOffline) {
            console.log('Cannot save progress while offline');
            return;
        }

        try {
            setIsSaving(true);

            const response = await fetch(`/api/exams/${examId}/attempts/${attempt._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    answers,
                    flaggedQuestions,
                    timeRemaining
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save progress');
            }

            setLastSaved(new Date());

        } catch (err) {
            console.error('Error saving progress:', err);
            // Don't show error UI for background saves
        } finally {
            setIsSaving(false);
        }
    };

    // Submit exam
    const submitExam = async(isAutoSubmit = false) => {
        try {
            setIsSubmitting(true);

            if (!isAutoSubmit) {
                // First save the latest progress
                await saveProgress();
            }

            const response = await fetch(`/api/exams/${examId}/attempts/${attempt._id}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isAutoSubmit
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit exam');
            }

            const data = await response.json();

            // Redirect to result page
            router.push(`/organization-user/result?id=${data.result._id}`);

        } catch (err) {
            setError(err.message);
            console.error('Error submitting exam:', err);
            setIsSubmitting(false);
        }
    };

    // Clear answer for current question
    const clearAnswer = () => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = null;
        setAnswers(newAnswers);
    };

    // Calculate progress
    const calculateProgress = () => {
        if (!exam) return 0;
        const answeredCount = answers.filter(a => a !== null).length;
        return Math.round((answeredCount / exam.questions.length) * 100);
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
            div className = "p-6" >
            <
            div className = "bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6"
            role = "alert" >
            <
            p className = "font-bold" > Error < /p> <
            p > { error } < /p> <
            button className = "mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick = {
                () => router.push('/organization-user/exam') } >
            Return to Exam Dashboard <
            /button> <
            /div> <
            /div>
        );
    }

    if (!exam || !attempt) {
        return ( <
            div className = "p-6" >
            <
            div className = "bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6"
            role = "alert" >
            <
            p className = "font-bold" > No exam data found < /p> <
            p > Unable to load the exam.Please
            return to the exam dashboard. < /p> <
                button
            className = "mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            onClick = {
                () => router.push('/organization-user/exam') } >
            Return to Exam Dashboard <
            /button> <
            /div> <
            /div>
        );
    }

    const currentQuestion = exam.questions[currentQuestionIndex];
    const isCurrentQuestionFlagged = flaggedQuestions.includes(currentQuestionIndex);

    return ( <
        div className = "min-h-screen flex flex-col bg-gray-50" > { /* Exam Header */ } <
        div className = "bg-white shadow p-4 sticky top-0 z-10" >
        <
        div className = "flex flex-col md:flex-row justify-between items-center" >
        <
        div className = "mb-4 md:mb-0" >
        <
        h1 className = "text-xl font-bold" > { exam.title } < /h1> <
        p className = "text-sm text-gray-600" >
        Student: { user ? .name } | Class: { user ? .class } <
        /p> <
        /div>

        <
        div className = "flex items-center space-x-4" > { /* Timer */ } <
        div className = "flex items-center" >
        <
        FaClock className = "text-red-500 mr-2" / >
        <
        span className = "font-mono text-lg font-bold" > { timeRemaining } < /span> <
        /div>

        { /* Progress indicator */ } <
        div >
        <
        div className = "w-32 bg-gray-200 rounded-full h-2.5" >
        <
        div className = "bg-blue-600 h-2.5 rounded-full"
        style = {
            { width: `${calculateProgress()}%` } } >
        < /div> <
        /div> <
        span className = "text-xs text-gray-600 mt-1 block text-center" > { answers.filter(a => a !== null).length }
        /{exam.questions.length} <
        /span> <
        /div> <
        /div> <
        /div>

        { /* Save status indicator */ } {
            lastSaved && ( <
                p className = "text-xs text-gray-500 text-right mt-1" > { isSaving ? 'Saving...' : `Last saved: ${lastSaved.toLocaleTimeString()}` } <
                /p>
            )
        } <
        /div>

        { /* Offline Warning */ } {
            isOffline && ( <
                div className = "bg-yellow-500 text-white px-4 py-2 text-center" >
                <
                FaExclamationTriangle className = "inline mr-2" / >
                You 're currently offline. Your answers will be saved locally and submitted when you'
                re back online. <
                /div>
            )
        }

        { /* Exam Content */ } <
        div className = "flex flex-1 p-4 md:p-6" > { /* Left Sidebar (Question List) - Mobile: Hidden, Desktop: Visible */ } <
        div className = "hidden md:block w-64 bg-white shadow rounded-lg p-4 mr-6 h-fit" >
        <
        h2 className = "font-semibold mb-3" > Questions < /h2> <
        div className = "max-h-96 overflow-y-auto" > {
            exam.questions.map((question, index) => ( <
                button key = { index }
                className = { `w-full text-left p-2 mb-2 text-sm rounded flex items-center ${
                  currentQuestionIndex === index
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                } ${answers[index] !== null ? 'font-medium' : ''}` }
                onClick = {
                    () => goToQuestion(index) } >
                <
                span className = "mr-2" > { index + 1 }. < /span> {
                    flaggedQuestions.includes(index) && ( <
                        FaFlag className = "text-yellow-500 mr-1" / >
                    )
                } {
                    answers[index] !== null ? ( <
                        FaCheck className = "text-green-500 mr-1" / >
                    ) : ( <
                        div className = "w-4 mr-1" / >
                    )
                } <
                span className = "truncate" > {
                    question.text.length > 25 ?
                    question.text.substring(0, 25) + '...' :
                        question.text
                } <
                /span> <
                /button>
            ))
        } <
        /div> <
        /div>

        { /* Question Content - Expand to fill available space */ } <
        div className = "flex-1" >
        <
        div className = "bg-white shadow rounded-lg p-4 md:p-6" > { /* Question Header */ } <
        div className = "flex justify-between items-center mb-4" >
        <
        h2 className = "font-semibold text-lg" >
        Question { currentQuestionIndex + 1 }
        of { exam.questions.length } <
        /h2>

        <
        button className = { `flex items-center p-2 rounded ${
                  isCurrentQuestionFlagged
                    ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                    : 'text-gray-500 hover:bg-gray-100'
                }` }
        onClick = { toggleFlag }
        title = { isCurrentQuestionFlagged ? "Unflag this question" : "Flag this question for review" } >
        {
            isCurrentQuestionFlagged ? ( <
                >
                <
                FaFlag className = "mr-2" / > Flagged <
                />
            ) : ( <
                >
                <
                FaRegFlag className = "mr-2" / > Flag <
                />
            )
        } <
        /button> <
        /div>

        { /* Question Text */ } <
        div className = "mb-6" >
        <
        p className = "text-lg" > { currentQuestion.text } < /p>

        { /* Question Image if available */ } {
            currentQuestion.image && ( <
                div className = "mt-4" >
                <
                img src = { currentQuestion.image }
                alt = "Question Image"
                className = "max-w-full h-auto max-h-64 object-contain rounded" /
                >
                <
                /div>
            )
        } <
        /div>

        { /* Options */ } <
        div className = "space-y-3 mb-6" > {
            currentQuestion.options.map((option, index) => ( <
                div key = { index }
                className = { `flex items-start p-3 border rounded cursor-pointer ${
                    answers[currentQuestionIndex] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }` }
                onClick = {
                    () => handleSelectAnswer(index) } >
                <
                div className = "mr-3 mt-0.5" >
                <
                div className = { `h-5 w-5 rounded-full flex items-center justify-center border ${
                        answers[currentQuestionIndex] === index
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-400'
                      }` } >
                {
                    answers[currentQuestionIndex] === index && ( <
                        div className = "h-2 w-2 bg-white rounded-full" > < /div>
                    )
                } <
                /div> <
                /div>

                <
                div className = "flex-1" >
                <
                span > { option.text } < /span>

                { /* Option Image if available */ } {
                    option.image && ( <
                        div className = "mt-2" >
                        <
                        img src = { option.image }
                        alt = { `Option ${index + 1} Image` }
                        className = "max-w-full h-auto max-h-40 object-contain rounded" /
                        >
                        <
                        /div>
                    )
                } <
                /div> <
                /div>
            ))
        } <
        /div>

        { /* Question Navigation */ } <
        div className = "flex justify-between items-center pt-4 border-t" >
        <
        button className = "flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled = { currentQuestionIndex === 0 }
        onClick = { goToPreviousQuestion } >
        <
        FaChevronLeft className = "mr-2" / > Previous <
        /button>

        <
        div className = "flex items-center" >
        <
        button className = "flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded mr-2"
        onClick = { clearAnswer }
        disabled = { answers[currentQuestionIndex] === null } >
        <
        FaTimes className = "mr-2" / > Clear <
        /button>

        <
        button className = "flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick = {
            () => setShowConfirmSubmit(true) } >
        <
        FaCheck className = "mr-2" / > Submit Exam <
        /button>

        { /* Mobile Question List Button */ } <
        button className = "md:hidden ml-2 px-2 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        onClick = {
            () => setShowQuestionList(true) } >
        <
        span className = "sr-only" > Show Questions < /span> <
        svg xmlns = "http://www.w3.org/2000/svg"
        className = "h-5 w-5"
        viewBox = "0 0 20 20"
        fill = "currentColor" >
        <
        path fillRule = "evenodd"
        d = "M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule = "evenodd" / >
        <
        /svg> <
        /button> <
        /div>

        <
        button className = "flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled = { currentQuestionIndex === exam.questions.length - 1 }
        onClick = { goToNextQuestion } >
        Next < FaChevronRight className = "ml-2" / >
        <
        /button> <
        /div> <
        /div> <
        /div> <
        /div>

        { /* Mobile Question List Modal */ } {
            showQuestionList && ( <
                div className = "fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4" >
                <
                div className = "bg-white rounded-lg shadow-xl w-full max-w-md" >
                <
                div className = "p-4 border-b" >
                <
                div className = "flex justify-between items-center" >
                <
                h2 className = "text-lg font-semibold" > Questions < /h2> <
                button className = "text-gray-500 hover:text-gray-700"
                onClick = {
                    () => setShowQuestionList(false) } >
                <
                svg xmlns = "http://www.w3.org/2000/svg"
                className = "h-6 w-6"
                fill = "none"
                viewBox = "0 0 24 24"
                stroke = "currentColor" >
                <
                path strokeLinecap = "round"
                strokeLinejoin = "round"
                strokeWidth = { 2 }
                d = "M6 18L18 6M6 6l12 12" / >
                <
                /svg> <
                /button> <
                /div> <
                /div>

                <
                div className = "p-4 max-h-96 overflow-y-auto" >
                <
                div className = "grid grid-cols-5 gap-2" > {
                    exam.questions.map((_, index) => ( <
                        button key = { index }
                        className = { `aspect-square flex flex-col items-center justify-center p-1 rounded text-sm ${
                      currentQuestionIndex === index
                        ? 'bg-blue-600 text-white'
                        : answers[index] !== null
                        ? 'bg-green-100 text-green-800'
                        : flaggedQuestions.includes(index)
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }` }
                        onClick = {
                            () => goToQuestion(index) } >
                        <
                        span > { index + 1 } < /span> { flaggedQuestions.includes(index) && < FaFlag className = "text-xs mt-1" / > } <
                        /button>
                    ))
                } <
                /div> <
                /div>

                <
                div className = "p-4 border-t" >
                <
                div className = "flex justify-between items-center text-xs text-gray-500" >
                <
                div className = "flex items-center" >
                <
                div className = "w-3 h-3 rounded bg-green-100 mr-1" > < /div> <
                span > Answered < /span> <
                /div> <
                div className = "flex items-center" >
                <
                div className = "w-3 h-3 rounded bg-yellow-100 mr-1" > < /div> <
                span > Flagged < /span> <
                /div> <
                div className = "flex items-center" >
                <
                div className = "w-3 h-3 rounded bg-blue-600 mr-1" > < /div> <
                span > Current < /span> <
                /div> <
                /div> <
                /div> <
                /div> <
                /div>
            )
        }

        { /* Submit Confirmation Modal */ } {
            showConfirmSubmit && ( <
                div className = "fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4" >
                <
                div className = "bg-white rounded-lg shadow-xl w-full max-w-md" >
                <
                div className = "p-6" >
                <
                h3 className = "text-lg font-bold mb-2" > Submit Exam ? < /h3>

                <
                p className = "text-gray-600 mb-4" >
                Are you sure you want to submit this exam ? You won 't be able to change your answers after submission. <
                /p>

                <
                div className = "bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" >
                <
                div className = "flex" >
                <
                FaExclamationTriangle className = "h-5 w-5 text-yellow-500 mr-2" / >
                <
                div >
                <
                p className = "font-bold" > Warning < /p> <
                p className = "text-sm" >
                You have { exam.questions.length - answers.filter(a => a !== null).length }
                unanswered questions. <
                /p> <
                /div> <
                /div> <
                /div>

                <
                div className = "flex space-x-3 justify-end" >
                <
                button className = "px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick = {
                    () => setShowConfirmSubmit(false) } >
                Cancel <
                /button> <
                button className = "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                onClick = {
                    () => submitExam(false) }
                disabled = { isSubmitting } >
                {
                    isSubmitting ? ( <
                        >
                        <
                        div className = "animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" > < /div>
                        Submitting... <
                        />
                    ) : ( <
                        >
                        <
                        FaCheck className = "mr-2" / > Submit Exam <
                        />
                    )
                } <
                /button> <
                /div> <
                /div> <
                /div> <
                /div>
            )
        } <
        /div>
    );
}

export default withAuth(TakeExam);