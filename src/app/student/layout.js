"use client";

import "../globals.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileBottomNav from "./MobileBottomNav";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
	const pathname = usePathname(); // Get the current route path
	const [isLoading, setIsLoading] = useState(true); // Loading state for children

	// Check if the route includes "login"
	const isLoginRoute = pathname === "/student/login";

	// Simulate content loading with useEffect
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false); // Simulate loading completion
		}, 500); // Adjust this duration as needed (500ms for demo)

		return () => clearTimeout(timer); // Cleanup timer
	}, [pathname]);

	// Skeleton Loader Component
	const SkeletonLoader = () => (
		<div className="animate-pulse space-y-4">
			<div className="h-6 bg-gray-300 rounded w-3/4"></div>
			<div className="h-6 bg-gray-300 rounded w-1/2"></div>
			<div className="h-48 bg-gray-300 rounded"></div>
		</div>
	);

	return (
		<html lang="en">
			<body className="bg-gray-100">
				{/* If it's the login route, skip the layout */}
				{isLoginRoute ? (
					children // Render the login page immediately
				) : (
					<div className="flex h-screen overflow-hidden">
						{/* Sidebar (Hidden on Mobile) */}
						<Sidebar />

						{/* Main Content Area */}
						<div className="flex-1 flex flex-col h-full">
							{/* Navbar */}
							<Navbar />

							{/* Dynamic Content */}
							<main className="flex-1 overflow-y-auto ">
								{isLoading ? <SkeletonLoader /> : children}
							</main>
						</div>

						{/* Mobile Bottom Navigation */}
						<MobileBottomNav />
					</div>
				)}
			</body>
		</html>
	);
}
