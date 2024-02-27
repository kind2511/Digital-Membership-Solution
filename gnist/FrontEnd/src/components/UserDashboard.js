import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './UserDashboard.css';

function UserDashboard() {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="sidebar-logo" />
        </div>
        <div className="menu">
          <div className="sidebar-item">Profil</div>
          <div className="sidebar-item">Innstillinger</div>
          <div className="sidebar-item">Mine Aktiviteter</div>
          <div className="sidebar-item">Meldinger</div>
          <div className="sidebar-item">Hjelp</div>
          <div className="sidebar-item" onClick={handleLogout}>Logg Ut</div>
        </div>
      </div>
      <div className="main-content">
        {/* will be added later */}
      </div>
    </div>
  );
}

export default UserDashboard;
