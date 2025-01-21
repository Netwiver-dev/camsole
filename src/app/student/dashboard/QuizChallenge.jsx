export default function QuizChallenge() {
	return (
		<div className="bg-white p-6 rounded-lg shadow">
			<h3 className="text-lg font-semibold mb-4">Daily Quiz Challenge</h3>
			<p className="text-gray-600 mb-4">Chemistry</p>
			<p className="text-gray-800 mb-6">
				1. The product of atomic mass and metal specific heat is about 6.4. This
				information was provided by
			</p>
			{/* Options */}
			<div className="grid grid-cols-2 gap-4 mb-6">
				<button className="border rounded-lg py-2 px-4 hover:bg-gray-100">
					A. Dalton's law
				</button>
				<button className="border rounded-lg py-2 px-4 hover:bg-gray-100">
					B. Dulong Petit’s law
				</button>
				<button className="border rounded-lg py-2 px-4 hover:bg-gray-100">
					C. Newton’s law
				</button>
				<button className="border rounded-lg py-2 px-4 hover:bg-gray-100">
					D. Avogadro’s law
				</button>
			</div>
			{/* Navigation */}
			<div className="flex justify-between">
				<button className="border border-orange-500 text-orange-500 rounded-lg py-2 px-6 hover:bg-orange-50">
					Back
				</button>
				<button className="bg-orange-500 text-white rounded-lg py-2 px-6 hover:bg-orange-600">
					Next
				</button>
			</div>
		</div>
	);
}
