"use client";
import React, { useState } from 'react';

const ResultChecker = () => {
  const [examId, setExamId] = useState('');
  const [showResult, setShowResult] = useState(false);

  const resultData = {
    name: 'Folajimi Mathew',
    points: '70/100',
    grade: '70%',
    duration: '2hours',
    categories: {
      correct: 70,
      incorrect: 30
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowResult(true);
  };

  if (showResult) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-center font-semibold text-xl mb-6">Congratulations</h2>
        
        {/* Student Details */}
        <div className="mb-8">
          <h3 className="font-medium text-lg mb-4">{resultData.name}</h3>
          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between">
              <span>Points</span>
              <span>{resultData.points}</span>
            </div>
            <div className="flex justify-between">
              <span>Grade</span>
              <span>{resultData.grade}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration</span>
              <span>{resultData.duration}</span>
            </div>
          </div>
        </div>

        {/* Progress Circle */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#FF6B00"
                strokeWidth="3"
                strokeDasharray={`${70}, 100`}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-gray-700">
              70%
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h4 className="font-medium mb-4">Categories</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Correct</span>
                <span>70%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Incorrect</span>
                <span>30%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Summary */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="font-medium">Correct</div>
              <div className="text-2xl font-bold text-gray-700">{resultData.categories.correct}</div>
              <div className="text-sm text-gray-500">Total Score Answer</div>
            </div>
            <div>
              <div className="font-medium">Incorrect</div>
              <div className="text-2xl font-bold text-gray-700">{resultData.categories.incorrect}</div>
              <div className="text-sm text-gray-500">Total Score Answer</div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setShowResult(false)}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-medium mb-4">Result Checker</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
            placeholder="Exam ID"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Check Result
        </button>
      </form>
    </div>
  );
};

export default ResultChecker;