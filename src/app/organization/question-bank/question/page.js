"use client";

import { useRouter } from "next/navigation";

export default function QuestionDetails() {
	const router = useRouter();

	const handleProceed = (e) => {
		e.preventDefault();
		router.push("/question-bank/set-question");
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center">
			<div className="bg-white p-6 rounded-lg shadow w-full max-w-3xl">
				<h2 className="text-lg font-semibold text-gray-800 mb-6">
					Question Details
				</h2>
				<form
					className="grid grid-cols-1 md:grid-cols-2 gap-4"
					onSubmit={handleProceed}
				>
					{/* Exam Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Exam Name
						</label>
						<input
							type="text"
							className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Description
						</label>
						<input
							type="text"
							className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					{/* Date */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Date
						</label>
						<input
							type="date"
							className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					{/* Time */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Time
						</label>
						<input
							type="time"
							className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					{/* Start Time */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Start Time
						</label>
						<input
							type="time"
							className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					{/* End Time */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							End Time
						</label>
						<input
							type="time"
							className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
				</form>

				{/* Proceed Button */}
				<div className="mt-6">
					<button
						type="submit"
						onClick={handleProceed}
						className="w-full py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600"
					>
						Proceed
					</button>
				</div>
			</div>
		</div>
	);
}
