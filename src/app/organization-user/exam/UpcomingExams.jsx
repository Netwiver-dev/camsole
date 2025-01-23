"use client";

import Image from "next/image";

export default function UpcomingExams() {
	const upcomingExams = [
		{
			title: "Physics",
			description:
				"This exam will cover advanced topics in mechanics and thermodynamics.",
			duration: "1hr 30min",
			date: "12/12/2024",
			image: "/images/exams/test.png",
			startsIn: 5, // Days until the exam starts
		},
		{
			title: "Geography",
			description: "This exam will focus on physical geography and cartography.",
			duration: "2hrs",
			date: "15/12/2024",
			image: "/images/exams/test.png",
			startsIn: 8,
		},
		{
			title: "English Literature",
			description: "Analyze classic literature and poetry for this exam.",
			duration: "1hr 15min",
			date: "18/12/2024",
			image: "/images/exams/test.png",
			startsIn: 10,
		},
		{
			title: "Physics",
			description:
				"This exam will cover advanced topics in mechanics and thermodynamics.",
			duration: "1hr 30min",
			date: "12/12/2024",
			image: "/images/exams/test.png",
			startsIn: 5, // Days until the exam starts
		},
		{
			title: "Geography",
			description: "This exam will focus on physical geography and cartography.",
			duration: "2hrs",
			date: "15/12/2024",
			image: "/images/exams/test.png",
			startsIn: 8,
		},
		{
			title: "English Literature",
			description: "Analyze classic literature and poetry for this exam.",
			duration: "1hr 15min",
			date: "18/12/2024",
			image: "/images/exams/test.png",
			startsIn: 10,
		},
	];

	return (
		<div>
			<h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Exams</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{upcomingExams.map((exam, index) => (
					<div
						key={index}
						className="bg-white p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
					>
						{/* Exam Image */}
						<Image
							src={exam.image}
							alt={exam.title}
							width={500}
							height={200}
							className="w-full h-32 object-cover rounded-lg mb-4"
						/>
						{/* Exam Info */}
						<div>
							<h3 className="text-sm font-medium text-gray-800">{exam.title}</h3>
							<p className="text-xs text-gray-500 mb-2">{exam.description}</p>
							<p className="text-xs text-gray-400">
								📅 {exam.date} | ⏱ {exam.duration}
							</p>
							<p className="text-xs text-green-600 mt-1 font-semibold">
								Starts in {exam.startsIn} days
							</p>
						</div>
						{/* More Info Button */}
						<button className="mt-4 w-full py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600">
							More Info
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
