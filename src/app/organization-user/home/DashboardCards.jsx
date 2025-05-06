'use client';

import { FaGraduationCap, FaCalendarAlt, FaChartLine, FaBook } from 'react-icons/fa';

export default function DashboardCards({ 
  examsCompleted = 0, 
  examsUpcoming = 0,
  averageScore = 0,
  totalQuestionsAnswered = 0 
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <FaGraduationCap className="text-xl text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed Exams</p>
            <p className="text-2xl font-bold">{examsCompleted}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <FaCalendarAlt className="text-xl text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Upcoming Exams</p>
            <p className="text-2xl font-bold">{examsUpcoming}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <FaChartLine className="text-xl text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Average Score</p>
            <p className="text-2xl font-bold">{averageScore}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <FaBook className="text-xl text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Questions Answered</p>
            <p className="text-2xl font-bold">{totalQuestionsAnswered}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
