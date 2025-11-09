import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.js';
import Dashboard from './pages/Dashboard.js';
import Applications from './pages/Applications.js';
import Interviews from './pages/Interviews.js';
import Calendar from './pages/Calendar.js';
import Statistics from './pages/Statistics.js';
import Recruiters from './pages/Recruiters.js';
import Absences from './pages/Absences.js';
import SignIn from './pages/SignIn.js';
import { sampleApplications, sampleInterviews, sampleRecruiters, sampleAbsences } from './utils/data.js';

function App() {
  const [isBootLoading, setIsBootLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [sidebarActive, setSidebarActive] = useState(false);

  useEffect(() => {
    // Show a splash screen for 1 second on initial load
    const splashTimer = setTimeout(() => setIsBootLoading(false), 1000);

    const storedApplications = localStorage.getItem('applications');
    const storedInterviews = localStorage.getItem('interviews');
    const storedRecruiters = localStorage.getItem('recruiters');
    const storedAbsences = localStorage.getItem('absences');

    setApplications(storedApplications ? JSON.parse(storedApplications) : sampleApplications);
    setInterviews(storedInterviews ? JSON.parse(storedInterviews) : sampleInterviews);
    setRecruiters(storedRecruiters ? JSON.parse(storedRecruiters) : sampleRecruiters);
    setAbsences(storedAbsences ? JSON.parse(storedAbsences) : sampleAbsences);
    return () => clearTimeout(splashTimer);
  }, []);

  const saveData = (apps = null, ints = null, recs = null, abss = null) => {
    localStorage.setItem('applications', JSON.stringify(apps !== null ? apps : applications));
    localStorage.setItem('interviews', JSON.stringify(ints !== null ? ints : interviews));
    localStorage.setItem('recruiters', JSON.stringify(recs !== null ? recs : recruiters));
    localStorage.setItem('absences', JSON.stringify(abss !== null ? abss : absences));
  };

  const addApplication = (application) => {
    const newApplication = {
      ...application,
      id: applications.length + 1,
      date: new Date().toISOString().split('T')[0]
    };
    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    saveData(updatedApplications, null, null);
  };

  const updateApplication = (id, updatedApp) => {
    const updatedApplications = applications.map(app => 
      app.id === id ? { ...app, ...updatedApp } : app
    );
    setApplications(updatedApplications);
    saveData(updatedApplications, null, null);
  };

  const deleteApplication = (id) => {
    const updatedApplications = applications.filter(app => app.id !== id);
    setApplications(updatedApplications);
    saveData(updatedApplications, null, null);
  };

  const addInterview = (interview) => {
    const newInterview = {
      ...interview,
      id: interviews.length + 1,
      status: interview.status || 'scheduled'
    };
    const updatedInterviews = [...interviews, newInterview];
    setInterviews(updatedInterviews);
    saveData(null, updatedInterviews, null);
  };

  const updateInterview = (id, updatedInterview) => {
    const updatedInterviews = interviews.map(interview => 
      interview.id === id ? { ...interview, ...updatedInterview } : interview
    );
    setInterviews(updatedInterviews);
    saveData(null, updatedInterviews, null);
  };

  const deleteInterview = (id) => {
    const updatedInterviews = interviews.filter(interview => interview.id !== id);
    setInterviews(updatedInterviews);
    saveData(null, updatedInterviews, null);
  };

  const addRecruiter = (recruiter) => {
    const newRecruiter = {
      ...recruiter,
      id: recruiters.length + 1
    };
    const updatedRecruiters = [...recruiters, newRecruiter];
    setRecruiters(updatedRecruiters);
    saveData(null, null, updatedRecruiters, null);
  };

  const updateRecruiter = (id, updatedRecruiter) => {
    const updatedRecruiters = recruiters.map(r => r.id === id ? { ...r, ...updatedRecruiter } : r);
    setRecruiters(updatedRecruiters);
    saveData(null, null, updatedRecruiters, null);
  };

  const deleteRecruiter = (id) => {
    const updatedRecruiters = recruiters.filter(r => r.id !== id);
    setRecruiters(updatedRecruiters);
    // Also remove absences for this recruiter
    const updatedAbsences = absences.filter(a => a.recruiterId !== id);
    setAbsences(updatedAbsences);
    saveData(null, null, updatedRecruiters, updatedAbsences);
  };

  const addAbsence = (absence) => {
    const newAbsence = {
      ...absence,
      id: absences.length + 1,
      recruiterId: parseInt(absence.recruiterId)
    };
    const updatedAbsences = [...absences, newAbsence];
    setAbsences(updatedAbsences);
    saveData(null, null, null, updatedAbsences);
  };

  const deleteAbsence = (id) => {
    const updatedAbsences = absences.filter(a => a.id !== id);
    setAbsences(updatedAbsences);
    saveData(null, null, null, updatedAbsences);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    setSidebarActive(false);
  };

  const handleMenuToggle = () => {
    setSidebarActive(!sidebarActive);
  };

  const handleSignInClick = () => {
    setActivePage('signin');
  };

  const renderPage = () => {
    const commonProps = {
      applications,
      interviews,
      recruiters,
      absences,
      onSignIn: handleSignInClick,
      onAddApplication: addApplication,
      onUpdateApplication: updateApplication,
      onDeleteApplication: deleteApplication,
      onAddInterview: addInterview,
      onUpdateInterview: updateInterview,
      onDeleteInterview: deleteInterview,
      onAddRecruiter: addRecruiter,
      onUpdateRecruiter: updateRecruiter,
      onDeleteRecruiter: deleteRecruiter,
      onAddAbsence: addAbsence,
      onDeleteAbsence: deleteAbsence,
      onMenuToggle: handleMenuToggle
    };

    switch (activePage) {
      case 'dashboard':
        return <Dashboard {...commonProps} />;
      case 'applications':
        return <Applications {...commonProps} />;
      case 'interviews':
        return <Interviews {...commonProps} />;
      case 'calendar':
        return <Calendar {...commonProps} />;
      case 'statistics':
        return <Statistics {...commonProps} />;
      case 'recruiters':
        return <Recruiters {...commonProps} />;
      case 'absences':
        return <Absences {...commonProps} />;
      case 'signin':
        return <SignIn onMenuToggle={handleMenuToggle} onSignIn={handleSignInClick} />;
      default:
        return <Dashboard {...commonProps} />;
    }
  };

  if (isBootLoading) {
    return (
      <div className="splash-screen">
        <div className="splash-spinner" />
        <div className="splash-text">Loading…</div>
      </div>
    );
  }

  return (
    <div className="container">
      <Sidebar 
        activePage={activePage} 
        onPageChange={handlePageChange}
        isActive={sidebarActive}
        onToggle={handleMenuToggle}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;