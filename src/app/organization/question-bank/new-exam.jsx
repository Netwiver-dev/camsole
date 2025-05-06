"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	FaPlus,
	FaTrash,
	FaImage,
	FaCheck,
	FaSave,
	FaPaperPlane,
} from "react-icons/fa";

export default function CreateExam() {
	const router = useRouter();
	const [classes, setClasses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [saving, setSaving] = useState(false);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		date: "",
		duration: "01:00", // Default 1 hour
		questions: [createEmptyQuestion()],
		assignedTo: [],
		status: "draft",
	});

	// Helper to create an empty question
	function createEmptyQuestion() {
		return {
			text: "",
			image: "",
			options: [
				{ text: "", image: "" },
				{ text: "", image: "" },
				{ text: "", image: "" },
				{ text: "", image: "" },
			],
			correctAnswer: 0,
		};
	}

	// Fetch all classes for assignment
	useEffect(() => {
		const fetchClasses = async () => {
			try {
				const response = await fetch("/api/classes");
				if (!response.ok) {
					throw new Error("Failed to fetch classes");
				}
				const data = await response.json();
				setClasses(data);
			} catch (err) {
				console.error("Error fetching classes:", err);
				setError("Failed to load classes. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchClasses();
	}, []);

	// Handle basic form field changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Handle question text change
	const handleQuestionChange = (questionIndex, e) => {
		const { name, value } = e.target;
		setFormData((prev) => {
			const updatedQuestions = [...prev.questions];
			updatedQuestions[questionIndex] = {
				...updatedQuestions[questionIndex],
				[name]: value,
			};
			return { ...prev, questions: updatedQuestions };
		});
	};

	// Handle option change
	const handleOptionChange = (questionIndex, optionIndex, e) => {
		const { value } = e.target;
		setFormData((prev) => {
			const updatedQuestions = [...prev.questions];
			updatedQuestions[questionIndex].options[optionIndex] = {
				...updatedQuestions[questionIndex].options[optionIndex],
				text: value,
			};
			return { ...prev, questions: updatedQuestions };
		});
	};

	// Handle correct answer selection
	const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
		setFormData((prev) => {
			const updatedQuestions = [...prev.questions];
			updatedQuestions[questionIndex].correctAnswer = optionIndex;
			return { ...prev, questions: updatedQuestions };
		});
	};

	// Add new question
	const addQuestion = () => {
		setFormData((prev) => ({
			...prev,
			questions: [...prev.questions, createEmptyQuestion()],
		}));
	};

	// Remove a question
	const removeQuestion = (index) => {
		if (formData.questions.length <= 1) {
			return; // Keep at least one question
		}

		setFormData((prev) => {
			const updatedQuestions = [...prev.questions];
			updatedQuestions.splice(index, 1);
			return { ...prev, questions: updatedQuestions };
		});
	};

	// Handle class assignment
	const handleClassAssignment = (className) => {
		setFormData((prev) => {
			const assignedTo = [...prev.assignedTo];

			if (assignedTo.includes(className)) {
				// Remove class if already assigned
				return {
					...prev,
					assignedTo: assignedTo.filter((c) => c !== className),
				};
			} else {
				// Add class if not assigned
				return {
					...prev,
					assignedTo: [...assignedTo, className],
				};
			}
		});
	};

	// Convert image to base64 (for question/option images)
	const handleImageUpload = (questionIndex, optionIndex = null, e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			// Update state with base64 image
			setFormData((prev) => {
				const updatedQuestions = [...prev.questions];

				if (optionIndex === null) {
					// This is a question image
					updatedQuestions[questionIndex].image = reader.result;
				} else {
					// This is an option image
					updatedQuestions[questionIndex].options[optionIndex].image =
						reader.result;
				}

				return { ...prev, questions: updatedQuestions };
			});
		};

		reader.readAsDataURL(file);
	};

	// Save exam (draft or publish)
	const saveExam = async (publish = false) => {
		try {
			setSaving(true);

			// Validate form
			if (!formData.title.trim()) {
				alert("Please enter an exam title");
				setSaving(false);
				return;
			}

			if (!formData.date) {
				alert("Please set an exam date");
				setSaving(false);
				return;
			}

			// Validate questions
			for (let i = 0; i < formData.questions.length; i++) {
				const question = formData.questions[i];

				if (!question.text.trim()) {
					alert(`Question ${i + 1} is empty. Please enter a question.`);
					setSaving(false);
					return;
				}

				// Check at least 2 options
				const validOptions = question.options.filter((opt) => opt.text.trim());
				if (validOptions.length < 2) {
					alert(`Question ${i + 1} needs at least 2 options.`);
					setSaving(false);
					return;
				}
			}

			const examData = {
				...formData,
				status: publish ? "published" : "draft",
			};

			const response = await fetch("/api/exams", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(examData),
			});

			if (!response.ok) {
				throw new Error("Failed to save exam");
			}

			const savedExam = await response.json();

			// Redirect to exam list or exam view
			router.push(
				publish ? `/teacher/exams/${savedExam._id}` : "/teacher/exams"
			);
		} catch (err) {
			console.error("Error saving exam:", err);
			setError("Failed to save exam. Please try again.");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div className="p-4 md:p-6 max-w-5xl mx-auto">
			<h1 className="text-2xl md:text-3xl font-bold mb-6">Create New Exam</h1>

			{error && (
				<div
					className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6"
					role="alert"
				>
					<p className="font-bold">Error</p>
					<p>{error}</p>
				</div>
			)}

			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<h2 className="text-xl font-bold text-gray-800 mb-4">Exam Details</h2>

				<div className="space-y-4">
					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Exam Title <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="title"
							name="title"
							value={formData.title}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="e.g., Midterm Mathematics Exam"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Description
						</label>
						<textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							rows="3"
							className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter a description for this exam"
						></textarea>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="date"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Exam Date <span className="text-red-500">*</span>
							</label>
							<input
								type="date"
								id="date"
								name="date"
								value={formData.date}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								required
							/>
						</div>

						<div>
							<label
								htmlFor="duration"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Duration (HH:MM) <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="duration"
								name="duration"
								value={formData.duration}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="01:30"
								pattern="[0-9]{2}:[0-9]{2}"
								required
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Assign to Classes
						</label>
						<div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
							{classes.length === 0 ? (
								<p className="text-gray-500 text-sm">
									No classes available. Create classes first.
								</p>
							) : (
								<div className="space-y-2">
									{classes.map((classItem) => (
										<div key={classItem._id} className="flex items-center">
											<input
												type="checkbox"
												id={`class-${classItem._id}`}
												checked={formData.assignedTo.includes(classItem.name)}
												onChange={() => handleClassAssignment(classItem.name)}
												className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
											/>
											<label
												htmlFor={`class-${classItem._id}`}
												className="ml-2 block text-sm text-gray-900"
											>
												{classItem.name}
												{classItem.description && (
													<span className="text-gray-500 text-xs ml-1">
														({classItem.description})
													</span>
												)}
											</label>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Questions Section */}
			<div className="space-y-6 mb-6">
				{formData.questions.map((question, questionIndex) => (
					<div
						key={questionIndex}
						className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
					>
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">
								Question {questionIndex + 1}
							</h3>
							<button
								type="button"
								onClick={() => removeQuestion(questionIndex)}
								className="text-red-600 hover:text-red-800"
								disabled={formData.questions.length <= 1}
							>
								<FaTrash />
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label
									htmlFor={`question-${questionIndex}`}
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Question Text <span className="text-red-500">*</span>
								</label>
								<textarea
									id={`question-${questionIndex}`}
									name="text"
									value={question.text}
									onChange={(e) => handleQuestionChange(questionIndex, e)}
									rows="2"
									className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									placeholder="Enter your question"
									required
								></textarea>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Question Image (Optional)
								</label>
								<div className="flex items-center">
									<input
										type="file"
										id={`question-image-${questionIndex}`}
										accept="image/*"
										onChange={(e) => handleImageUpload(questionIndex, null, e)}
										className="hidden"
									/>
									<label
										htmlFor={`question-image-${questionIndex}`}
										className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded flex items-center"
									>
										<FaImage className="mr-2" /> Upload Image
									</label>

									{question.image && (
										<div className="ml-4 flex items-center">
											<img
												src={question.image}
												alt="Question"
												className="h-10 w-10 object-cover"
											/>
											<button
												type="button"
												onClick={() => {
													setFormData((prev) => {
														const updatedQuestions = [...prev.questions];
														updatedQuestions[questionIndex].image = "";
														return { ...prev, questions: updatedQuestions };
													});
												}}
												className="ml-2 text-red-600 hover:text-red-800"
											>
												<FaTrash size={14} />
											</button>
										</div>
									)}
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-3">
									Options <span className="text-red-500">*</span>
								</label>
								<div className="space-y-3">
									{question.options.map((option, optionIndex) => (
										<div key={optionIndex} className="flex items-start">
											<div className="mr-3 mt-2">
												<button
													type="button"
													className={`h-6 w-6 rounded-full flex items-center justify-center ${
														question.correctAnswer === optionIndex
															? "bg-green-500 text-white"
															: "bg-gray-200 text-gray-700 hover:bg-gray-300"
													}`}
													onClick={() =>
														handleCorrectAnswerChange(
															questionIndex,
															optionIndex
														)
													}
													title={
														question.correctAnswer === optionIndex
															? "Correct answer"
															: "Set as correct answer"
													}
												>
													{question.correctAnswer === optionIndex && (
														<FaCheck size={12} />
													)}
												</button>
											</div>

											<div className="flex-grow">
												<input
													type="text"
													value={option.text}
													onChange={(e) =>
														handleOptionChange(questionIndex, optionIndex, e)
													}
													className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
													placeholder={`Option ${optionIndex + 1}`}
													required
												/>

												{option.image && (
													<div className="mt-1 flex items-center">
														<img
															src={option.image}
															alt={`Option ${optionIndex + 1}`}
															className="h-8 w-8 object-cover"
														/>
														<button
															type="button"
															onClick={() => {
																setFormData((prev) => {
																	const updatedQuestions = [...prev.questions];
																	updatedQuestions[questionIndex].options[
																		optionIndex
																	].image = "";
																	return {
																		...prev,
																		questions: updatedQuestions,
																	};
																});
															}}
															className="ml-2 text-red-600 hover:text-red-800"
														>
															<FaTrash size={12} />
														</button>
													</div>
												)}
											</div>

											<div className="ml-2 flex items-center">
												<input
													type="file"
													id={`option-image-${questionIndex}-${optionIndex}`}
													accept="image/*"
													onChange={(e) =>
														handleImageUpload(questionIndex, optionIndex, e)
													}
													className="hidden"
												/>
												<label
													htmlFor={`option-image-${questionIndex}-${optionIndex}`}
													className="cursor-pointer p-2 text-gray-500 hover:text-gray-700"
													title="Add image to option"
												>
													<FaImage />
												</label>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				))}

				<button
					type="button"
					onClick={addQuestion}
					className="w-full py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 flex items-center justify-center"
				>
					<FaPlus className="mr-2" /> Add Another Question
				</button>
			</div>

			{/* Submit Buttons */}
			<div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
				<button
					type="button"
					onClick={() => saveExam(false)}
					disabled={saving}
					className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center"
				>
					<FaSave className="mr-2" />
					{saving ? "Saving..." : "Save as Draft"}
				</button>

				<button
					type="button"
					onClick={() => saveExam(true)}
					disabled={saving}
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
				>
					<FaPaperPlane className="mr-2" />
					{saving ? "Publishing..." : "Publish Exam"}
				</button>
			</div>
		</div>
	);
}
