import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ApplicationsChart = ({ applications, filter = 'week' }) => {
  let labels, data;
  const now = new Date();
  
  if (filter === 'week') {
    labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    data = [];
    
    // Calculate applications for each day of the current week
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - now.getDay() + i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const count = applications.filter(app => {
        const appDate = new Date(app.date);
        return appDate >= dayStart && appDate <= dayEnd;
      }).length;
      
      data.push(count);
    }
  } else if (filter === 'month') {
    labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    data = [];
    
    // Calculate applications for each week of the current month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    for (let week = 0; week < 4; week++) {
      const weekStart = new Date(monthStart);
      weekStart.setDate(monthStart.getDate() + (week * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const count = applications.filter(app => {
        const appDate = new Date(app.date);
        return appDate >= weekStart && appDate <= weekEnd && appDate <= monthEnd;
      }).length;
      
      data.push(count);
    }
  } else {
    labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    data = [];
    
    // Calculate applications for each month of the current year
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(now.getFullYear(), month, 1);
      const monthEnd = new Date(now.getFullYear(), month + 1, 0);
      
      const count = applications.filter(app => {
        const appDate = new Date(app.date);
        return appDate >= monthStart && appDate <= monthEnd;
      }).length;
      
      data.push(count);
    }
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Candidatures',
        data,
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
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
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#cbd5e1'
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default ApplicationsChart;