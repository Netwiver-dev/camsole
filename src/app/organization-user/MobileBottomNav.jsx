"use client";

import { usePathname } from "next/navigation";
import { FaHome, FaTasks, FaAward, FaCheckSquare } from "react-icons/fa";
export default function MobileBottomNav() {
	const pathname = usePathname(); // Get the current route path
	const navItems = [
		{
			href: "/organization-user/home",
			label: "Home",
			icon: <FaHome className="text-lg" />,
		},
		{
			href: "/organization-user/exam",
			label: "Exam",
			icon: <FaTasks className="text-lg" />,
		},
		{
			href: "/organization-user/certification",
			label: "Certification",
			icon: <FaAward className="text-lg" />,
		},
		{
			href: "/organization-user/result",
			label: "Result",
			icon: <FaCheckSquare className="text-lg" />,
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
