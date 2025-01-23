"use client";

import { usePathname } from "next/navigation";
import { FaHome, FaTasks, FaAward, FaQuestionCircle } from "react-icons/fa";

export default function MobileBottomNav() {
	const pathname = usePathname(); // Get the current route path

	// Reuse the same navItems from Sidebar
	const navItems = [
		{
			href: "/organization/home",
			label: "Home",
			icon: <FaHome className="text-lg" />,
		},
		{
			href: "/organization/examination-setup",
			label: "Examination Setup",
			icon: <FaTasks className="text-lg" />,
		},
		{
			href: "/organization/certification",
			label: "Certification",
			icon: <FaAward className="text-lg" />,
		},
		{
			href: "/organization/question-bank",
			label: "Question Bank",
			icon: <FaQuestionCircle className="text-lg" />,
		},
	];

	return (
		<nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-between px-6 py-3">
			{navItems.map((item) => (
				<a
					key={item.href}
					href={item.href}
					className={`flex flex-col items-center text-gray-500 ${
						pathname === item.href ? "text-blue-500" : "hover:text-blue-500"
					}`}
				>
					{item.icon}
					<span className="text-xs mt-1">{item.label}</span>
				</a>
			))}
		</nav>
	);
}
