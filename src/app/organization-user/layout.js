"use client";

import "../globals.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileBottomNav from "./MobileBottomNav";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function RootLayout({ children }) {
	const [isLoading, setIsLoading] = useState(true); // Loading state for children

	const pathname = usePathname(); // Get the current route path

	// Define routes that should bypass the dashboard layout
	const excludedRoutes = ["/organization-user/login", "/organization-user/signup"];

	// Check if the current route is an excluded route
	const isExcludedRoute = excludedRoutes.includes(pathname);

	// Simulate content loading with useEffect
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false); // Simulate loading completion
		}, 500); // Adjust this duration as needed (500ms for demo)

		return () => clearTimeout(timer); // Cleanup timer
	}, [pathname]);

	// If the route matches an excluded route, render only the `children`
	if (isExcludedRoute) {
		return (
			<html lang="en">
				<body className="bg-gray-100">{children}</body>
			</html>
		);
	}
	// Skeleton Loader Component
	const SkeletonLoader = () => (
		<div className="animate-pulse space-y-4">
			<div className="h-6 bg-gray-300 rounded w-3/4"></div>
			<div className="h-6 bg-gray-300 rounded w-1/2"></div>
			<div className="h-48 bg-gray-300 rounded"></div>
		</div>
	);

	// For other routes, render the dashboard layout
	return (
		<html lang="en">
			<body className="bg-gray-100">
				<div className="flex h-screen overflow-hidden">
					{/* Sidebar (Hidden on Mobile) */}
					<Sidebar />

					{/* Main Content Area */}
					<div className="flex-1 flex flex-col h-full">
						{/* Navbar */}
						<Navbar />
						{/* Dynamic Content */}
						<main className="flex-1 overflow-y-auto">
							{isLoading ? <SkeletonLoader /> : children}
						</main>{" "}
					</div>

					{/* Mobile Bottom Navigation */}
					<MobileBottomNav />
				</div>
			</body>
		</html>
	);
}
