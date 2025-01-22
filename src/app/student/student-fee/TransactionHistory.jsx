export default function TransactionHistory() {
	const transactions = []; // Empty for now, can be replaced with actual data

	return (
		<div className="bg-white p-6 rounded-lg shadow">
			{/* Header */}
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-lg font-semibold text-gray-800">
					Transaction History
				</h2>
				<button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm flex items-center">
					Sort by latest
					<svg
						className="w-4 h-4 ml-2"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</button>
			</div>

			{/* Table */}
			<table className="w-full border-collapse border border-gray-200 text-sm">
				<thead>
					<tr className="bg-gray-100">
						<th className="border border-gray-300 py-2 px-4 text-left">
							Transaction ID
						</th>
						<th className="border border-gray-300 py-2 px-4 text-left">
							Recipient Name
						</th>
						<th className="border border-gray-300 py-2 px-4 text-left">Date</th>
						<th className="border border-gray-300 py-2 px-4 text-left">
							Amount
						</th>
						<th className="border border-gray-300 py-2 px-4 text-left">
							Status
						</th>
					</tr>
				</thead>
				<tbody>
					{transactions.length > 0 ? (
						transactions.map((transaction, index) => (
							<tr key={index}>
								<td className="border border-gray-300 py-2 px-4">
									{transaction.id}
								</td>
								<td className="border border-gray-300 py-2 px-4">
									{transaction.name}
								</td>
								<td className="border border-gray-300 py-2 px-4">
									{transaction.date}
								</td>
								<td className="border border-gray-300 py-2 px-4">
									{transaction.amount}
								</td>
								<td className="border border-gray-300 py-2 px-4">
									{transaction.status}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan="5" className="text-center text-gray-500 py-4">
								No transactions found.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
