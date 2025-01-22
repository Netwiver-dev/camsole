"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const formatTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const ExamPage = () => {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(2 * 60 * 60); // 2 hours in seconds
  const [answers, setAnswers] = useState({});

  // Mock exam data
  const examData = {
    subject: 'Chemistry',
    totalQuestions: 50,
    questions: [
      {
        id: 1,
        text: 'The product of atomic mass and metal specific heat is about 6.4. This information was provided by',
        options: [
          { id: 'dalton', text: "Dalton's Law" },
          { id: 'newton', text: "Newton's Law" },
          { id: 'boyle', text: "Boyle's Law" },
          { id: 'avogadro', text: "Avogadro's Law" }
        ]
      },
      // Add more questions as needed
    ]
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmitExam = () => {
    // Add your submission logic here
    router.push('/result'); // Redirect to results page
  };

  const handleEndExam = () => {
    if (window.confirm('Are you sure you want to end the exam?')) {
      handleSubmitExam();
    }
  };

  const handleNext = () => {
    if (currentQuestion < examData.totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestion + 1] || '');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || '');
    }
  };

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerId
    }));
  };

  const calculateProgress = () => {
    return (Object.keys(answers).length / examData.totalQuestions) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium">Subject: {examData.subject}</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Time Remaining</div>
            <div className="text-xl font-bold">{formatTime(timeRemaining)}</div>
          </div>
          <button
            onClick={handleEndExam}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            End Exam
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Exam Question Progress</span>
          <span>{currentQuestion + 1}/{examData.totalQuestions}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <p className="mb-4">
          <span className="font-medium">{currentQuestion + 1}. </span>
          {examData.questions[0].text}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {examData.questions[0].options.map((option) => (
            <label
              key={option.id}
              className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="answer"
                value={option.id}
                checked={selectedAnswer === option.id}
                onChange={() => handleAnswerSelect(option.id)}
                className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
              />
              <span className="ml-3">{option.text}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ExamPage;