export default function StarStudentsTable() {
	const students = [
		{ name: "Folajimi Mathew", id: "123456", marks: 989, percent: "98%" },
		{ name: "Folajimi Mathew", id: "123456", marks: 989, percent: "98%" },
		{ name: "Folajimi Mathew", id: "123456", marks: 989, percent: "98%" },
		{ name: "Folajimi Mathew", id: "123456", marks: 989, percent: "98%" },
	];

	return (
		<div className="bg-white p-6 rounded-lg shadow">
			<h2 className="text-lg font-semibold text-gray-800 mb-4">
				Star Students
			</h2>
			<table className="w-full border-collapse border-gray-200 text-sm">
				<thead>
					<tr className="bg-gray-100">
						
						<th className="border-y border-gray-300 py-2 px-4 text-left">Name</th>
						<th className="border-y border-gray-300 py-2 px-4 text-left">
							Student ID
						</th>
						<th className="border-y border-gray-300 py-2 px-4 text-left">
							Marks
						</th>
						<th className="border-y border-gray-300 py-2 px-4 text-left">
							Percent
						</th>
					</tr>
				</thead>
				<tbody>
					{students.map((student, index) => (
						<tr key={index} className="hover:bg-gray-50">
							
							<td className=" border-gray-300 py-2 px-4 ">
								<input type="checkbox" className="form-checkbox h-4 w-4 mr-4" />
								{student.name}
							</td>
							<td className=" border-gray-300 py-2 px-4">{student.id}</td>
							<td className=" border-gray-300 py-2 px-4">
								{student.marks}
							</td>
							<td className=" border-gray-300 py-2 px-4">
								{student.percent}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
