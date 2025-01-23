"use client";

export default function CertificateUpload() {
	const handleSubmit = (e) => {
		e.preventDefault();
		alert("Certificate uploaded successfully!");
	};

	return (
		<div className="min-h-screen bg-gray-100  flex items-center justify-center">
			<div className=" p-8 rounded-lg w-full max-w-2xl">
				<h2 className="text-xl font-semibold text-center text-[#002349] mb-8">
					Certificate Upload
				</h2>
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Certificate Number */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Certificate Number
						</label>
						<input
							type="text"
							className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter certificate number"
						/>
					</div>

					{/* First Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							First Name
						</label>
						<input
							type="text"
							className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter first name"
						/>
					</div>

					{/* Last Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Last Name
						</label>
						<input
							type="text"
							className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter last name"
						/>
					</div>

					{/* Other Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Other Name
						</label>
						<input
							type="text"
							className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter other name"
						/>
					</div>

					{/* Issued Date */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Issued Date
						</label>
						<input
							type="date"
							className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					{/* Scanned Certificate Image */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Scanned Certificate Image
						</label>
						<input
							type="file"
							className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					{/* Submit Button */}
					<div>
						<button
							type="submit"
							className="w-full py-3 bg-orange-500 text-white font-semibold text-sm rounded-md hover:bg-orange-600 transition duration-200"
						>
							Upload Certificate
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
