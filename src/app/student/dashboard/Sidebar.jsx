import {
	FaHome,
	FaFileAlt,
	FaClipboard,
	FaChartLine,
	FaMoneyBill,
	FaCertificate,
	FaTicketAlt,
	FaUser,
} from "react-icons/fa";

export default function Sidebar() {
	return (
		<aside className="hidden lg:block w-64 bg-[#002349] text-white h-screen">
			<div className="p-6">
				{/* Logo */}
				<div className="flex items-center mb-10">
					<div className="p-2 rounded-full">
						<img src="/images/camsole-logo.png" alt="Logo" className="w-6 h-6" />{" "}
						{/* Replace with actual logo path */}
					</div>
					<h1 className="ml-3 text-xl font-bold">CAMSOLE</h1>
				</div>

				{/* Navigation Menu */}
				<ul className="space-y-6">
					{/* Home */}
					<li>
						<a
							href="/home"
							className="flex items-center gap-3 text-base font-medium py-2 px-4 rounded-lg transition-all duration-300 
                hover:bg-gradient-to-r hover:from-[#E6F0FF] hover:to-[#FBC37E] hover:text-[#002349]"
						>
							<FaHome className="text-lg" />
							Home
						</a>
					</li>
					{/* Exams */}
					<li>
						<a
							href="/exams"
							className="flex items-center gap-3 text-base font-medium py-2 px-4 rounded-lg transition-all duration-300 
                hover:bg-gradient-to-r hover:from-[#E6F0FF] hover:to-[#FBC37E] hover:text-[#002349]"
						>
							<FaFileAlt className="text-lg" />
							Exams
						</a>
					</li>
					{/* Result */}
					<li>
						<a
							href="/result"
							className="flex items-center gap-3 text-base font-medium py-2 px-4 rounded-lg transition-all duration-300 
                hover:bg-gradient-to-r hover:from-[#E6F0FF] hover:to-[#FBC37E] hover:text-[#002349]"
						>
							<FaClipboard className="text-lg" />
							Result
						</a>
					</li>
					{/* Report */}
					<li>
						<a
							href="/report"
							className="flex items-center gap-3 text-base font-medium py-2 px-4 rounded-lg transition-all duration-300 
                hover:bg-gradient-to-r hover:from-[#E6F0FF] hover:to-[#FBC37E] hover:text-[#002349]"
						>
							<FaChartLine className="text-lg" />
							Report
						</a>
					</li>
					{/* Student Fee */}
					<li>
						<a
							href="/student-fee"
							className="flex items-center gap-3 text-base font-medium py-2 px-4 rounded-lg transition-all duration-300 
                hover:bg-gradient-to-r hover:from-[#E6F0FF] hover:to-[#FBC37E] hover:text-[#002349]"
						>
							<FaMoneyBill className="text-lg" />
							Student Fee
						</a>
					</li>
					{/* Certification */}
					<li>
						<a
							href="/certification"
							className="flex items-center gap-3 text-base font-medium py-2 px-4 rounded-lg transition-all duration-300 
                hover:bg-gradient-to-r hover:from-[#E6F0FF] hover:to-[#FBC37E] hover:text-[#002349]"
						>
							<FaCertificate className="text-lg" />
							Certification
						</a>
					</li>
					{/* Ticket Management */}
					<li>
						<a
							href="/ticket-mang"
							className="flex items-center gap-3 text-base font-medium py-2 px-4 rounded-lg transition-all duration-300 
                hover:bg-gradient-to-r hover:from-[#E6F0FF] hover:to-[#FBC37E] hover:text-[#002349]"
						>
							<FaTicketAlt className="text-lg" />
							Ticket Mang
						</a>
					</li>
					{/* Profile */}
					<li>
						<a
							href="/profile"
							className="flex items-center gap-3 text-base font-medium py-2 px-4 rounded-lg transition-all duration-300 
                hover:bg-gradient-to-r hover:from-[#E6F0FF] hover:to-[#FBC37E] hover:text-[#002349]"
						>
							<FaUser className="text-lg" />
							Profile
						</a>
					</li>
				</ul>
			</div>
		</aside>
	);
}
