'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaClock, FaExclamationCircle, FaCheckCircle, FaPlayCircle } from 'react-icons/fa';

export default function InputDetailsForm({ exam }) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleStartExam = async () => {
    if (!agreed) {
      setError('You must agree to the terms before starting the exam.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Start the exam
      const response = await fetch(`/api/exams/${exam._id}/attempts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to start exam');
      }
      
      // Redirect to the exam page
      router.push(`/organization-user/exam/take-exam?id=${exam._id}`);
      
    } catch (err) {
      setError(err.message);
      console.error('Error starting exam:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!exam) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">Exam details not available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Exam Information</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="space-y-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold">{exam.title}</h3>
          <p className="text-gray-600 mt-1">{exam.description || 'No description available'}</p>
        </div>
        
        <div className="flex items-center text-gray-700">
          <FaCalendarAlt className="mr-2 text-blue-500" />
          <span>Date: {formatDate(exam.date)}</span>
        </div>
        
        <div className="flex items-center text-gray-700">
          <FaClock className="mr-2 text-blue-500" />
          <span>Duration: {formatDuration(exam.duration)}</span>
        </div>
        
        <div className="text-gray-700">
          <span className="font-medium">Total Questions:</span> {exam.questions?.length || 0}
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
          <FaExclamationCircle className="mr-2" />
          Important Information
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-blue-800">
          <li>This exam must be completed in one sitting.</li>
          <li>The timer will start as soon as you begin the exam.</li>
          <li>You can flag questions to review later during the exam.</li>
          <li>The exam will automatically submit when the time is up.</li>
          <li>You can only take this exam once.</li>
          <li>Ensure you have a stable internet connection before starting.</li>
        </ul>
      </div>
      
      <div className="mb-6">
        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span className="ml-2 text-sm text-gray-600">
            I understand that once I start the exam, I cannot pause it. I have read and agree to the examination terms and conditions.
          </span>
        </label>
      </div>
      
      <div className="flex justify-center">
        <button
          className={`px-6 py-3 rounded-lg flex items-center ${
            agreed
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } transition duration-200`}
          onClick={handleStartExam}
          disabled={!agreed || loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <FaPlayCircle className="mr-2" />
              Start Exam
            </>
          )}
        </button>
      </div>
    </div>
  );
}
