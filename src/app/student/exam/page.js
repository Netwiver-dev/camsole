"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { submitExamResult } from "../../lib/examApi";

const formatTime = (timeInSeconds) => {
	const hours = Math.floor(timeInSeconds / 3600);
	const minutes = Math.floor((timeInSeconds % 3600) / 60);
	const seconds = timeInSeconds % 60;
	return `${hours.toString().padStart(2, "0")}:${minutes
		.toString()
		.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const ExamPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const examId = searchParams.get("examId");
	const [examData, setExamData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [timeRemaining, setTimeRemaining] = useState(0);
	const [answers, setAnswers] = useState([]);

	useEffect(() => {
		if (!examId) return;
		async function loadExam() {
			const res = await fetch(`/api/exams?examId=${examId}`);
			const data = await res.json();
			setExamData(data);
			const [hours, minutes] = data.duration.split(":");
			const seconds = parseInt(hours) * 3600 + parseInt(minutes) * 60;
			setTimeRemaining(seconds);
			setAnswers(Array(data.questions.length).fill(null));
			setLoading(false);
		}
		loadExam();
	}, [examId]);

	// start countdown
	useEffect(() => {
		if (loading) return;
		const timer = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					handleSubmitExam();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(timer);
	}, [loading]);

	if (loading) return <div> Loading exam... </div>;

	const totalQuestions = examData.questions.length;
	const question = examData.questions[currentQuestion];

	const handleSubmitExam = async () => {
		// Replace with actual examId and studentName
		const examId = "EXAM_OBJECT_ID"; // Get this from the exam data
		const studentName = "Folajimi Mathew"; // Get from user context
		try {
			await submitExamResult({
				examId,
				studentName,
				answers: Object.values(answers),
			});
			router.push("/result");
		} catch (e) {
			alert("Failed to submit result");
		}
	};

	const handleEndExam = () => {
		if (window.confirm("Are you sure you want to end the exam?")) {
			handleSubmitExam();
		}
	};

	const handleNext = () => {
		if (currentQuestion < totalQuestions - 1) {
			setCurrentQuestion((prev) => prev + 1);
			setSelectedAnswer(answers[currentQuestion + 1] || "");
		}
	};

	const handlePrevious = () => {
		if (currentQuestion > 0) {
			setSelectedAnswer(answers[currentQuestion - 1] || "");
		}
	};

	const handleAnswerSelect = (answerId) => {
		setSelectedAnswer(answerId);
		setAnswers((prev) => ({
			...prev,
			[currentQuestion]: answerId,
		}));
	};

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
			{" "}
			{/* Header */}{" "}
			<div className="flex justify-between items-center mb-6">
				<div>
					<h2 className="text-lg font-medium"> Subject: {examData.title} </h2>{" "}
				</div>{" "}
				<div className="flex items-center gap-4">
					<div className="text-right">
						<div className="text-sm text-gray-500"> Time Remaining </div>{" "}
						<div className="text-xl font-bold">
							{" "}
							{formatTime(timeRemaining)}{" "}
						</div>{" "}
					</div>{" "}
					<button
						onClick={handleEndExam}
						className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
					>
						End Exam{" "}
					</button>{" "}
				</div>{" "}
			</div>
			{/* Progress Bar */}{" "}
			<div className="mb-8">
				<div className="flex justify-between text-sm text-gray-600 mb-2">
					<span> Exam Question Progress </span>{" "}
					<span>
						{" "}
						{currentQuestion + 1}/{totalQuestions}
					</span>
				</div>{" "}
				<div className="h-2 bg-gray-200 rounded-full">
					<div
						className="h-full bg-blue-500 rounded-full transition-all duration-300"
						style={{
							width: `${
								(answers.filter((a) => a !== null).length / totalQuestions) *
								100
							}%`,
						}}
					>
						{" "}
					</div>{" "}
				</div>{" "}
			</div>
			{/* Question */}{" "}
			<div className="mb-8">
				<p className="mb-4">
					<span className="font-medium"> {currentQuestion + 1}. </span>
					{question.text}{" "}
				</p>{" "}
				<div className="space-y-3">
					{" "}
					{question.options.map((opt, idx) => (
						<label
							key={idx}
							className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
						>
							<input
								type="radio"
								name="answer"
								value={idx}
								checked={selectedAnswer === idx}
								onChange={() => handleAnswerSelect(idx)}
								className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
							/>
							<span className="ml-3"> {opt} </span>{" "}
						</label>
					))}{" "}
				</div>{" "}
			</div>
			{/* Navigation Buttons */}{" "}
			<div className="flex justify-between">
				<button
					onClick={handlePrevious}
					disabled={currentQuestion === 0}
					className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Previous{" "}
				</button>{" "}
				<button
					onClick={handleNext}
					className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
				>
					Next{" "}
				</button>{" "}
			</div>{" "}
		</div>
	);
};

export default ExamPage;
