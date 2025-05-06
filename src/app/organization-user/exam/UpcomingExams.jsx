'use client';

import Link from 'next/link';
import { FaCalendarAlt, FaClock, FaPlayCircle } from 'react-icons/fa';

export default function UpcomingExams({ exams }) {
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format duration function (HH:MM to readable format)
  const formatDuration = (duration) => {
    if (!duration) return 'Not specified';
    
    const [hours, minutes] = duration.split(':').map(Number);
    
    const hoursText = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : '';
    const minutesText = minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : '';
    
    if (hoursText && minutesText) {
      return `${hoursText} and ${minutesText}`;
    }
    
    return hoursText || minutesText;
  };

  if (!exams || exams.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No upcoming exams found.</p>
        <p className="text-sm text-gray-400 mt-2">Check back later for upcoming exams.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exams.map((exam) => (
        <div key={exam._id} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-50 p-4">
            <h3 className="font-semibold text-lg">{exam.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {exam.description || 'No description available'}
            </p>
          </div>
          
          <div className="p-4">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <FaCalendarAlt className="mr-2 text-blue-500" />
              {formatDate(exam.date)}
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <FaClock className="mr-2 text-blue-500" />
              Duration: {formatDuration(exam.duration)}
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <span className="font-semibold">Questions:</span>
              <span className="ml-2">{exam.questions?.length || 0}</span>
            </div>
            
            <Link 
              href={`/organization-user/exam?id=${exam._id}`}
              className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-blue-700 transition"
            >
              <FaPlayCircle className="mr-2" />
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
