
import "../../globals.css";
import Sidebar from "../dashboard/Sidebar";
import Navbar from "../dashboard/Navbar";
import MobileBottomNav from "../dashboard/MobileBottomNav";

export default function RootLayout({ children }) {
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
                        <main className="flex-1 overflow-y-auto p-6">{children}</main>
                    </div>
                </div>

                {/* Mobile Bottom Navigation */}
                <MobileBottomNav />
            </body>
        </html>
    );
}
