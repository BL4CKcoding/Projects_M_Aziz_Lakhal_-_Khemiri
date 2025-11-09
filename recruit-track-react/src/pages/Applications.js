import React, { useState } from 'react';
import Header from '../components/Header.js';
import ApplicationModal from '../components/ApplicationModal.js';

const Applications = ({ 
  applications, 
  onMenuToggle,
  onSignIn,
  onAddApplication,
  onUpdateApplication,
  onDeleteApplication
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);

  const handleAdd = () => {
    setEditingApplication(null);
    setShowModal(true);
  };

  const handleEdit = (app) => {
    setEditingApplication(app);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      onDeleteApplication(id);
    }
  };

  const handleSave = (formData) => {
    if (editingApplication) {
      onUpdateApplication(editingApplication.id, formData);
    } else {
      onAddApplication(formData);
    }
    setShowModal(false);
  };

  return (
    <div className="page-content">
      <Header 
        title="Candidatures" 
        icon="fas fa-file-alt" 
        onMenuToggle={onMenuToggle} 
        onSignIn={onSignIn}
      />
      
      <section className="applications-section">
        <div className="section-header">
          <div className="section-title"><i className="fas fa-list"></i> Toutes les candidatures</div>
          <button className="btn" onClick={handleAdd}>
            <i className="fas fa-plus"></i> Ajouter une candidature
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Poste</th>
              <th>Département</th>
              <th>Date de candidature</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td>{app.firstname} {app.lastname}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td>{app.position}</td>
                <td>{app.department}</td>
                <td>{new Date(app.date).toLocaleDateString('fr-FR')}</td>
                <td>
                  <span className={`status ${app.status}`}>
                    {app.status === 'pending' ? 'En attente' : 
                     app.status === 'accepted' ? 'Accepté' : 'Refusé'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-action btn-action-modify"
                      onClick={() => handleEdit(app)}
                    >
                      Modifier
                    </button>
                    <button 
                      className="btn-action btn-action-delete"
                      onClick={() => handleDelete(app.id)}
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
        <ApplicationModal
          application={editingApplication}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Applications;