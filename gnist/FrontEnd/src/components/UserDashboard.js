import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './UserDashboard.css';

function UserDashboard() {
  const { logout, user } = useAuth0();
  const date = new Date().toLocaleDateString();

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

    // "Lock" the current page in the browser's history
  window.history.pushState(null, document.title, window.location.href);
  window.addEventListener('popstate', function(event) {
    window.history.pushState(null, document.title, window.location.href);
  });

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="sidebar-logo" />
        </div>
        <div className="menu">
          <div className="sidebar-item">Innstillinger</div>
          <div className="sidebar-item">Mine Aktiviteter</div>
          <div className="sidebar-item">Meldinger</div>
          <div className="sidebar-item">Hjelp</div>
          <div className="sidebar-item logout-item" onClick={handleLogout}>Logg Ut</div>
        </div>
      </div>
      <div className="main-content">
        {/* User's Picture */}
        {user.picture && <img src={user.picture} alt="User" className="user-picture" />}
        
        {/* User's First Name */}
        {user.name && <h1>Welcome, {user.name.split(' ')[0]}!</h1>}
        
        {/* Today's Date */}
        <p>Dato: {date}</p>
        
        {/* Rest of the dashboard content */}
      </div>
    </div>
  );
}

export default UserDashboard;
