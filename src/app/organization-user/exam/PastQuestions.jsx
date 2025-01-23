"use client";

import Image from "next/image";

export default function PastQuestions() {
	const pastQuestions = [
		{
			title: "History Questions",
			description: "Past questions for History",
			image: "/images/exams/test.png",
			date: "10/12/2022",
		},
		{
			title: "Physics Questions",
			description: "Past questions for Physics",
			image: "/images/exams/test.png",
			date: "08/11/2022",
		},
		{
			title: "Math Questions",
			description: "Past questions for Mathematics",
			image: "/images/exams/test.png",
			date: "06/09/2022",
		},
		{
			title: "History Questions",
			description: "Past questions for History",
			image: "/images/exams/test.png",
			date: "10/12/2022",
		},
		{
			title: "Physics Questions",
			description: "Past questions for Physics",
			image: "/images/exams/test.png",
			date: "08/11/2022",
		},
		{
			title: "Math Questions",
			description: "Past questions for Mathematics",
			image: "/images/exams/test.png",
			date: "06/09/2022",
		},
		{
			title: "History Questions",
			description: "Past questions for History",
			image: "/images/exams/test.png",
			date: "10/12/2022",
		},
		{
			title: "Physics Questions",
			description: "Past questions for Physics",
			image: "/images/exams/test.png",
			date: "08/11/2022",
		},
		{
			title: "Math Questions",
			description: "Past questions for Mathematics",
			image: "/images/exams/test.png",
			date: "06/09/2022",
		},
	];

	return (
		<div>
			<h2 className="text-lg font-semibold text-gray-800 mb-4">
				Past Questions
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{pastQuestions.map((question, index) => (
					<div
						key={index}
						className="bg-white p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
					>
						<Image
							src={question.image}
							alt={question.title}
							width={500}
							height={200}
							className="w-full h-32 object-cover rounded-lg mb-4"
						/>
						<h3 className="text-sm font-medium text-gray-800">
							{question.title}
						</h3>
						<p className="text-xs text-gray-500">{question.description}</p>
						<p className="text-xs text-gray-400 mt-2">📅 {question.date}</p>
						<button className="mt-4 w-full py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600">
							View Questions
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
