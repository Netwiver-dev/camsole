"use client";
import {
	FaWhatsapp,
	FaTelegram,
	FaLinkedin,
	FaFacebook,
	FaInstagram,
} from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { useState } from "react";

export default function QuestionDetails() {
	const [currentStep, setCurrentStep] = useState(1); // Step tracker: 1 = Question Details, 2 = Set Question, 3 = Congratulations

	// Step Handlers
	const goToNextStep = () => setCurrentStep((prev) => prev + 1);

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center">
			<div className=" rounded-lg w-full max-w-4xl">
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
		<div className=" bg-gray-100 flex items-center justify-center">
			<div className=" p-6  w-full max-w-5xl">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-lg font-semibold text-[#002349]">History</h2>
					<div className="flex gap-4">
						<button className="px-4 py-2 bg-gray-200 text-sm font-medium rounded-md hover:bg-gray-300">
							Preview
						</button>
						<button className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-md hover:bg-orange-600">
							Upload
						</button>
					</div>
				</div>

				{/* Form Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Section */}
					<div className="lg:col-span-2 space-y-6">
						{/* Question */}
						<div>
							<h3 className="text-sm font-medium text-gray-700 mb-2">
								Set Question
							</h3>
							<textarea
								placeholder="Enter your question here"
								className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							></textarea>
							<button className="mt-2 text-sm text-blue-500 hover:underline flex items-center">
								🌟 Generate With AI
							</button>
						</div>

						{/* Upload Image */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Upload Image
							</label>
							<div className="border border-dashed border-gray-300 p-6 rounded-md text-center">
								<p className="text-sm text-gray-500">
									Drag & drop or click to choose file
								</p>
								<p className="text-xs text-gray-400">Max file size: 10mb</p>
							</div>
						</div>

						{/* Options */}
						<div className="space-y-3">
							{[
								"A. Donald Trump",
								"B. Dapo Abiodun",
								"C. Joe Biden",
								"D. Kamala Harris",
							].map((option, index) => (
								<label
									key={index}
									className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:shadow-md"
								>
									<input
										type="radio"
										name="answer"
										className="mr-4 accent-blue-500"
									/>
									<span className="text-sm text-gray-700">{option}</span>
								</label>
							))}
						</div>

						{/* Next Button */}
						<button
							onClick={onNext}
							className="w-full mt-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600"
						>
							Next
						</button>
					</div>

					{/* Side Section */}
					<div className="space-y-4 bg-gray-50 p-4 rounded-md shadow-md">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Question Type
							</label>
							<select className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
								<option value="">Select</option>
								<option value="mcq">MCQ</option>
								<option value="essay">Essay</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Answer Type
							</label>
							<select className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
								<option value="">Select</option>
								<option value="single">Single Answer</option>
								<option value="multiple">Multiple Answers</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Exam Time
							</label>
							<input
								type="text"
								placeholder="e.g., 1 hour"
								className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Point Per Question
							</label>
							<select className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
								<option value="">Select</option>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
// Step 3: Congratulations Component
 function Congratulations() {
		const [copied, setCopied] = useState(false);
		const shareLink = "https://www.figma.com/design/sample-link";

		const handleCopy = () => {
			navigator.clipboard.writeText(shareLink);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
		};

		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
					{/* Title */}
					<h2 className="text-xl font-semibold text-[#002349] mb-2">
						Congratulations
					</h2>
					<p className="text-sm text-gray-700 mb-6">
						You've Successfully Setup Your Exam
					</p>

					{/* Social Media Icons */}
					<p className="text-sm text-gray-500 mb-4">Share Your Exam With</p>
					<div className="flex justify-center space-x-4 mb-6">
						<button className="text-green-500 text-xl hover:scale-110 transition">
							<FaWhatsapp />
						</button>
						<button className="text-blue-500 text-xl hover:scale-110 transition">
							<FaTelegram />
						</button>
						<button className="text-blue-700 text-xl hover:scale-110 transition">
							<FaLinkedin />
						</button>
						<button className="text-blue-600 text-xl hover:scale-110 transition">
							<FaFacebook />
						</button>
						<button className="text-pink-500 text-xl hover:scale-110 transition">
							<FaInstagram />
						</button>
					</div>

					{/* Share Link Section */}
					<p className="text-sm text-gray-500 mb-2">or share with link</p>
					<div className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 bg-gray-50">
						<p className="text-sm text-gray-600 truncate">{shareLink}</p>
						<button
							onClick={handleCopy}
							className="text-gray-500 hover:text-gray-800 transition"
						>
							<FiCopy />
						</button>
					</div>
					{copied && (
						<p className="text-xs text-green-500 mt-2">
							Link copied to clipboard!
						</p>
					)}
				</div>
			</div>
		);
 }