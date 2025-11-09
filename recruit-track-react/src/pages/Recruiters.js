import React, { useState } from 'react';
import Header from '../components/Header.js';
import RecruiterModal from '../components/RecruiterModal.js';

const Recruiters = ({ 
  recruiters, 
  onMenuToggle,
  onSignIn,
  onAddRecruiter,
  onUpdateRecruiter,
  onDeleteRecruiter
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingRecruiter, setEditingRecruiter] = useState(null);

  const handleAdd = () => {
    setShowModal(true);
  };

  const handleSave = (formData) => {
    if (editingRecruiter) {
      onUpdateRecruiter(editingRecruiter.id, formData);
    } else {
      onAddRecruiter(formData);
    }
    setShowModal(false);
    setEditingRecruiter(null);
  };

  const handleEdit = (recruiter) => {
    setEditingRecruiter(recruiter);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Supprimer ce recruteur ?')) {
      onDeleteRecruiter(id);
    }
  };

  return (
    <div className="page-content">
      <Header 
        title="Recruteurs" 
        icon="fas fa-users" 
        onMenuToggle={onMenuToggle} 
        onSignIn={onSignIn}
      />
      
      <section className="recruiters-section">
        <div className="section-header">
          <div className="section-title"><i className="fas fa-list"></i> Liste des recruteurs</div>
          <button className="btn" onClick={handleAdd}>
            <i className="fas fa-plus"></i> Ajouter un recruteur
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Poste</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recruiters.map(recruiter => (
              <tr key={recruiter.id}>
                <td>{recruiter.firstname} {recruiter.lastname}</td>
                <td>{recruiter.position}</td>
                <td>{recruiter.email}</td>
                <td>{recruiter.phone}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action btn-action-modify btn-sm" onClick={() => handleEdit(recruiter)}>
                      <i className="fas fa-edit"></i> Modifier
                    </button>
                    <button className="btn-action btn-action-delete btn-sm" onClick={() => handleDelete(recruiter.id)}>
                      <i className="fas fa-trash"></i> Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {showModal && (
        <RecruiterModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          recruiter={editingRecruiter}
        />
      )}
    </div>
  );
};

export default Recruiters;