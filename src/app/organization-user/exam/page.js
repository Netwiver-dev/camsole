"use client";

import { useState } from "react";
import OngoingExams from "./OngoingExams";
import PastQuestions from "./PastQuestions";
import UpcomingExams from "./UpcomingExams";
import InputDetailsForm from "./InputDetailsForm"; // Import the form component

export default function QuestionBankPage() {
	const [step, setStep] = useState(1); // Tracks which step to display
	const [activeTab, setActiveTab] = useState("ongoing"); // Tracks active tab

	const handleProceed = () => {
		setStep(2); // Move to step 2 (tabs)
	};

	return (
		<div className="p-6 bg-gray-100 min-h-screen">
			{/* Step 1: Input Details Form */}
			{step === 1 && <InputDetailsForm onProceed={handleProceed} />}

			{/* Step 2: Tabs Section */}
			{step === 2 && (
				<>
					{/* Tabs */}
					<div className="flex items-center justify-between mb-6">
						<div className="flex gap-6">
							<button
								onClick={() => setActiveTab("ongoing")}
								className={`pb-2 ${
									activeTab === "ongoing"
										? "text-blue-600 border-b-2 border-blue-600 font-semibold"
										: "text-gray-600"
								}`}
							>
								Ongoing Exam
							</button>
							<button
								onClick={() => setActiveTab("upcoming")}
								className={`pb-2 ${
									activeTab === "upcoming"
										? "text-blue-600 border-b-2 border-blue-600 font-semibold"
										: "text-gray-600"
								}`}
							>
								Upcoming Exams
							</button>
							<button
								onClick={() => setActiveTab("past")}
								className={`pb-2 ${
									activeTab === "past"
										? "text-blue-600 border-b-2 border-blue-600 font-semibold"
										: "text-gray-600"
								}`}
							>
								Past Questions
							</button>
						</div>
						{/* Filter Button */}
						<button className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
							<span>Filter</span>
						</button>
					</div>

					{/* Dynamic Content */}
					{activeTab === "ongoing" && <OngoingExams />}
					{activeTab === "upcoming" && <UpcomingExams />}
					{activeTab === "past" && <PastQuestions />}
				</>
			)}
		</div>
	);
}
