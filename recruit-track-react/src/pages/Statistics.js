import React, { useMemo } from 'react';
import Header from '../components/Header.js';
import DepartmentChart from '../components/Charts/DepartmentChart.js';
import DepartmentPieChart from '../components/Charts/DepartmentPieChart.js';
import PositionChart from '../components/Charts/PositionChart.js';
import PositionPieChart from '../components/Charts/PositionPieChart.js';

const Statistics = ({ applications, interviews, onMenuToggle, onSignIn }) => {
  // Calculate metrics
  const metrics = useMemo(() => {
    const total = applications.length;
    const accepted = applications.filter(app => app.status === 'accepted').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    
    const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0;
    const rejectionRate = total > 0 ? Math.round((rejected / total) * 100) : 0;
    
    // Calculate average interview duration
    const totalDuration = interviews.reduce((sum, int) => sum + (int.duration || 0), 0);
    const avgDuration = interviews.length > 0 ? Math.round(totalDuration / interviews.length) : 0;
    
    // Calculate applications per month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);
    
    const monthApplications = applications.filter(app => {
      const appDate = new Date(app.date);
      return appDate >= monthStart && appDate <= monthEnd;
    }).length;
    
    return {
      acceptanceRate,
      rejectionRate,
      avgDuration,
      monthApplications
    };
  }, [applications, interviews]);

  return (
    <div className="page-content">
      <Header 
        title="Statistiques" 
        icon="fas fa-chart-pie" 
        onMenuToggle={onMenuToggle} 
        onSignIn={onSignIn}
      />
      
      <section className="stats-cards">
        <div className="stat-card">
          <div className="stat-title"><i className="fas fa-check-circle"></i> Taux d'acceptation</div>
          <div className="stat-value">{metrics.acceptanceRate}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-title"><i className="fas fa-times-circle"></i> Taux de refus</div>
          <div className="stat-value">{metrics.rejectionRate}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-title"><i className="fas fa-clock"></i> Temps moyen des entretiens</div>
          <div className="stat-value">{metrics.avgDuration} min</div>
        </div>
        <div className="stat-card">
          <div className="stat-title"><i className="fas fa-calendar-alt"></i> Candidatures/mois</div>
          <div className="stat-value">{metrics.monthApplications}</div>
        </div>
      </section>

      <section className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title"><i className="fas fa-chart-bar"></i> Candidatures par département</div>
          </div>
          <div className="chart-container">
            <DepartmentChart applications={applications} />
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title"><i className="fas fa-chart-pie"></i> Répartition par département</div>
          </div>
          <div className="chart-container">
            <DepartmentPieChart applications={applications} />
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title"><i className="fas fa-chart-bar"></i> Candidatures par poste</div>
          </div>
          <div className="chart-container">
            <PositionChart applications={applications} />
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title"><i className="fas fa-chart-pie"></i> Répartition par poste</div>
          </div>
          <div className="chart-container">
            <PositionPieChart applications={applications} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Statistics;