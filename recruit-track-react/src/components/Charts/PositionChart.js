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

const PositionChart = ({ applications }) => {
  const positionCounts = {};
  applications.forEach(app => {
    const key = app.position || 'Non spécifié';
    positionCounts[key] = (positionCounts[key] || 0) + 1;
  });

  const positions = Object.keys(positionCounts);
  const positionData = positions.map(pos => positionCounts[pos]);

  const chartData = {
    labels: positions,
    datasets: [
      {
        label: 'Candidatures',
        data: positionData,
        backgroundColor: 'rgba(124, 58, 237, 0.8)',
        borderColor: 'rgba(124, 58, 237, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
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

export default PositionChart;


