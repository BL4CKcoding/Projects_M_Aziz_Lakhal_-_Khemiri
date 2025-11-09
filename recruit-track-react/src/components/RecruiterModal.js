import React, { useState, useEffect } from 'react';

const RecruiterModal = ({ onClose, onSave, recruiter = null }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    position: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (recruiter) {
      setFormData({
        firstname: recruiter.firstname || '',
        lastname: recruiter.lastname || '',
        position: recruiter.position || '',
        email: recruiter.email || '',
        phone: recruiter.phone || ''
      });
    } else {
      setFormData({ firstname: '', lastname: '', position: '', email: '', phone: '' });
    }
  }, [recruiter]);

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
            <i className="fas fa-user-plus"></i> {recruiter ? 'Modifier un recruteur' : 'Ajouter un recruteur'}
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
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn">{recruiter ? 'Enregistrer' : 'Ajouter'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruiterModal;