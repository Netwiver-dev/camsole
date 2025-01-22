"use client";

import { useState } from "react";

export default function QuestionDetails() {
	const [currentStep, setCurrentStep] = useState(1); // Step tracker: 1 = Question Details, 2 = Set Question, 3 = Congratulations

	// Step Handlers
	const goToNextStep = () => setCurrentStep((prev) => prev + 1);

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center">
			<div className="bg-white p-6 rounded-lg shadow w-full max-w-4xl">
				{currentStep === 1 && <QuestionDetailsForm onNext={goToNextStep} />}
				{currentStep === 2 && <SetQuestionForm onNext={goToNextStep} />}
				{currentStep === 3 && <Congratulations />}
			</div>
		</div>
	);
}

// Step 1: Question Details Form
function QuestionDetailsForm({ onNext }) {
	return (
		<>
			<h2 className="text-lg font-semibold text-gray-800 mb-6">
				Question Details
			</h2>
			<form className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Exam Name
					</label>
					<input
						type="text"
						className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Description
					</label>
					<input
						type="text"
						className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Date
					</label>
					<input
						type="date"
						className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Time
					</label>
					<input
						type="time"
						className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
			</form>
			<button
				onClick={onNext}
				className="w-full mt-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600"
			>
				Proceed
			</button>
		</>
	);
}

// Step 2: Set Question Form
function SetQuestionForm({ onNext }) {
	return (
		<>
			<h2 className="text-lg font-semibold mb-4">Set Question</h2>
			<div className="mb-4">
				<textarea
					placeholder="Enter your question here"
					className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				></textarea>
			</div>
			<div className="mb-4">
				<label className="block text-sm mb-2">Upload Image</label>
				<input
					type="file"
					className="border p-2 w-full rounded-md focus:outline-none"
				/>
			</div>
			<div className="space-y-3">
				{[...Array(4)].map((_, idx) => (
					<div key={idx} className="flex items-center">
						<input type="radio" name="answer" className="mr-2" />
						<input
							type="text"
							placeholder={`Option ${idx + 1}`}
							className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				))}
			</div>
			<button
				onClick={onNext}
				className="w-full mt-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600"
			>
				Next
			</button>
		</>
	);
}

// Step 3: Congratulations Component
function Congratulations() {
	return (
		<>
			<h2 className="text-lg font-semibold text-center mb-4">
				Congratulations!
			</h2>
			<p className="text-center mb-6">
				You’ve successfully setup your exam. Share your exam with:
			</p>
			<div className="flex items-center justify-center gap-4 mb-6">
				<button className="bg-green-500 text-white rounded-full p-3">
					WhatsApp
				</button>
				<button className="bg-blue-500 text-white rounded-full p-3">
					Telegram
				</button>
				<button className="bg-blue-700 text-white rounded-full p-3">
					LinkedIn
				</button>
			</div>
			<div className="flex items-center justify-between border p-3 rounded-md">
				<p className="text-sm truncate">https://exam-link.com/12345</p>
				<button className="text-blue-500 hover:underline">Copy</button>
			</div>
		</>
	);
}
