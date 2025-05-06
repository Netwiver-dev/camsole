'use client';

import Link from 'next/link';
import { FaCalendarAlt, FaClock, FaCheck, FaArrowRight } from 'react-icons/fa';

export default function StudiesResources({ recentResults = [], upcomingExams = [] }) {
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Completed Exams */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Results</h2>
        
        {recentResults.length > 0 ? (
          <div className="space-y-4">
            {recentResults.map((result, index) => (
              <div key={index} className="border-l-4 border-green-500 p-3 bg-gray-50">
                <h3 className="font-medium">{result.examTitle}</h3>
                <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-1" /> 
                    {formatDate(result.date)}
                  </span>
                  <span className="flex items-center">
                    <FaCheck className="mr-1 text-green-500" />
                    {result.percentage}%
                  </span>
                </div>
                <Link 
                  href={`/organization-user/result?id=${result._id}`}
                  className="mt-2 text-sm font-medium text-blue-600 hover:underline flex items-center"
                >
                  View Details <FaArrowRight size={12} className="ml-1" />
                </Link>
              </div>
            ))}
            
            <Link 
              href="/organization-user/result" 
              className="block text-center text-sm font-medium text-blue-600 hover:underline mt-4"
            >
              View All Results
            </Link>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No recent results</p>
        )}
      </div>

      {/* Upcoming Exams */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Upcoming Exams</h2>
        
        {upcomingExams.length > 0 ? (
          <div className="space-y-4">
            {upcomingExams.map((exam, index) => (
              <div key={index} className="border-l-4 border-blue-500 p-3 bg-gray-50">
                <h3 className="font-medium">{exam.title}</h3>
                <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-1" /> 
                    {formatDate(exam.date)}
                  </span>
                  <span className="flex items-center">
                    <FaClock className="mr-1" />
                    {exam.duration}
                  </span>
                </div>
                <Link 
                  href={`/organization-user/exam?id=${exam._id}`}
                  className="mt-2 text-sm font-medium text-blue-600 hover:underline flex items-center"
                >
                  View Details <FaArrowRight size={12} className="ml-1" />
                </Link>
              </div>
            ))}
            
            <Link 
              href="/organization-user/exam" 
              className="block text-center text-sm font-medium text-blue-600 hover:underline mt-4"
            >
              View All Exams
            </Link>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No upcoming exams</p>
        )}
      </div>

      {/* Quick Action Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow p-6 text-white">
        <h2 className="text-lg font-semibold mb-2">Ready for your next exam?</h2>
        <p className="mb-4">Check your upcoming exams and prepare for success.</p>
        <Link 
          href="/organization-user/exam"
          className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-md font-medium hover:bg-blue-50 transition"
        >
          View Exams <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </>
  );
}
