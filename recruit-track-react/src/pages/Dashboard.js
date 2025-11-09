import React, { useState, useMemo } from 'react';
import Header from '../components/Header.js';
import StatusChart from '../components/Charts/StatusChart.js';
import ApplicationsChart from '../components/Charts/ApplicationsChart.js';

const Dashboard = ({ 
  applications, 
  interviews, 
  recruiters,
  onMenuToggle,
  onSignIn
}) => {
  const [chartFilter, setChartFilter] = useState('month');

  const totalCandidates = applications.length;
  const pendingCandidates = applications.filter(app => app.status === 'pending').length;
  const acceptedCandidates = applications.filter(app => app.status === 'accepted').length;
  const rejectedCandidates = applications.filter(app => app.status === 'rejected').length;
  const totalInterviews = interviews.length;
  
  const today = new Date().toISOString().split('T')[0];
  const todayInterviews = interviews.filter(i => i.date === today).length;

  const stats = [
    { title: 'Candidats total', value: totalCandidates, change: '12% ce mois', positive: true, icon: 'fas fa-users' },
    { title: 'En attente', value: pendingCandidates, change: '3 cette semaine', positive: true, icon: 'fas fa-clock' },
    { title: 'Acceptés', value: acceptedCandidates, change: '1 cette semaine', positive: true, icon: 'fas fa-check-circle' },
    { title: 'Refusés', value: rejectedCandidates, change: '5% ce mois', positive: true, icon: 'fas fa-times-circle' },
    { title: 'Entretiens planifiés', value: totalInterviews, change: '2 cette semaine', positive: true, icon: 'fas fa-calendar-check' },
    { title: "Entretiens d'aujourd'hui", value: todayInterviews, change: '1 aujourd\'hui', positive: true, icon: 'fas fa-calendar-day' }
  ];

  const recentApplications = applications
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Get upcoming interviews (future interviews)
  const upcomingInterviews = useMemo(() => {
    const now = new Date();
    return interviews
      .filter(interview => {
        const interviewDate = new Date(interview.date);
        return interviewDate >= now;
      })
      .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
      .slice(0, 5)
      .map(interview => {
        const application = applications.find(app => app.id === interview.candidateId);
        const recruiter = recruiters.find(rec => rec.id === interview.recruiterId);
        return {
          ...interview,
          candidateName: application ? `${application.firstname} ${application.lastname}` : 'Candidat inconnu',
          recruiterName: recruiter ? `${recruiter.firstname} ${recruiter.lastname}` : 'Recruteur inconnu'
        };
      });
  }, [interviews, applications, recruiters]);

  // Calculate evolution data for the chart
  const evolutionData = useMemo(() => {
    const now = new Date();
    const months = [];
    const monthData = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
      months.push(monthName);
      
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const count = applications.filter(app => {
        const appDate = new Date(app.date);
        return appDate >= monthStart && appDate <= monthEnd;
      }).length;
      
      monthData.push(count);
    }
    
    return { months, data: monthData };
  }, [applications]);

  return (
    <div className="page-content">
      <Header 
        title="Tableau de bord" 
        icon="fas fa-chart-bar" 
        onMenuToggle={onMenuToggle} 
        onSignIn={onSignIn}
      />

      <section className="stats-cards">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-title"><i className={stat.icon}></i> {stat.title}</div>
            <div className="stat-value">{stat.value}</div>
            <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
              <i className={`fas fa-arrow-${stat.positive ? 'up' : 'down'}`}></i> {stat.change}
            </div>
          </div>
        ))}
      </section>

      <section className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title"><i className="fas fa-chart-line"></i> Évolution des candidatures</div>
            <select 
              className="form-control" 
              style={{ width: 'auto', padding: '8px 35px 8px 12px' }}
              value={chartFilter}
              onChange={(e) => setChartFilter(e.target.value)}
            >
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
              <option value="year">Année</option>
            </select>
          </div>
          <div className="chart-container">
            <ApplicationsChart applications={applications} filter={chartFilter} />
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title"><i className="fas fa-chart-pie"></i> Statut des candidatures</div>
          </div>
          <div className="chart-container">
            <StatusChart applications={applications} />
          </div>
        </div>
      </section>

      <section className="applications-section">
        <div className="section-header">
          <div className="section-title"><i className="fas fa-list"></i> Candidatures récentes</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Poste</th>
              <th>Date de candidature</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {recentApplications.map(app => (
              <tr key={app.id}>
                <td>{app.firstname} {app.lastname}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td>{app.position}</td>
                <td>{new Date(app.date).toLocaleDateString('fr-FR')}</td>
                <td>
                  <span className={`status ${app.status}`}>
                    {app.status === 'pending' ? 'En attente' : 
                     app.status === 'accepted' ? 'Accepté' : 'Refusé'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="interviews-section">
        <div className="section-header">
          <div className="section-title"><i className="fas fa-calendar-check"></i> Prochains entretiens</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Heure</th>
              <th>Candidat</th>
              <th>Recruteur</th>
              <th>Durée</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map(interview => (
                <tr key={interview.id}>
                  <td>{new Date(interview.date).toLocaleDateString('fr-FR')}</td>
                  <td>{interview.time}</td>
                  <td>{interview.candidateName}</td>
                  <td>{interview.recruiterName}</td>
                  <td>{interview.duration} min</td>
                  <td>
                    <span className={`status ${interview.status}`}>
                      {interview.status === 'scheduled' ? 'Planifié' : 'Terminé'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--light-text)' }}>
                  Aucun entretien à venir
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;