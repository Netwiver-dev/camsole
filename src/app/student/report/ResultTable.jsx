"use client";
import React from "react";
import { FaPrint, FaDownload } from "react-icons/fa";

export default function ResultTable() {
  const results = Array(10).fill({
    subject: "Chemistry",
    score: 60,
    percentage: "70%",
    position: "2nd",
    grade: "A1",
    remark: "Excellent",
  });

  // Function to handle printing
  const handlePrint = () => {
    window.print();
  };

  // Function to handle download as CSV
  const handleDownload = () => {
    const csvContent = [
      ["Subjects", "Score", "Percentage", "Position", "Grade", "Remark"],
      ...results.map((result) => [
        result.subject,
        result.score,
        result.percentage,
        result.position,
        result.grade,
        result.remark,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "results.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Result</h2>
        <div className="flex space-x-2">
          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm shadow flex items-center"
          >
            <FaPrint className="mr-2" /> Print
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg text-sm flex items-center"
          >
            <FaDownload className="mr-2" /> Download
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 py-2 px-4 text-left">
                Subjects
              </th>
              <th className="border border-gray-300 py-2 px-4 text-left">
                Score
              </th>
              <th className="border border-gray-300 py-2 px-4 text-left">
                Percentage
              </th>
              <th className="border border-gray-300 py-2 px-4 text-left">
                Position
              </th>
              <th className="border border-gray-300 py-2 px-4 text-left">
                Grade
              </th>
              <th className="border border-gray-300 py-2 px-4 text-left">
                Remark
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td className="py-2 px-4">{result.subject}</td>
                <td className="py-2 px-4">{result.score}</td>
                <td className="py-2 px-4">{result.percentage}</td>
                <td className="py-2 px-4">{result.position}</td>
                <td className="py-2 px-4">{result.grade}</td>
                <td className="py-2 px-4">{result.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}