export default function UpcomingEvents() {
	const events = [
		{
			title: "School Trip",
			description: "Senior secondary school classes",
			date: "10th of December, 2024",
			image: "/images/student_image/upcoming.png", // Replace with your actual image path
		},
		{
			title: "School Trip",
			description: "Senior secondary school classes",
			date: "10th of December, 2024",
			image: "/images/student_image/upcoming.png",
		},
		{
			title: "School Trip",
			description: "Senior secondary school classes",
			date: "10th of December, 2024",
			image: "/images/student_image/upcoming.png",
		},
		{
			title: "School Trip",
			description: "Senior secondary school classes",
			date: "10th of December, 2024",
			image: "/images/student_image/upcoming.png",
		},
	];

	return (
		<div className="bg-white p-6 rounded-lg shadow">
			{/* Title */}
			<h3 className="text-lg font-semibold text-blue-800 mb-4">
				Upcoming Events
			</h3>

			{/* Event List */}
			<div className="space-y-4">
				{events.map((event, index) => (
					<div key={index} className="flex items-center">
						{/* Event Image */}
						<img
							src={event.image}
							alt={event.title}
							className="w-16 h-16 rounded-lg object-cover mr-4"
						/>

						{/* Event Details */}
						<div>
							<h4 className="text-sm font-medium text-gray-800">
								{event.title}
							</h4>
							<p className="text-sm text-gray-600">{event.description}</p>
							<p className="text-sm text-gray-600">{event.date}</p>
							<a
								href="#"
								className="text-sm text-blue-500 hover:underline mt-1 inline-block"
							>
								Read more
							</a>
						</div>
					</div>
				))}
			</div>

			{/* View All Link */}
			<a href="#" className="text-sm text-blue-500 hover:underline mt-4 block">
				See all upcoming events &rsaquo;
			</a>
		</div>
	);
}
