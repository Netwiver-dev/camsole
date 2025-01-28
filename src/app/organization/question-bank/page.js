"use client";

import { useState } from "react";
import NewExam from "./new-exam";
import TakenExam from "./taken-exam";

export default function QuestionBankPage() {
	const [activeTab, setActiveTab] = useState("new");

	return (
		<div className="p-6 bg-gray-100 min-h-screen">
			{/* Tabs */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex gap-6">
					<button
						onClick={() => setActiveTab("new")}
						className={`pb-2 ${
							activeTab === "new"
								? "text-blue-600 border-b-2 border-blue-600 font-semibold"
								: "text-gray-600"
						}`}
					>
						New Exam
					</button>
					<button
						onClick={() => setActiveTab("taken")}
						className={`pb-2 ${
							activeTab === "taken"
								? "text-blue-600 border-b-2 border-blue-600 font-semibold"
								: "text-gray-600"
						}`}
					>
						Taken Exam
					</button>
				</div>
			</div>

			{/* Dynamic Content */}
			{activeTab === "new" ? <NewExam /> : <TakenExam />}
		</div>
	);
}
