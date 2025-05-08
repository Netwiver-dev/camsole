"use client";

import { useEffect } from "react";

export default function ClientLayout({ children }) {
    // This component doesn't need to wrap children in AuthProvider since that's already done in layout.js
    return < > { children } < />;
}