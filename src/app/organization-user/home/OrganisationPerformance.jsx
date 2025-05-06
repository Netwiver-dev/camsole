'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function OrganisationPerformance({ scoreDistribution, subjects = [] }) {
  // Prepare score distribution chart data
  const scoreDistributionData = {
    labels: ['Excellent (90-100%)', 'Good (75-89%)', 'Average (60-74%)', 'Needs Improvement (<60%)'],
    datasets: [{
      label: 'Exams',
      data: [
        scoreDistribution?.excellent || 0,
        scoreDistribution?.good || 0,
        scoreDistribution?.average || 0,
        scoreDistribution?.needsImprovement || 0
      ],
      backgroundColor: [
        'rgba(52, 211, 153, 0.7)',
        'rgba(59, 130, 246, 0.7)',
        'rgba(251, 191, 36, 0.7)',
        'rgba(239, 68, 68, 0.7)'
      ],
      borderColor: [
        'rgba(52, 211, 153, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(251, 191, 36, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 1
    }]
  };

  // Prepare subjects data
  const subjectsData = {
    labels: subjects.map(subject => subject.name),
    datasets: [{
      label: 'Average Score (%)',
      data: subjects.map(subject => subject.averageScore),
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1
    }]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Performance Doughnut Chart */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Your Performance</h2>
        <div className="h-64">
          <Doughnut 
            data={scoreDistributionData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    boxWidth: 12,
                    font: { size: 10 }
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Subject Performance Bar Chart */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Performance by Subject</h2>
        <div className="h-64">
          {subjects.length > 0 ? (
            <Bar 
              data={subjectsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                      display: true,
                      text: 'Average Score (%)'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Subjects'
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No subject data available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
