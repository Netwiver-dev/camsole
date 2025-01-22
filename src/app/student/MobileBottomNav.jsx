import {
	FaHome,
	FaFileAlt,
	FaCertificate,
	FaQuestion,
	FaUser,
} from "react-icons/fa";

export default function MobileBottomNav() {
	return (
		<nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-between px-6 py-3">
			<a
				href="/home"
				className="flex flex-col items-center text-gray-500 hover:text-blue-500"
			>
				<FaHome />
				<span className="text-xs mt-1">Home</span>
			</a>
			<a
				href="/exams"
				className="flex flex-col items-center text-gray-500 hover:text-blue-500"
			>
				<FaFileAlt />
				<span className="text-xs mt-1">Exam</span>
			</a>
			<a
				href="/certification"
				className="flex flex-col items-center text-gray-500 hover:text-blue-500"
			>
				<FaCertificate />
				<span className="text-xs mt-1">Certificate</span>
			</a>
			<a
				href="/questions"
				className="flex flex-col items-center text-gray-500 hover:text-blue-500"
			>
				<FaQuestion />
				<span className="text-xs mt-1">Questions</span>
			</a>
			<a
				href="/profile"
				className="flex flex-col items-center text-gray-500 hover:text-blue-500"
			>
				<FaUser />
				<span className="text-xs mt-1">Profile</span>
			</a>
		</nav>
	);
}
