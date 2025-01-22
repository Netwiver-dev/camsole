"use client"
import "../globals.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileBottomNav from "./MobileBottomNav";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
	const pathname = usePathname(); // Get the current route path

	// Check if the route includes "login"
	const isLoginRoute = pathname === "/student/login";

	return (
		<html lang="en">
			<body className="bg-gray-100">
				{/* If it's the login route, skip the layout */}
				{isLoginRoute ? (
					children
				) : (
					<div className="flex h-screen overflow-hidden">
						{/* Sidebar (Hidden on Mobile) */}
						<Sidebar />

						{/* Main Content Area */}
						<div className="flex-1 flex flex-col h-full">
							{/* Navbar */}
							<Navbar />

							{/* Dynamic Content */}
							<main className="flex-1 overflow-y-auto p-6">{children}</main>
						</div>

						{/* Mobile Bottom Navigation */}
						<MobileBottomNav />
					</div>
				)}
			</body>
		</html>
	);
}
