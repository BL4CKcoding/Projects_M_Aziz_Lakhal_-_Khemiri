import React, { useState } from 'react';
import Header from '../components/Header.js';
import InterviewModal from '../components/InterviewModal.js';

const Interviews = ({ 
  interviews, 
  applications,
  recruiters,
  absences,
  onMenuToggle,
  onSignIn,
  onAddInterview,
  onUpdateInterview,
  onDeleteInterview
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);

  const handleAdd = () => {
    setEditingInterview(null);
    setShowModal(true);
  };

  const handleEdit = (interview) => {
    setEditingInterview(interview);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet entretien ?')) {
      onDeleteInterview(id);
    }
  };

  const handleSave = (formData) => {
    if (editingInterview) {
      onUpdateInterview(editingInterview.id, formData);
    } else {
      onAddInterview(formData);
    }
    setShowModal(false);
  };

  // Get candidate and recruiter names for display
  const interviewsWithNames = interviews.map(interview => {
    const application = applications.find(app => app.id === interview.candidateId);
    const recruiter = recruiters.find(rec => rec.id === interview.recruiterId);
    return {
      ...interview,
      candidateName: application ? `${application.firstname} ${application.lastname}` : 'Candidat inconnu',
      recruiterName: recruiter ? `${recruiter.firstname} ${recruiter.lastname}` : 'Recruteur inconnu'
    };
  });

  return (
    <div className="page-content">
      <Header 
        title="Entretiens" 
        icon="fas fa-calendar-check" 
        onMenuToggle={onMenuToggle} 
        onSignIn={onSignIn}
      />
      
      <section className="interviews-section">
        <div className="section-header">
          <div className="section-title"><i className="fas fa-list"></i> Entretiens planifiés</div>
          <button className="btn" onClick={handleAdd}>
            <i className="fas fa-plus"></i> Planifier un entretien
          </button>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviewsWithNames.map(interview => (
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
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-action btn-action-modify"
                      onClick={() => handleEdit(interview)}
                    >
                      Modifier
                    </button>
                    <button 
                      className="btn-action btn-action-delete"
                      onClick={() => handleDelete(interview.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {showModal && (
        <InterviewModal
          interview={editingInterview}
          applications={applications}
          recruiters={recruiters}
          interviews={interviews}
          absences={absences}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Interviews;