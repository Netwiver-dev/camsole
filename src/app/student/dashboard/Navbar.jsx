import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
	return (
		<nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
			{/* Search Input */}
			<div className="flex items-center space-x-4">
				<FaSearch className="text-gray-400" />
				<input
					type="text"
					placeholder="Search"
					className="focus:outline-none text-sm w-64 bg-gray-100 p-2 rounded-md"
				/>
			</div>

			{/* Profile & Notifications */}
			<div className="flex items-center space-x-6">
				<FaBell className="text-gray-400 cursor-pointer" />
				<div className="flex items-center space-x-2">
					<FaUserCircle className="text-blue-500 text-xl" />
					<span className="text-sm">Folajimi Mathew</span>
				</div>
			</div>
		</nav>
	);
}
