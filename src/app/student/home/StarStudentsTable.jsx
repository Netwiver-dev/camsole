export default function StarStudentsTable() {
	return (
		<div className="bg-blue-900 text-white rounded-lg overflow-hidden shadow">
			{/* Header */}
			<div className="bg-blue-700 px-6 py-4">
				<h3 className="text-lg font-semibold">Star Students</h3>
			</div>

			{/* Table */}
			<table className="w-full text-left bg-white text-gray-800">
				<thead>
					<tr className="bg-gray-100">
						<th className="py-3 px-6 font-medium">Name</th>
						<th className="py-3 px-6 font-medium">Student ID</th>
						<th className="py-3 px-6 font-medium">Marks</th>
						<th className="py-3 px-6 font-medium">Percent</th>
					</tr>
				</thead>
				<tbody>
					{[...Array(6)].map((_, index) => (
						<tr
							key={index}
							className={`${
								index % 2 === 0 ? "bg-blue-100" : "bg-gray-50"
							} text-sm`}
						>
							<td className="py-3 px-6">Folajimi Mathew</td>
							<td className="py-3 px-6">123456</td>
							<td className="py-3 px-6">989</td>
							<td className="py-3 px-6">98%</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
