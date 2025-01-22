import LeftSection from "@/components/LeftSection";
import RightSection from "@/components/RightSection";

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="bg-gray-100">
				{/* Main Container */}
				<div className="flex min-h-screen items-center justify-center">
					<div className="w-full min-h-screen bg-white shadow-md overflow-hidden md:flex">
						{/* Left Section*/}
                        <LeftSection
							imageSrc="/images/organisation_image/signup.png"
							imageAlt="School Illustration"
							type="Signup"
						/>
						{/* Right Section */}
						<RightSection>{children}</RightSection>
					</div>
				</div>
			</body>
		</html>
	);
}
