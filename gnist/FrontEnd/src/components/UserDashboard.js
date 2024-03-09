import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './UserDashboard.css'; 

function UserDashboard() {
  const { logout } = useAuth0();
  const [activeNavItem, setActiveNavItem] = useState('Profil'); // 'Profil' is set as the default choice

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <div className="navbar">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="navbar-logo" />
        <div className="navbar-menu">
          <div className={`nav-item ${activeNavItem === 'Profil' ? 'active' : ''}`} onClick={() => setActiveNavItem('Profil')}>Profil</div>
          <div className={`nav-item ${activeNavItem === 'Program' ? 'active' : ''}`} onClick={() => setActiveNavItem('Program')}>Program</div>
          <div className={`nav-item ${activeNavItem === 'Meldinger' ? 'active' : ''}`} onClick={() => setActiveNavItem('Meldinger')}>Meldinger</div>
          <div className="nav-item logout-item" onClick={handleLogout}>Logg Ut</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Content that changes based on activeNavItem */}
        {activeNavItem === 'Profil' && (
          <div>
            {/* the profile content will be added here*/}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
