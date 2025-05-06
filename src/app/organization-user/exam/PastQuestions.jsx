'use client';

import Link from 'next/link';
import { FaCalendarAlt, FaCheckCircle, FaFileAlt, FaDownload } from 'react-icons/fa';

export default function PastQuestions({ exams }) {
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get badge color based on percentage
  const getScoreBadgeColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 75) return 'bg-blue-100 text-blue-800';
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (!exams || exams.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No completed exams found.</p>
        <p className="text-sm text-gray-400 mt-2">Complete an exam to see your results here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exams.map((exam) => (
        <div key={exam._id} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-green-50 p-4">
            <h3 className="font-semibold text-lg">{exam.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {exam.description || 'No description available'}
            </p>
          </div>
          
          <div className="p-4">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <FaCalendarAlt className="mr-2 text-green-500" />
              Completed: {formatDate(exam.result?.endTime || exam.date)}
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FaCheckCircle className="mr-2 text-green-500" />
                <span className="text-sm text-gray-600">
                  Score: {exam.result?.score || 0}/{exam.questions?.length || 0}
                </span>
              </div>
              
              <span 
                className={`text-xs font-semibold inline-block py-1 px-2 rounded ${
                  getScoreBadgeColor(exam.result?.percentage || 0)
                }`}
              >
                {exam.result?.percentage?.toFixed(1) || 0}%
              </span>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Link 
                href={`/organization-user/result?id=${exam.result?._id}`}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-green-700 transition"
              >
                <FaFileAlt className="mr-2" />
                View Result
              </Link>
              
              {exam.result?.percentage >= 60 && (
                <Link 
                  href={`/api/certificates/${exam.result?._id}`}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-blue-700 transition"
                  target="_blank"
                >
                  <FaDownload className="mr-2" />
                  Get Certificate
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
