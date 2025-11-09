import React, { useState } from 'react';
import Header from '../components/Header.js';

const SignIn = ({ onMenuToggle, onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder: implement real auth later
    alert('Connexion simulée');
  };

  return (
    <div className="page-content">
      <Header title="Connexion" icon="fas fa-sign-in-alt" onMenuToggle={onMenuToggle} onSignIn={onSignIn} />

      <section className="recruiters-section">
        <div className="section-header">
          <div className="section-title"><i className="fas fa-lock"></i> Se connecter</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input id="password" type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn"><i className="fas fa-sign-in-alt"></i> Connexion</button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default SignIn;


