export default function Congratulations() {
	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center">
			<div className="bg-white p-6 rounded-lg shadow w-full max-w-lg">
				<h2 className="text-lg font-semibold text-center mb-4">
					Congratulations!
				</h2>
				<p className="text-center mb-6">
					You’ve successfully setup your exam. Share your exam with:
				</p>

				{/* Social Media Links */}
				<div className="flex items-center justify-center gap-4 mb-6">
					<button className="bg-green-500 text-white rounded-full p-3">
						WhatsApp
					</button>
					<button className="bg-blue-500 text-white rounded-full p-3">
						Telegram
					</button>
				</div>

				{/* Shareable Link */}
				<div className="flex items-center justify-between border p-3 rounded-md">
					<p className="text-sm truncate">https://exam-link.com/12345</p>
					<button className="text-blue-500 hover:underline">Copy</button>
				</div>
			</div>
		</div>
	);
}
