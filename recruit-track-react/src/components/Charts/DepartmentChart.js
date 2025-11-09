import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DepartmentChart = ({ applications }) => {
  // Collect unique departments
  const departmentsSet = new Set();
  applications.forEach(app => {
    if (app.department) departmentsSet.add(app.department);
  });
  const departments = Array.from(departmentsSet);

  // Count per status per department
  const countBy = (status) =>
    departments.map(dept =>
      applications.filter(app => app.department === dept && app.status === status).length
    );

  const dataPending = countBy('pending');
  const dataAccepted = countBy('accepted');
  const dataRejected = countBy('rejected'); // "refused" demandé → correspond à "rejected" dans les données

  const chartData = {
    labels: departments,
    datasets: [
      {
        label: 'En attente',
        data: dataPending,
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1
      },
      {
        label: 'Acceptées',
        data: dataAccepted,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1
      },
      {
        label: 'Refusées',
        data: dataRejected,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { color: '#cbd5e1' }
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#cbd5e1'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#cbd5e1'
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default DepartmentChart;