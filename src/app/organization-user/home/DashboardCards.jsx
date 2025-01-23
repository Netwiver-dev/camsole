import { FaUsers, FaCertificate } from "react-icons/fa";

export default function DashboardCards() {
	const cards = [
		{
			label: "Students",
			count: 56,
			bgColor: "bg-orange-100",
			textColor: "text-orange-800",
			iconBg: "bg-orange-200",
			icon: <FaUsers className="text-orange-800 text-xl" />,
		},
		{
			label: "Certificate",
			count: 56,
			bgColor: "bg-purple-100",
			textColor: "text-purple-800",
			iconBg: "bg-purple-200",
			icon: <FaCertificate className="text-purple-800 text-xl" />,
		},
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			{cards.map((card, index) => (
				<div
					key={index}
					className={`flex items-center justify-between p-4 rounded-lg shadow ${card.bgColor}`}
				>
					{/* Icon */}
					<div
						className={`w-10 h-10 flex items-center justify-center rounded-full ${card.iconBg}`}
					>
						{card.icon}
					</div>

					{/* Text Content */}
					<div className="text-right">
						<p className="text-lg font-bold">{card.count}</p>
						<p className="text-sm font-medium text-gray-700">{card.label}</p>
					</div>
				</div>
			))}
		</div>
	);
}
