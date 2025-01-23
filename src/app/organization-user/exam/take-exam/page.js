"use client";

import { useState, useEffect } from "react";

// Mock API call to fetch questions
const fetchQuestions = async () => {
	return [
		{
			id: 1,
			question:
				"The product of atomic mass and metal specific heat is about 6.4. This information was provided by",
			options: ["Dalton's Law", "Newton's Law", "Boyle's Law", "Avogadro's Law"],
			correctAnswer: 0,
		},
		{
			id: 2,
			question: "What is the capital of France?",
			options: ["Berlin", "Madrid", "Paris", "Rome"],
			correctAnswer: 2,
		},
		{
			id: 3,
			question:
				"The product of atomic mass and metal specific heat is about 6.4. This information was provided by",
			options: ["Dalton's Law", "Newton's Law", "Boyle's Law", "Avogadro's Law"],
			correctAnswer: 0,
		},
		{
			id: 4,
			question: "What is the capital of France?",
			options: ["Berlin", "Madrid", "Paris", "Rome"],
			correctAnswer: 2,
		},
		{
			id: 5,
			question:
				"The product of atomic mass and metal specific heat is about 6.4. This information was provided by",
			options: ["Dalton's Law", "Newton's Law", "Boyle's Law", "Avogadro's Law"],
			correctAnswer: 0,
		},
		{
			id: 6,
			question: "What is the capital of France?",
			options: ["Berlin", "Madrid", "Paris", "Rome"],
			correctAnswer: 2,
		},
	];
};

export default function TakeExamPage() {
	const [questions, setQuestions] = useState([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState({});
	const [timeRemaining, setTimeRemaining] = useState(7200); // Timer in seconds (2 hours)
	const [showResult, setShowResult] = useState(false);

	// Fetch questions on mount
	useEffect(() => {
		const getQuestions = async () => {
			const data = await fetchQuestions();
			setQuestions(data);
		};
		getQuestions();
	}, []);

	// Timer functionality
	useEffect(() => {
		if (timeRemaining > 0 && !showResult) {
			const timer = setInterval(() => {
				setTimeRemaining((prev) => prev - 1);
			}, 1000);
			return () => clearInterval(timer);
		} else if (timeRemaining === 0) {
			handleSubmit();
		}
	}, [timeRemaining, showResult]);

	// Format time into HH:MM:SS
	const formatTime = (time) => {
		const hours = Math.floor(time / 3600);
		const minutes = Math.floor((time % 3600) / 60);
		const seconds = time % 60;
		return `${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	};

	// Handle answer selection
	const handleAnswer = (questionId, answerIndex) => {
		setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
	};

	// Handle navigation between questions
	const goToNextQuestion = () => {
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
		}
	};

	const goToPreviousQuestion = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex((prev) => prev - 1);
		}
	};

	// Handle submission
	const handleSubmit = () => {
		setShowResult(true);
	};

	// Calculate result
	const calculateResult = () => {
		let correct = 0;
		let total = questions.length;

		questions.forEach((q) => {
			if (answers[q.id] === q.correctAnswer) {
				correct++;
			}
		});

		return {
			correct,
			incorrect: total - correct,
			percentage: Math.round((correct / total) * 100),
		};
	};

	if (showResult) {
		const result = calculateResult();
		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
				<div className="bg-white p-6 rounded-md w-96">
					<h2 className="text-lg font-bold mb-4 text-center">Congratulations</h2>
					<p className="text-center font-semibold">Folajimi Mathew</p>
					<div className="text-center mt-4">
						<p>Points: {result.correct * 10}/{questions.length * 10}</p>
						<p>Grade: {result.percentage}B</p>
						<p>Duration: {formatTime(7200 - timeRemaining)}</p>
					</div>

					{/* Categories */}
					<div className="mt-6">
						<h3 className="text-sm font-semibold mb-2">Categories</h3>
						<div className="flex items-center">
							<span className="text-sm">Correct:</span>
							<div className="flex-1 mx-3 bg-gray-200 h-2 rounded">
								<div
									className="bg-orange-500 h-2 rounded"
									style={{ width: `${result.percentage}%` }}
								></div>
							</div>
							<span className="text-sm">{result.percentage}%</span>
						</div>
					</div>

					{/* Answers */}
					<div className="mt-6">
						<p>Correct: {result.correct}</p>
						<p>Incorrect: {result.incorrect}</p>
					</div>

					{/* Close Button */}
					<button
						className="mt-6 w-full py-2 bg-orange-500 text-white font-medium rounded-md"
						onClick={() => setShowResult(false)}
					>
						Close
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 bg-gray-100 min-h-screen">
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<div>
					<p className="text-sm text-gray-500">Subject: Chemistry</p>
					<p className="text-sm text-gray-500">
						Exam Question Progress: {currentQuestionIndex + 1}/{questions.length}
					</p>
				</div>
				<div className="text-sm text-gray-500">Time Remaining: {formatTime(timeRemaining)}</div>
			</div>

			{/* Progress Bar */}
			<div className="w-full bg-gray-200 h-2 rounded mb-6">
				<div
					className="bg-blue-500 h-2 rounded"
					style={{
						width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
					}}
				></div>
			</div>

			{/* Question */}
			{questions.length > 0 && (
				<div className="bg-white p-6 rounded-md shadow-md">
					<p className="mb-4 font-semibold">
						{currentQuestionIndex + 1}. {questions[currentQuestionIndex].question}
					</p>
					<div className="space-y-4">
						{questions[currentQuestionIndex].options.map((option, idx) => (
							<label
								key={idx}
								className={`block p-3 border rounded-md cursor-pointer ${
									answers[questions[currentQuestionIndex].id] === idx
										? "border-blue-500 bg-blue-50"
										: "border-gray-200"
								}`}
							>
								<input
									type="radio"
									name={`question-${questions[currentQuestionIndex].id}`}
									checked={answers[questions[currentQuestionIndex].id] === idx}
									onChange={() =>
										handleAnswer(questions[currentQuestionIndex].id, idx)
									}
									className="hidden"
								/>
								{option}
							</label>
						))}
					</div>

					{/* Navigation Buttons */}
					<div className="flex justify-between mt-6">
						<button
							className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-200"
							disabled={currentQuestionIndex === 0}
							onClick={goToPreviousQuestion}
						>
							Previous
						</button>
						{currentQuestionIndex < questions.length - 1 ? (
							<button
								className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
								onClick={goToNextQuestion}
							>
								Next
							</button>
						) : (
							<button
								className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
								onClick={handleSubmit}
							>
								Submit
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
