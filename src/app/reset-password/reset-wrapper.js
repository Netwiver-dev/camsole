"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamic import with SSR disabled can only be used in Client Components
const ResetPasswordClient = dynamic(() =>
    import ("./page-client"), {
        ssr: false,
        loading: () => ( <
            div className = "min-h-screen flex items-center justify-center" > { " " }
            Loading... { " " } <
            /div>
        ),
    });

export default function ResetPasswordWrapper() {
    return ( <
        Suspense fallback = { <
            div className = "min-h-screen flex items-center justify-center" > { " " }
            Loading... { " " } <
            /div>
        } >
        { " " } <
        ResetPasswordClient / >
        <
        /Suspense>
    );
}