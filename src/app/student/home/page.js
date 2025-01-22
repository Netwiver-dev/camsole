import CompletedUpcomingCards from "./CompletedUpcomingCards";
import QuizChallenge from "./QuizChallenge";
import StarStudentsTable from "./StarStudentsTable";
import LearningTracker from "./LearningTracker";
import UpcomingEvents from "./UpcomingEvents";

export default function Dashboard() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6  h-screen overflow-hidden">
			{/* Left Column */}
			<div className="lg:col-span-2 space-y-6 overflow-y-auto pr-4">
				<CompletedUpcomingCards />
				<QuizChallenge />
				<StarStudentsTable />
			</div>

			{/* Right Column */}
			<div className="space-y-6 overflow-y-auto h-full">
				<LearningTracker />
				<UpcomingEvents />
			</div>
		</div>
	);
}
