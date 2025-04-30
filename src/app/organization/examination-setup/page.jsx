"use client";
import React, { useState } from "react";

// Main page component needs to be the default export
const ExaminationSetupPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [examMeta, setExamMeta] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
  });
  const [questions, setQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMetaNext = (meta) => {
    setExamMeta(meta);
    setCurrentStep(2);
  };

  const handleAddQuestion = (q) => {
    setQuestions((prev) => [...prev, q]);
  };

  const goBackMeta = () => setCurrentStep(1);

  const handleFinish = async () => {
    try {
      setIsSubmitting(true);
      const examData = {
        title: examMeta.name,
        description: examMeta.description,
        date: new Date(`${examMeta.date}T${examMeta.time}`),
        duration: examMeta.time,
        questions,
      };
      
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(examData),
      });
      
      if (res.ok) {
        setCurrentStep(3);
      } else {
        alert("Failed to create exam");
      }
    } catch (error) {
      console.error("Error creating exam:", error);
      alert("An error occurred while creating the exam");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
        {currentStep === 1 && (
          <QuestionDetailsForm onNext={handleMetaNext} data={examMeta} />
        )}
        {currentStep === 2 && (
          <SetQuestionForm
            onAdd={handleAddQuestion}
            onFinish={handleFinish}
            goBack={goBackMeta}
            isSubmitting={isSubmitting}
          />
        )}
        {currentStep === 3 && <Congratulations count={questions.length} />}
      </div>
    </div>
  );
};

// Helper components
const QuestionDetailsForm = ({ onNext, data }) => {
  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description);
  const [date, setDate] = useState(data.date);
  const [time, setTime] = useState(data.time || "01:00");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ name, description, date, time });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Exam Details</h2>
      <div>
        <label className="block text-sm">Exam Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm">Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm">Duration</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="00:30">30 Minutes</option>
            <option value="01:00">1 Hour</option>
            <option value="01:30">1.5 Hours</option>
            <option value="02:00">2 Hours</option>
            <option value="03:00">3 Hours</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 w-full py-2 bg-orange-500 text-white rounded"
      >
        Proceed
      </button>
    </form>
  );
};

const SetQuestionForm = ({ onAdd, onFinish, goBack, isSubmitting }) => {
  const [text, setText] = useState("");
  const [questionImage, setQuestionImage] = useState(null);
  const [options, setOptions] = useState(
    Array.from({ length: 4 }, () => ({ text: "", image: null }))
  );
  const [correctIndex, setCorrectIndex] = useState(0);

  const handleQuestionImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setQuestionImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleOptionImageChange = (e, idx) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newOpts = [...options];
        newOpts[idx].image = reader.result;
        setOptions(newOpts);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (!text.trim()) return alert("Question text required");
    onAdd({ text, image: questionImage, options, correctAnswer: correctIndex });
    // reset
    setText("");
    setQuestionImage(null);
    setOptions(Array.from({ length: 4 }, () => ({ text: "", image: null })));
    setCorrectIndex(0);
  };

  return (
    <div className="p-6 space-y-4">
      <button onClick={goBack} className="text-blue-500 hover:underline">
        &larr; Back
      </button>
      <h2 className="text-xl font-semibold">Add Question</h2>
      <div>
        <label className="block text-sm">Question Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter question"
          required
        />
      </div>
      <div>
        <label className="block text-sm">Question Image(optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleQuestionImageChange}
        />
        {questionImage && (
          <img src={questionImage} alt="Preview" className="mt-2 max-h-40" />
        )}
      </div>
      <h3 className="font-medium">Options</h3>
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={opt.text}
            onChange={(e) => {
              const newOpts = [...options];
              newOpts[i].text = e.target.value;
              setOptions(newOpts);
            }}
            placeholder={`Option ${i + 1}`}
            className="flex-1 p-2 border rounded"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleOptionImageChange(e, i)}
          />
          <label className="flex items-center">
            <input
              type="radio"
              name="correct"
              checked={correctIndex === i}
              onChange={() => setCorrectIndex(i)}
              className="mr-1"
            />
            Correct
          </label>
        </div>
      ))}
      <div className="flex gap-4 mt-4">
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-gray-200 rounded"
          disabled={isSubmitting}
        >
          Add Question
        </button>
        <button
          type="button"
          onClick={onFinish}
          disabled={isSubmitting}
          className={`px-4 py-2 text-white rounded ${
            isSubmitting ? "bg-green-300" : "bg-green-500"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : (
            "Finish & Create"
          )}
        </button>
      </div>
    </div>
  );
};

const Congratulations = ({ count }) => {
  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-semibold mb-2">Exam Created!</h2>
      <p>
        You added {count} question(s).
      </p>
    </div>
  );
};

export default ExaminationSetupPage;
