import React from 'react';

const Header = ({ title, icon, onMenuToggle, onSignIn }) => {
  return (
    <header className="header">
      <h1>
        <i className={icon}></i> {title}
      </h1>
      <div className="header-actions">
        <button className="mobile-menu-btn" onClick={onMenuToggle}>
          <i className="fas fa-bars"></i>
        </button>
        <button className="btn btn-outline" onClick={() => onSignIn && onSignIn()}>
          <i className="fas fa-sign-in-alt"></i> Connexion
        </button>
      </div>
    </header>
  );
};

export default Header;