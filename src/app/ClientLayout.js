"use client";

import { AuthProvider } from "./lib/auth-context";

export default function ClientLayout({ children }) {
	return <AuthProvider> {children} </AuthProvider>;
}
