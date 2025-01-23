"use client"
import { useState } from "react";
import Image from "next/image";

export default function OrganisationPerformance() {
	const [activeTab, setActiveTab] = useState("lectureNote"); // State to track active tab
	const [currentPage, setCurrentPage] = useState(1); // State to track the current page
	const resourcesPerPage = 6; // Number of resources per page

	// Sample data for resources
	const resources = [
		{
			title: "Organisation Tips",
			description: "It's a book for the wise",
			date: "10th of December, 2024",
			image: "/images/organisation_image/organisation-tip.png",
		},
		{
			title: "Leadership Skills",
			description: "10 necessary tips needed by a leader",
			date: "10th of December, 2024",
			image: "/images/organisation_image/leaderskill.png",
		},
		{
			title: "How To Be A Good Leader",
			description: "Good leader",
			date: "10th of December, 2024",
			image: "/images/organisation_image/leaderbook.png",
		},
		// Duplicate for demonstration
		{
			title: "Leadership Skills",
			description: "10 necessary tips needed by a leader",
			date: "10th of December, 2024",
			image: "/images/organisation_image/organisation-tip.png",
		},
		{
			title: "How To Be A Good Leader",
			description: "Good leader",
			date: "10th of December, 2024",
			image: "/images/organisation_image/leaderskill.png",
		},
		{
			title: "Organisation Tips",
			description: "It's a book for the wise",
			date: "10th of December, 2024",
			image: "/images/organisation_image/leaderbook.png",
		},
	];

	// Calculate pagination
	const indexOfLastResource = currentPage * resourcesPerPage;
	const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
	const currentResources = resources.slice(
		indexOfFirstResource,
		indexOfLastResource
	);

	// Handle pagination
	const totalPages = Math.ceil(resources.length / resourcesPerPage);
	const goToNextPage = () =>
		setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

	return (
		<div className="bg-white p-6 rounded-lg shadow">
			<h2 className="text-xl font-semibold mb-4">Studies Resources</h2>

			{/* Tabs */}
			<div className="flex space-x-6 border-b pb-2 mb-6">
				<button
					onClick={() => setActiveTab("lectureNote")}
					className={`pb-2 ${
						activeTab === "lectureNote"
							? "border-b-2 border-blue-600 text-blue-600 font-semibold"
							: "text-gray-600"
					}`}
				>
					Lecture Note
				</button>
				<button
					onClick={() => setActiveTab("resources")}
					className={`pb-2 ${
						activeTab === "resources"
							? "border-b-2 border-blue-600 text-blue-600 font-semibold"
							: "text-gray-600"
					}`}
				>
					Resources
				</button>
			</div>

			{/* Content */}
			{activeTab === "resources" && (
				<div className="text-gray-500 text-center py-10">
					<p>No Lecture Notes available at the moment.</p>
				</div>
			)}

			{/* Lecture Note Placeholder */}
			{activeTab === "lectureNote" && (
				<div>
					{/* Resource Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{currentResources.map((resource, index) => (
							<div key={index} className="border p-4 rounded-lg shadow-sm">
								<Image
									src={resource.image}
									alt={resource.title}
									width={150}
									height={150}
									className="w-full h-32 object-cover rounded mb-4"
								/>
								<h3 className="font-medium text-gray-800">{resource.title}</h3>
								<p className="text-sm text-gray-500">{resource.description}</p>
								<p className="text-sm text-gray-400">{resource.date}</p>
								<a
									href="#"
									className="text-orange-500 text-sm font-medium hover:underline"
								>
									Download
								</a>
							</div>
						))}
					</div>

					{/* Pagination */}
					<div className="flex items-center justify-between mt-6">
						<button
							onClick={goToPrevPage}
							className={`px-4 py-2 text-sm font-medium rounded-md ${
								currentPage === 1
									? "text-gray-400 cursor-not-allowed"
									: "text-blue-500 hover:underline"
							}`}
							disabled={currentPage === 1}
						>
							Previous
						</button>
						<p className="text-sm">
							Page <span className="font-semibold">{currentPage}</span> of{" "}
							<span className="font-semibold">{totalPages}</span>
						</p>
						<button
							onClick={goToNextPage}
							className={`px-4 py-2 text-sm font-medium rounded-md ${
								currentPage === totalPages
									? "text-gray-400 cursor-not-allowed"
									: "text-blue-500 hover:underline"
							}`}
							disabled={currentPage === totalPages}
						>
							Next
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
