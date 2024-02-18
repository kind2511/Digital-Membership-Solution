import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './UserDashboard.css';

function UserDashboard() {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <div className="user-dashboard">
      <button className="logout-button" onClick={handleLogout}>Log Out</button>
      <h1>User Dashboard</h1>
      {/* Dashboard content add later */}
    </div>
  );
}

export default UserDashboard;
