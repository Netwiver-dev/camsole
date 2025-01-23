"use client";

export default function CertificateVerificationForm() {
	return (
		<div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-12">
			<h2 className="text-lg font-semibold text-gray-800 mb-6">Certificate Verification</h2>
			<form>
				<div className="mb-6">
					<input
						type="text"
						placeholder="Tracking Number / Student ID"
						className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<button
					type="submit"
					className="w-full py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600"
				>
					Verify
				</button>
			</form>
		</div>
	);
}
