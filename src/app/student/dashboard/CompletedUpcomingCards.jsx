import { FaClipboardList, FaCalendarAlt } from "react-icons/fa";

export default function CompletedUpcomingCards() {
	return (
		<div className="flex gap-4">
			{/* Completed Exams */}
			<div className="flex items-center gap-4 bg-purple-100 text-purple-800 p-4 rounded-lg shadow flex-1">
				<div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
					<FaClipboardList className="text-purple-800 text-lg" />
				</div>
				<div>
					<h3 className="text-sm font-medium">Completed Exams</h3>
					<p className="text-2xl font-bold">56</p>
				</div>
			</div>

			{/* Upcoming Exams */}
			<div className="flex items-center gap-4 bg-blue-100 text-blue-800 p-4 rounded-lg shadow flex-1">
				<div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
					<FaCalendarAlt className="text-blue-800 text-lg" />
				</div>
				<div>
					<h3 className="text-sm font-medium">Upcoming Exam</h3>
					<p className="text-2xl font-bold">56</p>
				</div>
			</div>
		</div>
	);
}
