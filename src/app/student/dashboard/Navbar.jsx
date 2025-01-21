import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
	return (
		<nav className="flex items-center justify-between bg-gray-100  px-6 py-3">
			{/* Search Input */}
			<div className="flex items-center bg-white rounded-lg px-4 py-2 w-1/2">
				<FaSearch className="text-white mr-2" />
				<input
					type="text"
					placeholder="Search"
					className="w-full bg-transparent outline-none text-sm text-gray-600"
				/>
			</div>

			{/* Notification and Profile */}
			<div className="flex items-center space-x-6">
				{/* Notification Icon */}
				<div className="relative bg-white rounded-full p-3 cursor-pointer hover:bg-gray-200">
					<FaBell className="text-gray text-2xl" />
					{/* Notification Badge (if needed) */}
					<span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
						3
					</span>
				</div>

				{/* Profile Section */}
				<div className="flex items-center bg-white rounded-lg px-4 py-2">
					<FaUserCircle className="text-gray-800 text-4xl mr-2" />
					<div>
						<p className="text-sm font-medium text-gray-800">Folajimi Mathew</p>
						<p className="text-xs text-gray-800">Admin</p>
					</div>
				</div>
			</div>
		</nav>
	);
}
