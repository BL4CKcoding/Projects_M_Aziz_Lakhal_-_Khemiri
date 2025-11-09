import React from 'react';

const Sidebar = ({ activePage, onPageChange, isActive, onToggle }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fas fa-chart-bar', label: 'Tableau de bord' },
    { id: 'applications', icon: 'fas fa-file-alt', label: 'Candidatures' },
    { id: 'interviews', icon: 'fas fa-calendar-check', label: 'Entretiens' },
    { id: 'calendar', icon: 'fas fa-calendar-alt', label: 'Calendrier' },
    { id: 'statistics', icon: 'fas fa-chart-pie', label: 'Statistiques' },
    { id: 'recruiters', icon: 'fas fa-users', label: 'Recruteurs' },
    { id: 'absences', icon: 'fas fa-user-times', label: 'Absences' }
  ];

  return (
    <aside className={`sidebar ${isActive ? 'active' : ''}`}>
      <div className="logo">
        <div className="logo-icon">RT</div>
        <div className="logo-text">RecruitTrack</div>
      </div>
      <ul className="nav-menu">
        {menuItems.map(item => (
          <li key={item.id} className="nav-item">
            <a 
              href="#" 
              className={`nav-link ${activePage === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(item.id);
              }}
            >
              <i className={item.icon}></i> {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;