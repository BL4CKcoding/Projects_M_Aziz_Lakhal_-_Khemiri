import React, { useState, useEffect } from 'react';

const InterviewModal = ({ onClose, onSave, applications, recruiters, interviews = [], absences = [], interview = null }) => {
  const [formData, setFormData] = useState({
    candidateId: interview?.candidateId ? String(interview.candidateId) : '',
    date: interview?.date || '',
    time: interview?.time || '',
    duration: interview?.duration || 30,
    recruiterId: interview?.recruiterId ? String(interview.recruiterId) : '',
    status: interview?.status || 'scheduled',
    notes: interview?.notes || ''
  });

  useEffect(() => {
    if (interview) {
      setFormData({
        candidateId: interview.candidateId ? String(interview.candidateId) : '',
        date: interview.date || '',
        time: interview.time || '',
        duration: interview.duration || 30,
        recruiterId: interview.recruiterId ? String(interview.recruiterId) : '',
        status: interview.status || 'scheduled',
        notes: interview.notes || ''
      });
    } else {
      setFormData({
        candidateId: '',
        date: '',
        time: '',
        duration: 30,
        recruiterId: '',
        status: 'scheduled',
        notes: ''
      });
    }
  }, [interview]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      candidateId: parseInt(formData.candidateId),
      recruiterId: parseInt(formData.recruiterId),
      duration: parseInt(formData.duration)
    });
    onClose();
  };

  const parseTimeToMinutes = (t) => {
    if (!t) return null;
    const [hh, mm] = t.split(':').map(Number);
    return hh * 60 + mm;
  };

  const dateKey = formData.date;
  const startMin = parseTimeToMinutes(formData.time);
  const durationMin = parseInt(formData.duration || 0);
  const endMin = startMin != null && durationMin ? startMin + durationMin : null;

  const isOverlap = (s1, e1, s2, e2) => {
    if (s1 == null || e1 == null || s2 == null || e2 == null) return true; // if time incomplete, consider overlapping to be safe
    return s1 < e2 && s2 < e1;
  };

  const unavailableByAbsence = new Set(
    absences.filter(a => a.date === dateKey).map(a => a.recruiterId)
  );

  const unavailableByInterviews = new Set(
    interviews
      .filter(iv => iv.status === 'scheduled' && iv.date === dateKey)
      .filter(iv => {
        // allow the current interview when editing to not block itself
        if (interview && iv.id === interview.id) return false;
        // if time not set yet, block any recruiter with an interview that day
        if (startMin == null || endMin == null) return true;
        const ivStart = parseTimeToMinutes(iv.time);
        const ivEnd = ivStart != null ? ivStart + parseInt(iv.duration || 0) : null;
        return isOverlap(startMin, endMin, ivStart, ivEnd);
      })
      .map(iv => iv.recruiterId)
  );

  const unavailableRecruiterIds = new Set([...
    unavailableByAbsence,
    ...unavailableByInterviews
  ]);

  const availableRecruiters = dateKey
    ? recruiters.filter(r => !unavailableRecruiterIds.has(r.id))
    : recruiters;

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            <i className="fas fa-calendar-check"></i> 
            {interview ? 'Modifier l\'entretien' : 'Planifier un entretien'}
          </h3>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="candidateId">Candidat</label>
            <select 
              id="candidateId" 
              className="form-control" 
              value={formData.candidateId}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner un candidat</option>
              {applications.map(app => (
                <option key={app.id} value={app.id}>
                  {app.firstname} {app.lastname} - {app.position}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="interview-date">Date</label>
              <input 
                type="date" 
                id="date" 
                className="form-control" 
                value={formData.date}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="interview-time">Heure</label>
              <input 
                type="time" 
                id="time" 
                className="form-control" 
                value={formData.time}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="duration">Durée (en minutes)</label>
            <input 
              type="number" 
              id="duration" 
              className="form-control" 
              min="15" 
              max="120" 
              value={formData.duration}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="recruiter">Recruteur</label>
            <select 
              id="recruiterId" 
              className="form-control" 
              value={formData.recruiterId}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner un recruteur</option>
              {availableRecruiters.map(rec => (
                <option key={rec.id} value={rec.id}>
                  {rec.firstname} {rec.lastname} - {rec.position}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="status">Statut</label>
            <select 
              id="status" 
              className="form-control" 
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="scheduled">Planifié</option>
              <option value="completed">Terminé</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea 
              id="notes" 
              className="form-control" 
              rows="4"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn">{interview ? 'Enregistrer' : 'Planifier'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewModal;