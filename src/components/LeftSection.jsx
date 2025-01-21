import Image from "next/image";

export default function LeftSection({
	imageSrc,
	imageAlt,
}) {
	return (
		<div className="hidden md:flex flex-col items-start justify-center bg-gradient-to-b from-[#002349] to-[#0054AF] text-white w-1/2 p-12">
			{/* Heading */}
			<h1 className="text-4xl font-bold mb-4 mt-9 leading-snug">
				Your <span className="text-[#FF8C00]">Schooling</span> Journey
			</h1>
			<h1 className="text-4xl font-bold  leading-snug">
                Start Here
            </h1>

			{/* Subheading */}
			<p className="mb-6 text-base font-medium opacity-70">Login to access</p>

			{/* Illustration */}
			<div className="relative">
				<Image
					src={imageSrc}
					alt={imageAlt}
					width={400}
					height={400}
					className="object-contain"
				/>
			</div>
		</div>
	);
}
