import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PositionPieChart = ({ applications }) => {
  const positionCounts = {};
  applications.forEach(app => {
    const key = app.position || 'Non spécifié';
    positionCounts[key] = (positionCounts[key] || 0) + 1;
  });

  const positions = Object.keys(positionCounts);
  const positionData = positions.map(pos => positionCounts[pos]);

  const palette = [
    'rgba(124, 58, 237, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(59, 130, 246, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(14, 165, 233, 0.8)'
  ];

  const borderPalette = [
    'rgba(124, 58, 237, 1)',
    'rgba(16, 185, 129, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(59, 130, 246, 1)',
    'rgba(139, 92, 246, 1)',
    'rgba(236, 72, 153, 1)',
    'rgba(14, 165, 233, 1)'
  ];

  const chartData = {
    labels: positions,
    datasets: [
      {
        data: positionData,
        backgroundColor: positions.map((_, i) => palette[i % palette.length]),
        borderColor: positions.map((_, i) => borderPalette[i % borderPalette.length]),
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

export default PositionPieChart;


