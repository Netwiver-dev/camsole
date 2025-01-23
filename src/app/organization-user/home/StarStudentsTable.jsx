export default function StarStudentsTable() {
	const students = [
		{ name: "Folajimi Mathew", id: "123456", marks: "989", percent: "98%" },
		{ name: "Folajimi Mathew", id: "123456", marks: "989", percent: "98%" },
		{ name: "Folajimi Mathew", id: "123456", marks: "989", percent: "98%" },
		{ name: "Folajimi Mathew", id: "123456", marks: "989", percent: "98%" },
		{ name: "Folajimi Mathew", id: "123456", marks: "989", percent: "98%" },
		{ name: "Folajimi Mathew", id: "123456", marks: "989", percent: "98%" },
	];

	return (
		<div className="bg-white shadow rounded-lg overflow-hidden">
			{/* Header */}
			<div className="bg-blue-500 text-white font-semibold p-4">
				Star Students
			</div>
			{/* Table */}
			<table className="w-full text-left text-sm border-collapse">
				<thead className="bg-gray-100">
					<tr>
						<th className="p-3 border-b">Name</th>
						<th className="p-3 border-b">Student ID</th>
						<th className="p-3 border-b">Marks</th>
						<th className="p-3 border-b">Percent</th>
					</tr>
				</thead>
				<tbody>
					{students.map((student, index) => (
						<tr
							key={index}
							className={`${index % 2 === 0 ? "bg-blue-100" : "bg-white"}`}
						>
							<td className="p-3 border-b">{student.name}</td>
							<td className="p-3 border-b">{student.id}</td>
							<td className="p-3 border-b">{student.marks}</td>
							<td className="p-3 border-b">{student.percent}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
