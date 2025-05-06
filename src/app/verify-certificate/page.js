import { Suspense } from "react";
import VerifyCertificateClient from "./client-component";

export default function VerifyCertificatePage() {
    return ( <
        Suspense fallback = { <
            div className = "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" >
            <
            div className = "max-w-3xl mx-auto text-center" >
            <
            h1 className = "text-3xl font-bold text-gray-900 mb-4" >
            Certificate Verification <
            /h1> <
            div className = "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto" > < /div> <
            p className = "mt-4 text-gray-600" >
            Loading certificate verification... <
            /p> <
            /div> <
            /div>
        } >
        <
        VerifyCertificateClient / >
        <
        /Suspense>
    );
}