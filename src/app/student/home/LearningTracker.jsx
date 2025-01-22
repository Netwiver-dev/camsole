"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function LearningTracker() {
	// Chart Data
	const data = {
		labels: [
			"Examination 30% Completed",
			"Assignment 50% Completed",
			"Others 20% Completed",
		],
		datasets: [
			{
				data: [30, 50, 20], // Percentage values
				backgroundColor: ["#1E88E5", "#E3DFFF", "#FB8C00"], // Chart segment colors
				hoverBackgroundColor: ["#1976D2", "#D0CCF4", "#F57C00"], // Colors on hover
				borderWidth: 0, // No border
			},
		],
	};

	// Chart Options
	const options = {
		cutout: "70%", // Creates the inner white space for a "donut" effect
		plugins: {
			legend: {
				display: false, // Hides the default Chart.js legend
			},
		},
		responsive: true,
		maintainAspectRatio: false,
	};

	return (
		<div className="bg-white p-6 rounded-lg  overflow-y-auto">
			{/* Title */}
			<h3 className="text-lg font-semibold text-blue-800 mb-6">
				Learning Tracker
			</h3>

			{/* Chart Container */}
			<div className="flex flex-col items-center mb-6">
				<div className="relative w-40 h-40">
					<Doughnut data={data} options={options} />
					<div className="flex items-center justify-center absolute inset-0 text-xl font-bold text-gray-800">
						100%
					</div>
				</div>
			</div>

			{/* Legend */}
			<ul className="space-y-2 text-sm">
				<li className="flex items-center">
					<span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
					Examination 30% Completed
				</li>
				<li className="flex items-center">
					<span className="w-3 h-3 rounded-full bg-purple-300 mr-2"></span>
					Assignment 50% Completed
				</li>
				<li className="flex items-center">
					<span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
					Others 20% Completed
				</li>
			</ul>
		</div>
	);
}
