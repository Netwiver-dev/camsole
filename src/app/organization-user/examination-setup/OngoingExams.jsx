"use client";

import Image from "next/image";

export default function OngoingExams() {
	const ongoingExams = [
		{
			title: "English Language",
			description:
				"Lorem ipsum dolor sit amet consectetur. Integer sollicitudin at nisl sed eget.",
			duration: "1hr",
			date: "05/11/2024",
			image: "/images/exams/test.png",
		},
		{
			title: "Mathematics",
			description:
				"Lorem ipsum dolor sit amet consectetur. Integer sollicitudin at nisl sed eget.",
			duration: "1hr",
			date: "05/11/2024",
			image: "/images/exams/test.png",
		},
		{
			title: "Chemistry",
			description:
				"Lorem ipsum dolor sit amet consectetur. Integer sollicitudin at nisl sed eget.",
			duration: "1hr",
			date: "05/11/2024",
			image: "/images/exams/test.png",
		},
		{
			title: "English Language",
			description:
				"Lorem ipsum dolor sit amet consectetur. Integer sollicitudin at nisl sed eget.",
			duration: "1hr",
			date: "05/11/2024",
			image: "/images/exams/test.png",
		},
		{
			title: "Mathematics",
			description:
				"Lorem ipsum dolor sit amet consectetur. Integer sollicitudin at nisl sed eget.",
			duration: "1hr",
			date: "05/11/2024",
			image: "/images/exams/test.png",
		},
		{
			title: "Chemistry",
			description:
				"Lorem ipsum dolor sit amet consectetur. Integer sollicitudin at nisl sed eget.",
			duration: "1hr",
			date: "05/11/2024",
			image: "/images/exams/test.png",
		},
		{
			title: "English Language",
			description:
				"Lorem ipsum dolor sit amet consectetur. Integer sollicitudin at nisl sed eget.",
			duration: "1hr",
			date: "05/11/2024",
			image: "/images/exams/test.png",
		},
		{
			title: "Mathematics",
			description:
				"Lorem ipsum dolor sit amet consectetur. Integer sollicitudin at nisl sed eget.",
			duration: "1hr",
			date: "05/11/2024",
			image: "/images/exams/test.png",
		},
		{
			title: "Chemistry",
			description:
				"Lorem ipsum dolor sit amet consectetur. Integer sollicitudin at nisl sed eget.",
			duration: "1hr",
			date: "05/11/2024",
			image: "/images/exams/test.png",
		},
	];

	return (
		<div>
			<h2 className="text-lg font-semibold text-gray-800 mb-4">Exams</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{ongoingExams.map((exam, index) => (
					<div
						key={index}
						className="bg-white p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
					>
						<Image
							src={exam.image}
							alt={exam.title}
							width={500}
							height={200}
							className="w-full h-32 object-cover rounded-lg mb-4"
						/>
						<h3 className="text-sm font-medium text-gray-800">{exam.title}</h3>
						<p className="text-xs text-gray-500">{exam.description}</p>
						<div className="mt-4 flex items-center justify-between text-xs text-gray-500">
							<p>📅 {exam.date}</p>
							<p>⏱ {exam.duration}</p>
						</div>
						<button className="mt-4 w-full py-2 text-sm font-medium bg-orange-500 text-white rounded-md hover:bg-orange-600">
							Take Exam
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
