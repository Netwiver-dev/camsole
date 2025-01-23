"use client";

export default function InputDetailsForm({ onProceed }) {
	return (
		<div className="flex items-center justify-center  bg-gray-100">
			<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
				{/* Header */}
				<h2 className="text-lg font-semibold text-gray-700 mb-4">
					Input Your Details
				</h2>

				{/* Form */}
				<form
					onSubmit={(e) => {
						e.preventDefault(); // Prevent default form submission
						onProceed(); // Trigger the `onProceed` function
					}}
				>
					{/* Student ID */}
					<div className="mb-4">
						<label
							htmlFor="student-id"
							className="block text-sm font-medium text-gray-600 mb-1"
						>
							Student ID
						</label>
						<input
							type="text"
							id="student-id"
							placeholder="Enter your Student ID"
							className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Exam Password */}
					<div className="mb-6">
						<label
							htmlFor="exam-password"
							className="block text-sm font-medium text-gray-600 mb-1"
						>
							Exam Password
						</label>
						<input
							type="password"
							id="exam-password"
							placeholder="Enter your Exam Password"
							className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						className="w-full py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition"
					>
						Proceed
					</button>
				</form>
			</div>
		</div>
	);
}
