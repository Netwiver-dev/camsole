import DashboardCards from "./DashboardCards";
import OrganisationPerformance from "./OrganisationPerformance";
import StudiesResources from "./StudiesResources";
import StarStudentsTable from "./StarStudentsTable";

export default function Dashboard() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-gray-100">
			{/* Left Column */}
			<div className="lg:col-span-2 space-y-6">
				<DashboardCards />
				<OrganisationPerformance />
				<StarStudentsTable />
			</div>

			{/* Right Column */}
			<div className="space-y-6">
				<StudiesResources />
			</div>
		</div>
	);
}
