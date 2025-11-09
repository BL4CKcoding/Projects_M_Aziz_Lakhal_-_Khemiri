import React, { useState } from 'react';

const ApplicationModal = ({ onClose, onSave, application = null }) => {
  const [formData, setFormData] = useState({
    firstname: application?.firstname || '',
    lastname: application?.lastname || '',
    email: application?.email || '',
    phone: application?.phone || '',
    department: application?.department || '',
    position: application?.position || '',
    cv: application?.cv || '',
    status: application?.status || 'pending',
    notes: application?.notes || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            <i className="fas fa-file-alt"></i> 
            {application ? 'Modifier la candidature' : 'Nouvelle candidature'}
          </h3>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstname">Prénom</label>
              <input 
                type="text" 
                id="firstname" 
                className="form-control" 
                value={formData.firstname}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastname">Nom</label>
              <input 
                type="text" 
                id="lastname" 
                className="form-control" 
                value={formData.lastname}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              className="form-control" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Téléphone</label>
            <input 
              type="tel" 
              id="phone" 
              className="form-control" 
              value={formData.phone}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Département</label>
            <input 
              type="text" 
              id="department" 
              className="form-control" 
              value={formData.department}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="position">Poste</label>
            <input 
              type="text" 
              id="position" 
              className="form-control" 
              value={formData.position}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="cv">Lien du CV</label>
            <input 
              type="text" 
              id="cv" 
              className="form-control" 
              value={formData.cv}
              onChange={handleChange}
            />
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
              <option value="pending">En attente</option>
              <option value="accepted">Accepté</option>
              <option value="rejected">Refusé</option>
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
            <button type="submit" className="btn">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;