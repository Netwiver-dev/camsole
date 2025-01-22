import FeeCards from "./FeeCards";
import TransactionHistory from "./TransactionHistory";

export default function FeeOverviewPage() {
	return (
		<div className="space-y-6">
			{/* Fee Cards */}
			<FeeCards />

			{/* Transaction History */}
			<TransactionHistory />
		</div>
	);
}
