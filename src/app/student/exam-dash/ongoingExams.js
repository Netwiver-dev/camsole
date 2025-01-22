import React from 'react';
import { Search, Bell } from 'lucide-react';

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

const ExamDashboard = () => {
  const examData = [
    {
      title: 'English Language',
      description: 'Lorem ipsum dolor sit amet consectetur. Integer sollicitudin nulla sed sit eget fames. Et tellus gravida',
      time: '9am - 12am',
      date: '05/11/2024',
      image: '/api/placeholder/400/300'
    },
    {
      title: 'Geography',
      description: 'Lorem ipsum dolor sit amet consectetur. Integer sollicitudin nulla sed sit eget fames. Et tellus gravida',
      time: '9am - 12am',
      date: '05/11/2024',
      image: '/api/placeholder/400/300'
    },
    {
      title: 'Chemistry',
      description: 'Lorem ipsum dolor sit amet consectetur. Integer sollicitudin nulla sed sit eget fames. Et tellus gravida',
      time: '9am - 12am',
      date: '05/11/2024',
      image: '/api/placeholder/400/300'
    },
    {
      title: 'Government',
      description: 'Lorem ipsum dolor sit amet consectetur. Integer sollicitudin nulla sed sit eget fames. Et tellus gravida',
      time: '9am - 12am',
      date: '05/11/2024',
      image: '/api/placeholder/400/300'
    },
    {
      title: 'Agriculture',
      description: 'Lorem ipsum dolor sit amet consectetur. Integer sollicitudin nulla sed sit eget fames. Et tellus gravida',
      time: '9am - 12am',
      date: '05/11/2024',
      image: '/api/placeholder/400/300'
    },
    {
      title: 'Mathematics',
      description: 'Lorem ipsum dolor sit amet consectetur. Integer sollicitudin nulla sed sit eget fames. Et tellus gravida',
      time: '9am - 12am',
      date: '05/11/2024',
      image: '/api/placeholder/400/300'
    },
    {
      title: 'Biology',
      description: 'Lorem ipsum dolor sit amet consectetur. Integer sollicitudin nulla sed sit eget fames. Et tellus gravida',
      time: '9am - 12am',
      date: '05/11/2024',
      image: '/api/placeholder/400/300'
    },
    {
      title: 'Economics',
      description: 'Lorem ipsum dolor sit amet consectetur. Integer sollicitudin nulla sed sit eget fames. Et tellus gravida',
      time: '9am - 12am',
      date: '05/11/2024',
      image: '/api/placeholder/400/300'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-navy-900 min-h-screen fixed">
          <div className="p-4">
            <div className="text-white text-2xl font-bold mb-8">CAMSOLE</div>
            <nav className="space-y-2">
              <a href="#" className="flex items-center text-white p-3 rounded-lg hover:bg-navy-800">
                <span>Home</span>
              </a>
              <a href="#" className="flex items-center text-white p-3 rounded-lg bg-navy-800">
                <span>Exams</span>
              </a>
              <a href="#" className="flex items-center text-white p-3 rounded-lg hover:bg-navy-800">
                <span>Certification</span>
              </a>
              <a href="#" className="flex items-center text-white p-3 rounded-lg hover:bg-navy-800">
                <span>Result</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="w-1/2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Bell className="text-gray-600" size={20} />
              <div className="flex items-center gap-2">
                <img src="/api/placeholder/32/32" alt="Profile" className="w-8 h-8 rounded-full" />
                <div>
                  <div className="text-sm font-medium">Folajimi Mathew</div>
                  <div className="text-xs text-gray-500">Admin</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <a href="#" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
                  Ongoing Exam
                </a>
                <a href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:border-gray-300">
                  Upcoming Exams
                </a>
                <a href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:border-gray-300">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {examData.map((exam, index) => (
              <ExamCard key={index} {...exam} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDashboard;