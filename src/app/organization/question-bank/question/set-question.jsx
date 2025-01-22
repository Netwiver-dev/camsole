"use client";

import { useRouter } from "next/navigation";

export default function SetQuestion() {
	const router = useRouter();

	const handleNext = () => {
		router.push("/question-bank/congratulations");
	};

	return (
		<div className="p-6 bg-gray-100 min-h-screen">
			<div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
				<h2 className="text-lg font-semibold mb-4">Set Question</h2>

				{/* Question Input */}
				<div className="mb-4">
					<textarea
						placeholder="Enter your question here"
						className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					></textarea>
				</div>

				{/* Upload Image */}
				<div className="mb-4">
					<label className="block text-sm mb-2">Upload Image</label>
					<input
						type="file"
						className="border p-2 w-full rounded-md focus:outline-none"
					/>
				</div>

				{/* Answers */}
				<div className="space-y-3">
					<div className="flex items-center">
						<input type="radio" name="answer" className="mr-2" />
						<input
							type="text"
							placeholder="Enter answer"
							className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				{/* Next Button */}
				<div className="mt-6">
					<button
						onClick={handleNext}
						className="w-full py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
}
