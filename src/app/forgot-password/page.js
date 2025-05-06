'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaEnvelope, FaExclamationCircle, FaCheck } from 'react-icons/fa';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            // Validate email
            if (!email) {
                throw new Error('Please enter your email address');
            }

            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to process request');
            }

            setSuccess(true);
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return ( <
        div className = "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" >
        <
        div className = "max-w-md w-full space-y-8" >
        <
        div >
        <
        h1 className = "text-center text-3xl font-extrabold text-gray-900" > Camsole < /h1> <
        h2 className = "mt-6 text-center text-2xl font-bold text-gray-900" >
        Reset your password <
        /h2> <
        p className = "mt-2 text-center text-sm text-gray-600" >
        Enter your email address and we 'll send you a link to reset your password. <
        /p> <
        /div>

        {
            error && ( <
                div className = "rounded-md bg-red-50 p-4" >
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
                h3 className = "text-sm font-medium text-red-800" > { error } < /h3> <
                /div> <
                /div> <
                /div>
            )
        }

        {
            success ? ( <
                div className = "rounded-md bg-green-50 p-4" >
                <
                div className = "flex" >
                <
                div className = "flex-shrink-0" >
                <
                FaCheck className = "h-5 w-5 text-green-400" / >
                <
                /div> <
                div className = "ml-3" >
                <
                h3 className = "text-sm font-medium text-green-800" >
                Password reset link sent!Check your email
                for instructions. <
                /h3> <
                p className = "mt-2 text-sm text-green-700" >
                If you don 't see the email, check your spam folder. <
                /p> <
                /div> <
                /div> <
                /div>
            ) : ( <
                form className = "mt-8 space-y-6"
                onSubmit = { handleSubmit } >
                <
                div className = "rounded-md shadow-sm -space-y-px" >
                <
                div >
                <
                label htmlFor = "email"
                className = "sr-only" > Email address < /label> <
                div className = "relative" >
                <
                div className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
                <
                FaEnvelope className = "h-5 w-5 text-gray-400" / >
                <
                /div> <
                input id = "email"
                name = "email"
                type = "email"
                autoComplete = "email"
                required value = { email }
                onChange = {
                    (e) => setEmail(e.target.value) }
                className = "appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder = "Email address" /
                >
                <
                /div> <
                /div> <
                /div>

                <
                div >
                <
                button type = "submit"
                disabled = { loading }
                className = { `group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }` } >
                {
                    loading ? ( <
                        span className = "absolute left-0 inset-y-0 flex items-center pl-3" >
                        <
                        svg className = "animate-spin h-5 w-5 text-white"
                        xmlns = "http://www.w3.org/2000/svg"
                        fill = "none"
                        viewBox = "0 0 24 24" >
                        <
                        circle className = "opacity-25"
                        cx = "12"
                        cy = "12"
                        r = "10"
                        stroke = "currentColor"
                        strokeWidth = "4" > < /circle> <
                        path className = "opacity-75"
                        fill = "currentColor"
                        d = "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" > < /path> <
                        /svg> <
                        /span>
                    ) : null
                }
                Send Reset Link <
                /button> <
                /div> <
                /form>
            )
        }

        <
        div className = "text-center mt-4" >
        <
        p className = "text-sm text-gray-600" >
        Remembered your password ? { ' ' } <
        Link href = "/login"
        className = "font-medium text-blue-600 hover:text-blue-500" >
        Back to sign in
        <
        /Link> <
        /p> <
        /div> <
        /div> <
        /div>
    );
}