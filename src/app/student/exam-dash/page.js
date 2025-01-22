import React from "react";
import { Search, Bell } from "lucide-react";

const ExamCard = ({ title, description, time, date, image }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-md">
    <div className="h-48 overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-2">
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{date}</span>
        </div>
      </div>
      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors">
        Take Exam
      </button>
    </div>
  </div>
);

export default function ExamDash() {
  const examData = [
    {
      title: "English Language",
      description:
        "Lorem ipsum dolor sit amet consectetur. Integer sollicitudin nulla sed sit eget fames. Et tellus gravida",
      time: "9am - 12am",
      date: "05/11/2024",
      image: "/images/exams/test.png",
    },
    {
      title: "Geography",
      description:
        "Lorem ipsum dolor sit amet consectetur. Integer sollicitudin nulla sed sit eget fames. Et tellus gravida",
      time: "9am - 12am",
      date: "05/11/2024",
      image: "/images/exams/test.png",
    },
    {
      title: "Chemistry",
      description:
        "Lorem ipsum dolor sit amet consectetur. Integer sollicitudin nulla sed sit eget fames. Et tellus gravida",
      time: "9am - 12am",
      date: "05/11/2024",
      image: "/images/exams/test.png",
    },
    {
      title: "Government",
      description:
        "Lorem ipsum dolor sit amet consectetur. Integer sollicitudin nulla sed sit eget fames. Et tellus gravida",
      time: "9am - 12am",
      date: "05/11/2024",
      image: "/images/exams/test.png",
    },
    {
      title: "Agriculture",
      description:
        "Lorem ipsum dolor sit amet consectetur. Integer sollicitudin nulla sed sit eget fames. Et tellus gravida",
      time: "9am - 12am",
      date: "05/11/2024",
      image: "/images/exams/test.png",
    },
    {
      title: "Mathematics",
      description:
        "Lorem ipsum dolor sit amet consectetur. Integer sollicitudin nulla sed sit eget fames. Et tellus gravida",
      time: "9am - 12am",
      date: "05/11/2024",
      image: "/images/exams/test.png",
    },
    {
      title: "Biology",
      description:
        "Lorem ipsum dolor sit amet consectetur. Integer sollicitudin nulla sed sit eget fames. Et tellus gravida",
      time: "9am - 12am",
      date: "05/11/2024",
      image: "/images/exams/test.png",
    },
    {
      title: "Economics",
      description:
        "Lorem ipsum dolor sit amet consectetur. Integer sollicitudin nulla sed sit eget fames. Et tellus gravida",
      time: "9am - 12am",
      date: "05/11/2024",
      image: "/images/exams/test.png",
    },
  ];

return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-4">
        {/* Tabs */}
        <div className="mb-6">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <a
                        href="#"
                        className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600"
                    >
                        Ongoing Exam
                    </a>
                    <a
                        href="#"
                        className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:border-gray-300"
                    >
                        Upcoming Exams
                    </a>
                    <a
                        href="#"
                        className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:border-gray-300"
                    >
                        Past Questions
                    </a>
                </nav>
            </div>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Exams</h2>
            <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Filter
            </button>
        </div>

        {/* Exam Grid */}
        <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
                {examData.map((exam, index) => (
                    <ExamCard key={index} {...exam} />
                ))}
            </div>
        </div>
    </div>
);
}