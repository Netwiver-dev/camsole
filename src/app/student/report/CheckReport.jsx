export default function CheckReport() {
	return (
		<div className="bg-white p-6 rounded-lg  mb-6">
			<h2 className="text-2xl font-semibold text-gray-800 mb-4">Check Report</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* Pick Year */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Pick Year
					</label>
					<select className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
						<option>Select Year</option>
						<option>2024</option>
						<option>2023</option>
					</select>
				</div>

				{/* Pick Class */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Pick Class
					</label>
					<select className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
						<option>Select Class</option>
						<option>SS1</option>
						<option>SS2</option>
						<option>SS3</option>
					</select>
				</div>

				{/* Pick Term */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Pick Term
					</label>
					<select className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
						<option>Select Term</option>
						<option>1st Term</option>
						<option>2nd Term</option>
						<option>3rd Term</option>
					</select>
				</div>
			</div>

			{/* Apply Button */}
			<div className="mt-6">
				<button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg">
					Apply
				</button>
			</div>
		</div>
	);
}
