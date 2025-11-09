import React, { useState, useMemo } from 'react';
import Header from '../components/Header.js';

const Calendar = ({ interviews, applications, recruiters, absences = [], onMenuToggle, onSignIn }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  // Group interviews by date
  const interviewsByDate = useMemo(() => {
    const grouped = {};
    interviews.forEach(interview => {
      const dateKey = interview.date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(interview);
    });
    return grouped;
  }, [interviews]);

  // Group absences by date
  const absencesByDate = useMemo(() => {
    const grouped = {};
    absences.forEach(a => {
      const dateKey = a.date;
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(a);
    });
    return grouped;
  }, [absences]);

  // Get applications for a specific date
  const getApplicationsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return applications.filter(app => app.date === dateStr);
  };

  // Get interviews for a specific date
  const getInterviewsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return interviewsByDate[dateStr] || [];
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(prevDate.getMonth() - 1);
      } else {
        newDate.setMonth(prevDate.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  const handleDateClick = (date) => {
    if (!date) return;
    setSelectedDate(selectedDate && selectedDate.getTime() === date.getTime() ? null : date);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCandidateName = (candidateId) => {
    const app = applications.find(a => a.id === candidateId);
    return app ? `${app.firstname} ${app.lastname}` : 'Candidat inconnu';
  };

  const getRecruiterName = (recruiterId) => {
    const rec = recruiters.find(r => r.id === recruiterId);
    return rec ? `${rec.firstname} ${rec.lastname}` : 'Recruteur inconnu';
  };

  const selectedDateInterviews = selectedDate ? getInterviewsForDate(selectedDate) : [];
  const selectedDateApplications = selectedDate ? getApplicationsForDate(selectedDate) : [];
  const selectedDateAbsences = selectedDate ? (absencesByDate[selectedDate.toISOString().split('T')[0]] || []) : [];

  return (
    <div className="page-content">
      <Header 
        title="Calendrier" 
        icon="fas fa-calendar-alt" 
        onMenuToggle={onMenuToggle} 
        onSignIn={onSignIn}
      />
      
      <section className="calendar-section">
        <div className="calendar-header">
          <h2><i className="fas fa-calendar"></i> {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <div className="calendar-nav">
            <button onClick={() => navigateMonth('prev')} title="Mois précédent">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button onClick={goToToday} title="Aujourd'hui">
              <i className="fas fa-circle"></i>
            </button>
            <button onClick={() => navigateMonth('next')} title="Mois suivant">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          {/* Day headers */}
          {dayNames.map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}

          {/* Calendar days */}
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="calendar-day empty"></div>;
            }

            const dateStr = date.toISOString().split('T')[0];
            const dayInterviews = interviewsByDate[dateStr] || [];
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const dayAbsences = absencesByDate[dateStr] || [];

            return (
              <div
                key={dateStr}
                className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleDateClick(date)}
              >
                <div className="day-number">{date.getDate()}</div>
                {dayAbsences.length > 0 && (
                  <div className="calendar-event-more" title={`${dayAbsences.length} recruteur(s) absent(s)`}>
                    <i className="fas fa-user-times"></i> {dayAbsences.length} absent(s)
                  </div>
                )}
                {dayInterviews.slice(0, 2).map(interview => (
                  <div key={interview.id} className="calendar-event" title={`${interview.time} - ${getCandidateName(interview.candidateId)}`}>
                    <i className="fas fa-calendar-check"></i> {interview.time}
                  </div>
                ))}
                {dayInterviews.length > 2 && (
                  <div className="calendar-event-more">
                    +{dayInterviews.length - 2} autre(s)
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Expanded date details */}
        {selectedDate && (
          <div className="calendar-date-details">
            <div className="date-details-header">
              <h3><i className="fas fa-calendar-day"></i> {formatDate(selectedDate)}</h3>
              <button className="close-details" onClick={() => setSelectedDate(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {selectedDateInterviews.length > 0 && (
              <div className="date-details-section">
                <h4><i className="fas fa-calendar-check"></i> Entretiens ({selectedDateInterviews.length})</h4>
                <div className="date-events-list">
                  {selectedDateInterviews.map(interview => (
                    <div key={interview.id} className="date-event-item">
                      <div className="event-time">{interview.time}</div>
                      <div className="event-content">
                        <div className="event-title">Entretien avec {getCandidateName(interview.candidateId)}</div>
                        <div className="event-meta">
                          <span><i className="fas fa-user"></i> {getRecruiterName(interview.recruiterId)}</span>
                          <span><i className="fas fa-clock"></i> {interview.duration} min</span>
                          <span className={`status ${interview.status}`}>
                            {interview.status === 'scheduled' ? 'Planifié' : 'Terminé'}
                          </span>
                        </div>
                        {interview.notes && (
                          <div className="event-notes">{interview.notes}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedDateApplications.length > 0 && (
              <div className="date-details-section">
                <h4><i className="fas fa-file-alt"></i> Candidatures ({selectedDateApplications.length})</h4>
                <div className="date-events-list">
                  {selectedDateApplications.map(app => (
                    <div key={app.id} className="date-event-item">
                      <div className="event-content">
                        <div className="event-title">{app.firstname} {app.lastname}</div>
                        <div className="event-meta">
                          <span><i className="fas fa-briefcase"></i> {app.position}</span>
                          <span><i className="fas fa-building"></i> {app.department}</span>
                          <span className={`status ${app.status}`}>
                            {app.status === 'pending' ? 'En attente' : 
                             app.status === 'accepted' ? 'Accepté' : 'Refusé'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedDateAbsences.length > 0 && (
              <div className="date-details-section">
                <h4><i className="fas fa-user-times"></i> Absences ({selectedDateAbsences.length})</h4>
                <div className="date-events-list">
                  {selectedDateAbsences.map(a => {
                    const rec = recruiters.find(r => r.id === a.recruiterId);
                    return (
                      <div key={a.id} className="date-event-item">
                        <div className="event-content">
                          <div className="event-title">{rec ? `${rec.firstname} ${rec.lastname}` : 'Recruteur'}</div>
                          <div className="event-meta">
                            <span><i className="fas fa-info-circle"></i> {a.reason || 'Absence'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedDateInterviews.length === 0 && selectedDateApplications.length === 0 && selectedDateAbsences.length === 0 && (
              <div className="date-details-empty">
                <i className="fas fa-calendar-times"></i>
                <p>Aucun événement prévu pour cette date</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Calendar;