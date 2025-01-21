"use client";
import { useState } from "react";
import Image from "next/image";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	return (
		<>
			<div className="max-w-sm mx-auto">
				<div className="flex justify-center mb-6">
					<FaUserCircle className="h-16 w-16 text-[#002349]" />
				</div>
				<h2 className="text-2xl font-bold text-[#002349] text-center mb-6">
					Welcome Back
				</h2>
				<p className="text-center text-gray-600 mb-8">Enter Your Student ID</p>

				{/* Login Form */}
				<form className="space-y-4">
					<div>
						<label
							htmlFor="student-id"
							className="block text-sm font-medium text-gray-700"
						>
							Student ID
						</label>
						<input
							id="student-id"
							type="text"
							placeholder="Enter your Student ID"
							className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<div className="relative">
							<input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter your Password"
								className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
							<button
								type="button"
								onClick={togglePasswordVisibility}
								className="absolute inset-y-0 right-2 flex items-center"
							>
								{showPassword ? (
									<FaEyeSlash className="h-5 w-5 text-gray-500" />
								) : (
									<FaEye className="h-5 w-5 text-gray-500" />
								)}
							</button>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<label className="flex items-center">
							<input
								type="checkbox"
								className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
							/>
							<span className="ml-2 text-sm text-gray-600">
								Always keep me login
							</span>
						</label>
						<a href="#" className="text-sm text-blue-500 hover:underline">
							Forget Password?
						</a>
					</div>
					<button
						type="submit"
						className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md"
					>
						Login
					</button>
				</form>
			</div>
		</>
	);
}
