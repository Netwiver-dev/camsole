import CheckReport from "./CheckReport";
import ResultTable from "./ResultTable";

export default function ResultCheckerPage() {
	return (
		<div className="space-y-6">
			<CheckReport />
			<ResultTable />
		</div>
	);
}
