import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DepartmentPieChart = ({ applications }) => {
  const departmentCounts = {};
  applications.forEach(app => {
    departmentCounts[app.department] = (departmentCounts[app.department] || 0) + 1;
  });

  const departments = Object.keys(departmentCounts);
  const departmentData = departments.map(dept => departmentCounts[dept]);

  const chartData = {
    labels: departments,
    datasets: [
      {
        data: departmentData,
        backgroundColor: [
          'rgba(124, 58, 237, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)'
        ],
        borderColor: [
          'rgba(124, 58, 237, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(14, 165, 233, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          padding: 15
        }
      }
    }
  };

  return <Doughnut data={chartData} options={options} />;
};

export default DepartmentPieChart;

