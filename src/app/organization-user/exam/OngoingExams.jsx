'use client';

import Link from 'next/link';
import { FaCalendarAlt, FaClock, FaPlayCircle, FaHourglass } from 'react-icons/fa';

export default function OngoingExams({ exams }) {
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

  // Get remaining time percentage
  const getRemainingTimePercentage = (attempt) => {
    if (!attempt?.timeRemaining) return 0;
    
    // Parse the time remaining string "HH:MM"
    const [hours, minutes] = attempt.timeRemaining.split(':').map(Number);
    const remainingMinutes = hours * 60 + minutes;
    
    // Get the original exam duration
    const exam = exams.find(e => e._id === attempt.examId);
    if (!exam?.duration) return 0;
    
    const [durationHours, durationMinutes] = exam.duration.split(':').map(Number);
    const totalMinutes = durationHours * 60 + durationMinutes;
    
    return Math.min(100, Math.round((remainingMinutes / totalMinutes) * 100));
  };

  if (!exams || exams.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No ongoing exams found.</p>
        <p className="text-sm text-gray-400 mt-2">Start an exam from the Upcoming tab.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exams.map((exam) => (
        <div key={exam._id} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-yellow-50 p-4">
            <h3 className="font-semibold text-lg">{exam.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {exam.description || 'No description available'}
            </p>
          </div>
          
          <div className="p-4">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <FaCalendarAlt className="mr-2 text-yellow-500" />
              Started: {formatDate(exam.attempt?.startTime || exam.date)}
            </div>
            
            <div className="flex flex-col mb-4">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <FaHourglass className="mr-2 text-yellow-500" />
                Time Remaining: {exam.attempt?.timeRemaining || '00:00'}
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-yellow-500 h-2.5 rounded-full" 
                  style={{ width: `${getRemainingTimePercentage(exam.attempt)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <span className="font-semibold">Questions:</span>
              <span className="ml-2">{exam.questions?.length || 0}</span>
            </div>
            
            <Link 
              href={`/organization-user/exam/take-exam?id=${exam._id}`}
              className="w-full mt-2 bg-yellow-600 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-yellow-700 transition"
            >
              <FaPlayCircle className="mr-2" />
              Continue Exam
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
