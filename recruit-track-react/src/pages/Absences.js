import React, { useState } from 'react';
import Header from '../components/Header.js';

const Absences = ({ recruiters, absences, onAddAbsence, onDeleteAbsence, onMenuToggle, onSignIn }) => {
  const [formData, setFormData] = useState({ recruiterId: '', date: '', reason: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.recruiterId || !formData.date) return;
    onAddAbsence(formData);
    setFormData({ recruiterId: '', date: '', reason: '' });
  };

  const getRecruiterName = (id) => {
    const r = recruiters.find(x => x.id === id);
    return r ? `${r.firstname} ${r.lastname}` : 'Inconnu';
  };

  // sort by date desc
  const sorted = [...absences].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="page-content">
      <Header 
        title="Absences"
        icon="fas fa-user-times"
        onMenuToggle={onMenuToggle}
        onSignIn={onSignIn}
      />

      <section className="recruiters-section">
        <div className="section-header">
          <div className="section-title"><i className="fas fa-plus-circle"></i> Déclarer une absence</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="recruiterId">Recruteur</label>
              <select id="recruiterId" className="form-control" value={formData.recruiterId} onChange={handleChange} required>
                <option value="">Sélectionner un recruteur</option>
                {recruiters.map(r => (
                  <option key={r.id} value={r.id}>{r.firstname} {r.lastname} - {r.position}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="date">Date d'absence</label>
              <input type="date" id="date" className="form-control" value={formData.date} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="reason">Raison (facultatif)</label>
            <input type="text" id="reason" className="form-control" value={formData.reason} onChange={handleChange} placeholder="Congé, maladie, etc." />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn"><i className="fas fa-save"></i> Enregistrer</button>
          </div>
        </form>
      </section>

      <section className="recruiters-section">
        <div className="section-header">
          <div className="section-title"><i className="fas fa-list"></i> Jours d'absence</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Recruteur</th>
              <th>Date</th>
              <th>Raison</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(a => (
              <tr key={a.id}>
                <td>{getRecruiterName(a.recruiterId)}</td>
                <td>{new Date(a.date).toLocaleDateString('fr-FR')}</td>
                <td>{a.reason || '-'}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action btn-action-delete btn-sm" onClick={() => onDeleteAbsence(a.id)}>
                      <i className="fas fa-trash"></i> Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--light-text)' }}>Aucune absence</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Absences;