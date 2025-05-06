"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
	FaEye,
	FaCheck,
	FaTimes,
	FaUserGraduate,
	FaChartBar,
	FaDownload,
	FaClock,
	FaCalendarAlt,
} from "react-icons/fa";
import Link from "next/link";

const TakenExam = () => {
	const searchParams = useSearchParams();
	const examId = searchParams.get("id");

	const [exam, setExam] = useState(null);
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [result, setResult] = useState(null);
	const [loadingResult, setLoadingResult] = useState(false);

	// If no examId is provided, show the list of exams
	const [exams, setExams] = useState([]);

	useEffect(() => {
		if (examId) {
			fetchExamData();
		} else {
			fetchExams();
		}
	}, [examId]);

	const fetchExams = async () => {
		try {
			setLoading(true);

			const response = await fetch("/api/exams/teacher");

			if (!response.ok) {
				throw new Error("Failed to fetch exams");
			}

			const data = await response.json();
			setExams(data);
		} catch (err) {
			console.error("Error fetching exams:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const fetchExamData = async () => {
		try {
			setLoading(true);

			// Fetch exam details
			const examResponse = await fetch(`/api/exams/${examId}`);
			if (!examResponse.ok) {
				throw new Error("Failed to fetch exam");
			}
			const examData = await examResponse.json();
			setExam(examData);

			// Fetch students who have taken this exam
			const studentsResponse = await fetch(`/api/exams/${examId}/students`);
			if (!studentsResponse.ok) {
				throw new Error("Failed to fetch student data");
			}
			const studentsData = await studentsResponse.json();
			setStudents(studentsData);
		} catch (err) {
			console.error("Error fetching exam data:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const fetchStudentResult = async (studentId) => {
		try {
			setLoadingResult(true);

			const response = await fetch(
				`/api/exams/${examId}/results?studentId=${studentId}`
			);

			if (!response.ok) {
				throw new Error("Failed to fetch result");
			}

			const data = await response.json();
			setResult(data);
			setSelectedStudent(studentId);
		} catch (err) {
			console.error("Error fetching student result:", err);
			alert(`Error: ${err.message}`);
		} finally {
			setLoadingResult(false);
		}
	};

	const handleDownloadResult = async (resultId) => {
		try {
			// Trigger PDF download
			const response = await fetch(`/api/results/${resultId}/pdf`);

			if (!response.ok) {
				throw new Error("Failed to download result");
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `result-${resultId}.pdf`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (err) {
			console.error("Error downloading result:", err);
			alert(`Error: ${err.message}`);
		}
	};

	const handleIssueCertificate = async (studentId, resultId) => {
		try {
			const response = await fetch("/api/certificates", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					examId,
					userId: studentId,
					resultId,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to issue certificate");
			}

			// Refresh result data to show certificate status
			fetchStudentResult(studentId);
			alert("Certificate issued successfully!");
		} catch (err) {
			console.error("Error issuing certificate:", err);
			alert(`Error: ${err.message}`);
		}
	};

	const formatDate = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4">
				<p className="font-bold">Error</p>
				<p>{error}</p>
			</div>
		);
	}

	// If no examId is provided, show the list of exams
	if (!examId) {
		if (exams.length === 0) {
			return (
				<div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow text-center">
					<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
						<FaChartBar className="text-gray-400 text-2xl" />
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No exams found
					</h3>
					<p className="text-gray-500 mb-4">
						You haven't created any exams yet.
					</p>
					<Link
						href="/organization/examination-setup"
						className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
					>
						Create Your First Exam
					</Link>
				</div>
			);
		}

		return (
			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{exams.map((exam) => (
						<div
							key={exam._id}
							className="bg-white rounded-lg shadow hover:shadow-md transition duration-200"
						>
							<div className="p-6">
								<h3 className="text-xl font-semibold mb-2">{exam.title}</h3>

								<p className="text-sm text-gray-600 mb-4 line-clamp-2">
									{exam.description || "No description provided"}
								</p>

								<div className="flex justify-between text-sm text-gray-500 mb-4">
									<div>Date: {formatDate(exam.date)}</div>
									<div>Duration: {exam.duration} min</div>
								</div>

								<div className="border-t border-gray-100 pt-4 mt-2">
									<div className="grid grid-cols-3 gap-2 text-center mb-4">
										<div className="bg-blue-50 rounded p-2">
											<p className="text-sm text-gray-500">Questions</p>
											<p className="font-semibold text-blue-600">
												{exam.questions?.length || 0}
											</p>
										</div>

										<div className="bg-green-50 rounded p-2">
											<p className="text-sm text-gray-500">Attempts</p>
											<p className="font-semibold text-green-600">
												{exam.stats?.attempts || 0}
											</p>
										</div>

										<div className="bg-purple-50 rounded p-2">
											<p className="text-sm text-gray-500">Avg Score</p>
											<p className="font-semibold text-purple-600">
												{exam.stats?.averageScore || 0}%
											</p>
										</div>
									</div>

									<Link
										href={`/organization/question-bank/taken-exam?id=${exam._id}`}
										className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-2"
									>
										<FaEye className="mr-2" />
										View Results
									</Link>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
};

export default TakenExam;
