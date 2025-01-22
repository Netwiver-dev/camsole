export default function StudiesResources() {
	const resources = [
		{
			title: "Organisation Trip",
			description: "Senior secondary school classes",
			date: "10th of December, 2024",
			link: "#",
		},
		{
			title: "Leadership Skills",
			description: "Senior secondary school classes",
			date: "10th of December, 2024",
			link: "#",
		},
		{
			title: "How To Be A Good Leader",
			description: "Senior secondary school classes",
			date: "10th of December, 2024",
			link: "#",
		},
		{
			title: "Camsole News",
			description: "Senior secondary school classes",
			date: "10th of December, 2024",
			link: "#",
		},
	];

	return (
		<div className="bg-white p-6 rounded-lg shadow">
			<h2 className="text-lg font-semibold text-gray-800 mb-4">
				Studies Resources
			</h2>
			<div className="space-y-4">
				{resources.map((resource, index) => (
					<div key={index} className="flex items-start">
						{/* Thumbnail */}
						<img
							src="/images/student_image/upcoming.png" // Replace with your image path
							alt="Resource Thumbnail"
							className="w-16 h-16 rounded-lg mr-4 object-cover"
						/>
						{/* Content */}
						<div>
							<h3 className="text-sm font-medium text-gray-800">
								{resource.title}
							</h3>
							<p className="text-xs text-gray-500">{resource.description}</p>
							<p className="text-xs text-gray-500">{resource.date}</p>
							<a
								href={resource.link}
								className="text-xs text-orange-600 font-medium hover:underline"
							>
								Download
							</a>
						</div>
					</div>
				))}
			</div>
			<a
				href="#"
				className="text-sm text-blue-500 font-medium hover:underline mt-4 block"
			>
				See all Studies Resources &rarr;
			</a>
		</div>
	);
}
