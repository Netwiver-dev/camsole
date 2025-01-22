"use client";

import Image from "next/image";
import Link from "next/link";
const NewExam = () => {
	const newExams = [
		{
			title: "English Language",
			description:
				"Lorem ipsum dolor sit amet consectetur. Integer sollicitudin at nisl sed eget.",
			duration: "1hr",
			date: "05/11/2024",
			image: "/images/exams/test.png",
		},
		{
			title: "Geography",
			description:
				"Lorem ipsum dolor sit amet consectetur. Integer sollicitudin at nisl sed eget.",
			duration: "1hr",
			date: "06/11/2024",
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
			title: "Geography",
			description:
				"Lorem ipsum dolor sit amet consectetur. Integer sollicitudin at nisl sed eget.",
			duration: "1hr",
			date: "06/11/2024",
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
			title: "Geography",
			description:
				"Lorem ipsum dolor sit amet consectetur. Integer sollicitudin at nisl sed eget.",
			duration: "1hr",
			date: "06/11/2024",
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
			title: "Geography",
			description:
				"Lorem ipsum dolor sit amet consectetur. Integer sollicitudin at nisl sed eget.",
			duration: "1hr",
			date: "06/11/2024",
			image: "/images/exams/test.png",
		},
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{newExams.map((exam, index) => (
				<div
					key={index}
					className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
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
						<Link href="/question-bank/question">View Questions</Link>
					</button>
				</div>
			))}
		</div>
	);
};

export default NewExam;
