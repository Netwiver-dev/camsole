"use client";

import { useState } from "react";

export default function ResultChecker() {
	const [examId, setExamId] = useState("");
	const [resultData, setResultData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	// Mock fetching data from the database
	const fetchResult = async () => {
		setIsLoading(true);
		// Simulate an API call
		setTimeout(() => {
			// Mock result data
			const data = {
				studentName: "Folajimi Mathew",
				subjects: [
					{
						name: "Chemistry",
						points: 70,
						grade: "70B",
						categories: { correct: 70, incorrect: 30 },
					},
					{
						name: "Physics",
						points: 70,
						grade: "70B",
						categories: { correct: 70, incorrect: 30 },
					},
				],
			};
			setResultData(data);
			setIsLoading(false);
		}, 1000);
	};

	// Print functionality
	const handlePrint = () => {
		window.print();
	};

	return (
		<div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-12">
			<h2 className="text-lg font-semibold text-gray-800 mb-6">
				Result Checker
			</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					fetchResult();
				}}
			>
				<div className="mb-6">
					<input
						type="text"
						value={examId}
						onChange={(e) => setExamId(e.target.value)}
						placeholder="Exam ID"
						className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<button
					type="submit"
					disabled={isLoading}
					className="w-full py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600"
				>
					{isLoading ? "Checking..." : "Check Result"}
				</button>
			</form>

			{/* Result Modal */}
			{resultData && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-6 rounded-md w-96 relative">
						{/* Close Button */}
						<button
							onClick={() => setResultData(null)}
							className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
						>
							&times;
						</button>

						{/* Result Details */}
						<h2 className="text-lg font-semibold mb-4">
							Student Name: {resultData.studentName}
						</h2>
						<div className="space-y-6">
							{resultData.subjects.map((subject, idx) => (
								<div key={idx} className="border-b pb-4">
									<h3 className="font-semibold text-gray-700">
										{subject.name}
									</h3>
									<p className="text-sm text-gray-600">
										Points: {subject.points} | Grade: {subject.grade}
									</p>
									<div className="space-y-2 mt-2">
										<div className="flex items-center">
											<span className="text-sm text-gray-600">Correct:</span>
											<div className="flex-1 ml-3 bg-gray-200 h-2 rounded">
												<div
													className="bg-orange-500 h-2 rounded"
													style={{ width: `${subject.categories.correct}%` }}
												></div>
											</div>
											<span className="text-sm ml-3 text-gray-600">
												{subject.categories.correct}%
											</span>
										</div>
										<div className="flex items-center">
											<span className="text-sm text-gray-600">Incorrect:</span>
											<div className="flex-1 ml-3 bg-gray-200 h-2 rounded">
												<div
													className="bg-gray-400 h-2 rounded"
													style={{ width: `${subject.categories.incorrect}%` }}
												></div>
											</div>
											<span className="text-sm ml-3 text-gray-600">
												{subject.categories.incorrect}%
											</span>
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Print Button */}
						<button
							onClick={handlePrint}
							className="mt-6 w-full py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600"
						>
							Print Result
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
