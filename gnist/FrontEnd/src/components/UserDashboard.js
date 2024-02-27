import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import './UserDashboard.css';

function UserDashboard() {
  const { logout, user } = useAuth0();
  const date = new Date().toLocaleDateString();
  const levelColors = ['noob', 'rookie', 'pro', 'legend'];
  const userLevelIndex = levelColors.indexOf(user.level?.toLowerCase()) + 1;
  const [memberData, setMemberData] = useState(null); 

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  useEffect(() => {
    // test to get member data
    const fetchMemberData = async () => {
      try {
        const response = await axios.get('/api/member-data', { params: { userId: user.sub } });
        setMemberData(response.data);
      } catch (error) {
        console.error('There was an error fetching the member data:', error);
      }
    };

    if (user.sub) { // Only fetch member data if user.sub exist
      fetchMemberData();
    }
  }, [user.sub]); // No  include setMemberData here

  // "Lock" the current page in the browser's history
  window.history.pushState(null, document.title, window.location.href);
  window.addEventListener('popstate', function (event) {
    window.history.pushState(null, document.title, window.location.href);
  });

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
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

      {/* Main Content- the white page in user dashboard */}
      <div className="main-content">
        {/* Users Picture */}
        {user.picture && <img src={user.picture} alt="User" className="user-picture" />}

        {/* Welcome Message */}
        {user.name && <h1 className="welcome-message">Velkommen {user.name.split(' ')[0]}!</h1>}

        {/* User Level Indicator */}
        <div className="user-level-indicator">
          {levelColors.map((color, index) => (
            <div key={color} className={`level-section ${color}`} style={{ width: userLevelIndex > index ? '25%' : '0%' }}></div>
          ))}
        </div>

        {/* Todays Date */}
        <p className="current-date">Dato: {date}</p>

      </div>
    </div>
  );
}

export default UserDashboard;
