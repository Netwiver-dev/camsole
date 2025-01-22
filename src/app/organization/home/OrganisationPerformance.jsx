export default function OrganisationPerformance() {
	const performanceData = [
		{
			label: "Students",
			value: 20,
			bgColor: "bg-orange-500",
			trackColor: "bg-orange-100",
		},
		{
			label: "Completed Exam",
			value: 90,
			bgColor: "bg-yellow-700",
			trackColor: "bg-yellow-100",
		},
		{
			label: "In progress Exam",
			value: 30,
			bgColor: "bg-blue-900",
			trackColor: "bg-blue-100",
		},
		{
			label: "Certificate",
			value: 70,
			bgColor: "bg-purple-500",
			trackColor: "bg-purple-100",
		},
		{
			label: "Result",
			value: 45,
			bgColor: "bg-blue-500",
			trackColor: "bg-blue-100",
		},
	];

	return (
		<div className="bg-white p-6 rounded-lg shadow">
			<h2 className="text-lg font-semibold text-gray-800 mb-4">
				Organisation Performance
			</h2>
			<div className="space-y-4">
				{performanceData.map((item, index) => (
					<div key={index}>
						{/* Label and Value */}
						<div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
							<span>{item.label}</span>
							<span>{item.value}%</span>
						</div>
						{/* Progress Bar */}
						<div className={`w-full ${item.trackColor} rounded-full h-2.5`}>
							<div
								className={`${item.bgColor} h-2.5 rounded-full`}
								style={{ width: `${item.value}%` }}
							></div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
