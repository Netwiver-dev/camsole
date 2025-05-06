'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { withAuth } from '../../lib/auth-context';
import { FaCheckCircle, FaTimesCircle, FaClock, FaChevronRight, FaChevronLeft } from 'react-icons/fa';

function TakeExamPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const attemptId = searchParams.get('id');

    const [exam, setExam] = useState(null);
    const [attempt, setAttempt] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!attemptId) {
            setError('No attempt ID provided');
            setLoading(false);
            return;
        }

        fetchExamData();
    }, [attemptId]);

    useEffect(() => {
        let timer;
        if (timeRemaining > 0) {
            timer = setInterval(() => {
                setTimeRemaining(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        handleTimeUp();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [timeRemaining]);

    const fetchExamData = async() => {
        try {
            setLoading(true);

            const response = await fetch(`/api/exams/progress?attemptId=${attemptId}`);

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to fetch exam data');
            }

            const data = await response.json();

            if (data.attempt.completed) {
                // Redirect to results page if already completed
                router.push(`/organization-user/result?id=${data.attempt.resultId}`);
                return;
            }

            setExam(data.exam);
            setAttempt(data.attempt);
            setTimeRemaining(data.attempt.timeRemaining);

            // Initialize answers from saved progress
            const savedAnswers = {};
            if (data.attempt.answers && data.attempt.answers.length > 0) {
                data.attempt.answers.forEach(ans => {
                    savedAnswers[ans.questionId] = ans.selectedOptions || [];
                });
            }
            setAnswers(savedAnswers);

        } catch (err) {
            console.error('Error fetching exam data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTimeUp = async() => {
        await handleSubmitExam();
    };

    const handleOptionChange = (questionId, optionIndex, isSingleChoice) => {
        setAnswers(prevAnswers => {
            const currentAnswer = prevAnswers[questionId] || [];

            if (isSingleChoice) {
                // Single choice question - replace answer
                return {
                    ...prevAnswers,
                    [questionId]: [optionIndex]
                };
            } else {
                // Multiple choice question - toggle option
                if (currentAnswer.includes(optionIndex)) {
                    return {
                        ...prevAnswers,
                        [questionId]: currentAnswer.filter(idx => idx !== optionIndex)
                    };
                } else {
                    return {
                        ...prevAnswers,
                        [questionId]: [...currentAnswer, optionIndex]
                    };
                }
            }
        });
    };

    const saveProgress = async() => {
        if (!attempt || !exam) return;

        try {
            const formattedAnswers = Object.keys(answers).map(questionId => ({
                questionId,
                selectedOptions: answers[questionId]
            }));

            const response = await fetch('/api/exams/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    attemptId,
                    answers: formattedAnswers,
                    timeRemaining
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save progress');
            }

        } catch (err) {
            console.error('Error saving progress:', err);
            // Continue without stopping the exam - user might not even notice
        }
    };

    const handleNextQuestion = async() => {
        await saveProgress();
        if (currentQuestionIndex < exam.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = async() => {
        await saveProgress();
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmitExam = async() => {
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            // Format answers for submission
            const formattedAnswers = Object.keys(answers).map(questionId => ({
                questionId,
                selectedOptions: answers[questionId] || []
            }));

            const response = await fetch('/api/exams/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    attemptId,
                    answers: formattedAnswers,
                    timeRemaining
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit exam');
            }

            const data = await response.json();

            // Redirect to results page
            router.push(`/organization-user/result?id=${data.resultId}`);

        } catch (err) {
            console.error('Error submitting exam:', err);
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    const formatTimeRemaining = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const isAnswered = (questionId) => {
        return answers[questionId] && answers[questionId].length > 0;
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
            div className = "p-6" >
            <
            div className = "bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" >
            <
            p className = "font-bold" > Error < /p> <
            p > { error } < /p> < /
            div > <
            button onClick = {
                () => router.push('/organization-user/exam-dash')
            }
            className = "px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700" >
            Back to Exams <
            /button> < /
            div >
        );
    }

    if (!exam || !attempt) {
        return ( <
            div className = "p-6" >
            <
            div className = "bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" >
            <
            p className = "font-bold" > Notice < /p> <
            p > No exam data found.Please go back and
            try again. < /p> < /
            div > <
            button onClick = {
                () => router.push('/organization-user/exam-dash')
            }
            className = "px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700" >
            Back to Exams <
            /button> < /
            div >
        );
    }

    const currentQuestion = exam.questions[currentQuestionIndex];
    const isSingleChoice = currentQuestion.type === 'single';

    return ( <
            div className = "p-4 md:p-6" > { /* Exam Header */ } <
            div className = "bg-white rounded-lg shadow-md p-6 mb-6" >
            <
            div className = "flex flex-col md:flex-row md:justify-between md:items-center" >
            <
            div className = "mb-4 md:mb-0" >
            <
            h1 className = "text-xl font-bold" > { exam.title } < /h1> <
            p className = "text-gray-600 text-sm mt-1" > { currentQuestionIndex + 1 }
            of { exam.questions.length }
            questions <
            /p> < /
            div >

            <
            div className = "flex items-center bg-gray-100 px-4 py-2 rounded-lg" >
            <
            FaClock className = "text-gray-600 mr-2" / >
            <
            span className = { `font-mono ${timeRemaining < 300 ? 'text-red-600 font-bold' : 'text-gray-800'}` } >
            Time Remaining: { formatTimeRemaining(timeRemaining) } <
            /span> < /
            div > <
            /div> < /
            div >

            { /* Question Panel */ } <
            div className = "grid grid-cols-1 md:grid-cols-5 gap-6" > { /* Question List (Side Navigation) */ } <
            div className = "hidden md:block md:col-span-1" >
            <
            div className = "bg-white rounded-lg shadow-md p-4" >
            <
            h2 className = "text-lg font-semibold mb-4" > Questions < /h2> <
            div className = "space-y-2" > {
                exam.questions.map((question, index) => ( <
                        button key = { index }
                        onClick = {
                            () => setCurrentQuestionIndex(index)
                        }
                        className = { `w-full py-2 px-4 rounded-md text-left ${
                    currentQuestionIndex === index 
                      ? 'bg-blue-600 text-white' 
                      : isAnswered(question._id)
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-gray-100 hover:bg-gray-200'
                  }` } >
                        <
                        div className = "flex items-center" >
                        <
                        span className = "mr-2" > { index + 1 }. < /span> {
                        isAnswered(question._id) && ( <
                            FaCheckCircle className = "text-green-600 ml-auto" / >
                        )
                    } <
                    /div> < /
                    button >
                ))
        } <
        /div> < /
    div > <
        /div>

    { /* Question Content */ } <
    div className = "md:col-span-4" >
        <
        div className = "bg-white rounded-lg shadow-md p-6" >
        <
        h2 className = "text-xl font-semibold mb-6" >
        Question { currentQuestionIndex + 1 }: { currentQuestion.text } <
        /h2>

    {
        currentQuestion.image && ( <
            div className = "my-4" >
            <
            img src = { currentQuestion.image }
            alt = "Question"
            className = "max-w-full max-h-64 object-contain mx-auto" /
            >
            <
            /div>
        )
    }

    <
    div className = "mt-6 space-y-4" > {
            currentQuestion.options.map((option, optionIndex) => ( <
                div key = { optionIndex }
                className = { `p-4 border rounded-md cursor-pointer hover:bg-gray-50 ${
                    answers[currentQuestion._id]?.includes(optionIndex) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300'
                  }` }
                onClick = {
                    () => handleOptionChange(currentQuestion._id, optionIndex, isSingleChoice)
                } >
                <
                div className = "flex items-start" >
                <
                div className = { `flex-shrink-0 h-5 w-5 border rounded ${
                      isSingleChoice ? 'rounded-full' : 'rounded'
                    } ${
                      answers[currentQuestion._id]?.includes(optionIndex) 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-gray-400'
                    } flex items-center justify-center mr-3 mt-0.5` } > {
                    answers[currentQuestion._id] ? .includes(optionIndex) && (
                        isSingleChoice ?
                        <
                        div className = "h-2 w-2 rounded-full bg-white" > < /div> : <
                        FaCheckCircle className = "h-3 w-3 text-white" / >
                    )
                } <
                /div> <
                span > { option } < /span> < /
                div > <
                /div>
            ))
        } <
        /div>

    <
    div className = "mt-8 flex justify-between" >
        <
        button onClick = { handlePreviousQuestion }
    disabled = { currentQuestionIndex === 0 }
    className = { `px-4 py-2 flex items-center rounded-md ${
                  currentQuestionIndex === 0 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }` } >
        <
        FaChevronLeft className = "mr-2" / >
        Previous <
        /button>

    {
        currentQuestionIndex < exam.questions.length - 1 ? ( <
            button onClick = { handleNextQuestion }
            className = "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center" >
            Next <
            FaChevronRight className = "ml-2" / >
            <
            /button>
        ) : ( <
            button onClick = { handleSubmitExam }
            disabled = { isSubmitting }
            className = { `px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }` } > { isSubmitting ? 'Submitting...' : 'Submit Exam' } <
            /button>
        )
    } <
    /div> < /
    div >

        { /* Question Navigation for Mobile */ } <
        div className = "md:hidden mt-6" >
        <
        div className = "flex flex-wrap gap-2" > {
            exam.questions.map((question, index) => ( <
                button key = { index }
                onClick = {
                    () => setCurrentQuestionIndex(index)
                }
                className = { `w-10 h-10 flex items-center justify-center rounded-full ${
                    currentQuestionIndex === index 
                      ? 'bg-blue-600 text-white' 
                      : isAnswered(question._id)
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100'
                  }` } > { index + 1 } <
                /button>
            ))
        } <
        /div>

    <
    div className = "mt-4 flex justify-center" >
        <
        button onClick = { handleSubmitExam }
    disabled = { isSubmitting }
    className = { `px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }` } > { isSubmitting ? 'Submitting...' : 'Submit Exam' } <
        /button> < /
    div > <
        /div> < /
    div > <
        /div> < /
    div >
);
}

export default withAuth(TakeExamPage);