import "../../globals.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileBottomNav from "./MobileBottomNav";

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="bg-gray-100">
				<div className="flex min-h-screen">
					{/* Sidebar (Hidden on Mobile) */}
					<Sidebar />

					{/* Main Content Area */}
					<div className="flex-1 flex flex-col">
						{/* Navbar */}
						<Navbar />

						{/* Dynamic Content */}
						<main className="flex-1 p-6">{children}</main>
					</div>
				</div>

				{/* Mobile Bottom Navigation */}
				<MobileBottomNav />
			</body>
		</html>
	);
}
