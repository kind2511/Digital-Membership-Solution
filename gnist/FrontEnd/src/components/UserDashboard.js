import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import './UserDashboard.css';

function UserDashboard() {
  const { logout, user } = useAuth0();
  const date = new Date().toLocaleDateString();
  const levelColors = ['noob', 'rookie', 'pro', 'legend'];
  const levelNames = { noob: 'Nybegynner', rookie: 'Lærling', pro: 'Erfaren', legend: 'Legende' };
  const userLevelIndex = levelColors.indexOf(user.level?.toLowerCase()) + 1;
  const [memberData, setMemberData] = useState(null);
  const [activeSidebarItem, setActiveSidebarItem] = useState('Profil'); // Default active sidebar item

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };
 
  // for testing
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/digital_medlemsordning/get_member/1', {
          params: { userId: user.sub }
        });
        setMemberData(response.data.member);
      } catch (error) {
        console.error('Error fetching member data:', error);
      }
    };

    if (user.sub) {
      fetchMemberData();
    }
  }, [user.sub]);



  // "Lock" the current page in the browser history the user will not be able to get exit the user dashboard
  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    const handlePopState = (event) => {
      window.history.pushState(null, document.title, window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup the event listener
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="sidebar-logo" />
        </div>
        <div className="menu">
          {/* Update className to include 'active' based on state */}
          <div className={`sidebar-item ${activeSidebarItem === 'Profil' ? 'active' : ''}`} onClick={() => setActiveSidebarItem('Profil')}>Profil</div>
          <div className={`sidebar-item ${activeSidebarItem === 'Innstillinger' ? 'active' : ''}`} onClick={() => setActiveSidebarItem('Innstillinger')}>Innstillinger</div>
          <div className={`sidebar-item ${activeSidebarItem === 'Mine Aktiviteter' ? 'active' : ''}`} onClick={() => setActiveSidebarItem('Mine Aktiviteter')}>Mine Aktiviteter</div>
          <div className={`sidebar-item ${activeSidebarItem === 'Meldinger' ? 'active' : ''}`} onClick={() => setActiveSidebarItem('Meldinger')}>Meldinger</div>
          <div className={`sidebar-item ${activeSidebarItem === 'Hjelp' ? 'active' : ''}`} onClick={() => setActiveSidebarItem('Hjelp')}>Hjelp</div>
          <div className="sidebar-item logout-item" onClick={handleLogout}>Logg Ut</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Conditional rendering based on activeSidebarItem */}
        {activeSidebarItem === 'Profil' && (
          <>
            {/* User's Picture */}
            {user.picture && <img src={user.picture} alt="User" className="user-picture" />}

            {/* Welcome Message */}
            {user.name && <h1 className="welcome-message"> {user.name.split(' ')[0]}!</h1>}

            {/* User Level Indicator */}
            <div className="user-level-indicator">
              {levelColors.map((color, index) => (
                <div key={color} className={`level-section ${color}`} style={{ width: userLevelIndex > index ? '25%' : '0%' }}></div>
              ))}
            </div>

            {/* Display Level Names */}
            <div className="level-names">
              {levelColors.map((color) => (
                <div key={color} className={`level-name ${color}-name`}>{levelNames[color]}</div>
              ))}
            </div>

            {/* Today's Date */}
            <p className="current-date">Dato: {date}</p>
          </>
        )}
      </div>
    </div >
  );
}

export default UserDashboard;
