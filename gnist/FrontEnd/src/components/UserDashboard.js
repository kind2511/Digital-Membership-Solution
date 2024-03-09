import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './UserDashboard.css';

function UserDashboard() {
  const { logout } = useAuth0();
  const [activeNavItem, setActiveNavItem] = useState('Profil');
  const [isRegistered, setIsRegistered] = useState(false);
  const date = new Date().toLocaleDateString();

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const toggleRegistration = () => {
    setIsRegistered(!isRegistered);
  };

  return (
    <div className="dashboard-container">
      <div className="navbar">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="navbar-logo" />
        <div className="navbar-menu">
          <div className={`nav-item ${activeNavItem === 'Profil' ? 'active' : ''}`} onClick={() => setActiveNavItem('Profil')}>Profil</div>
          <div className={`nav-item ${activeNavItem === 'Program' ? 'active' : ''}`} onClick={() => setActiveNavItem('Program')}>Program</div>
          <div className={`nav-item ${activeNavItem === 'Meldinger' ? 'active' : ''}`} onClick={() => setActiveNavItem('Meldinger')}>Meldinger</div>
          <div className="nav-item logout-item" onClick={handleLogout}>Logg Ut</div>
        </div>
      </div>

      <div className="main-content">
        <div className="date-block">Dato: {date}</div>
        <div className="registration-status" onClick={toggleRegistration}>
          <input
            type="checkbox"
            checked={isRegistered}
            onChange={toggleRegistration}
            className="register-checkbox"
          />
          Registrer
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
