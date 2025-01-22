"use client";

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
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
	const pathname = usePathname(); // Get the current route path

	const navItems = [
		{
			href: "/student/home",
			label: "Home",
			icon: <FaHome className="text-lg" />,
		},
		{
			href: "/student/exam-dash",
			label: "Exams",
			icon: <FaFileAlt className="text-lg" />,
		},
		{
			href: "/result",
			label: "Result",
			icon: <FaClipboard className="text-lg" />,
		},
		{
			href: "/student/report",
			label: "Report",
			icon: <FaChartLine className="text-lg" />,
		},
		{
			href: "/student/student-fee",
			label: "Student Fee",
			icon: <FaMoneyBill className="text-lg" />,
		},
		{
			href: "/certification",
			label: "Certification",
			icon: <FaCertificate className="text-lg" />,
		},
		{
			href: "/ticket-mang",
			label: "Ticket Mang",
			icon: <FaTicketAlt className="text-lg" />,
		},
		{
			href: "/profile",
			label: "Profile",
			icon: <FaUser className="text-lg" />,
		},
	];

	return (
		<aside className="hidden lg:block w-64 bg-[#002349] text-white h-screen">
			<div className="p-6">
				{/* Logo */}
				<div className="flex items-center mb-10">
					<Link href="/" className="flex items-center">
						<div className="p-2 rounded-full">
							<Image
								src="/images/camsole-logo.png"
								alt="Logo"
								width={44}
								height={44}
							/>
						</div>
						<h1 className="ml-3 text-xl font-bold">CAMSOLE</h1>
					</Link>
				</div>

				{/* Navigation Menu */}
				<ul className="space-y-6">
					{navItems.map((item) => (
						<li key={item.href}>
							<Link
								href={item.href}
								className={`flex items-center gap-3 text-base font-medium py-2 px-4 rounded-lg transition-all duration-300
                  ${
										pathname === item.href
											? "bg-gradient-to-r from-[#E6F0FF] to-[#FBC37E] text-[#002349] scale-105 shadow-lg" // Active link with animation
											: "hover:bg-gradient-to-r hover:from-[#E6F0FF] hover:to-[#FBC37E] hover:text-[#002349] hover:scale-105" // Hover effect with animation
									}`}
							>
								{item.icon}
								{item.label}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</aside>
	);
}
