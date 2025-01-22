"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignUpForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	return (
		<div className=" flex items-center justify-center">
			<div className="bg-white rounded-lg w-full max-w-md">
				{/* Title */}
				<h2 className="text-2xl font-semibold text-center text-[#002349] mb-2">
					Create An Account
				</h2>
				<p className="text-sm text-center text-gray-500 mb-8">
					Let’s Get Started
				</p>

				{/* Form */}
				<form className="space-y-6">
					{/* Full Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Full Name
						</label>
						<input
							type="text"
							placeholder="Enter your full name"
							className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					{/* Email */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>
						<input
							type="email"
							placeholder="Enter your email"
							className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					{/* Phone Number */}
					<div className="flex items-center gap-2">
						{/* Country Code */}
						<div className="flex items-center border border-gray-300 rounded-md px-3">
							<span>🇳🇬</span>
							<select
								className="focus:outline-none bg-transparent ml-2"
								defaultValue="+234"
							>
								<option value="+234">+234</option>
								<option value="+1">+1</option>
								<option value="+44">+44</option>
							</select>
						</div>
						{/* Phone Input */}
						<input
							type="tel"
							placeholder="Phone Number"
							className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					{/* Role Dropdown */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Role
						</label>
						<select
							className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							defaultValue="Student"
						>
							<option value="Student">Student</option>
							<option value="Teacher">Teacher</option>
							<option value="Parent">Parent</option>
						</select>
					</div>

					{/* Password */}
					<div className="relative">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Create Password
						</label>
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Create Password"
							className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute inset-y-0 right-3 flex items-center text-gray-500"
						>
							{showPassword ? <FaEyeSlash /> : <FaEye />}
						</button>
					</div>

					{/* Confirm Password */}
					<div className="relative">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Confirm Password
						</label>
						<input
							type={showConfirmPassword ? "text" : "password"}
							placeholder="Confirm Password"
							className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
						<button
							type="button"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className="absolute inset-y-0 right-3 flex items-center text-gray-500"
						>
							{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
						</button>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						className="w-full py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition duration-200"
					>
						Sign Up
					</button>
				</form>
			</div>
		</div>
	);
}
