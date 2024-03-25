import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import './UserDashboard.css';
import ProgramComponent from './ProgramComponent';
import MeldingerComponent from './MeldingerComponent';
import UserProfilePicture from './UserProfilePicture';
import RegistrationStatus from './RegistrationStatus';
import TodayActivitiesComponent from './TodayActivitiesComponent';
import MinMening from './MinMening';

function UserDashboard() {
  const { logout, user, isAuthenticated } = useAuth0();
  const [activeNavItem, setActiveNavItem] = useState(localStorage.getItem('activeNavItem') || 'Profil');
  const [isRegistered, setIsRegistered] = useState(false);
  const [profileImg, setProfileImg] = useState(localStorage.getItem('profileImg') || '');
  const [firstName, setFirstName] = useState('');
  const [level, setLevel] = useState(0);
  const baseApiUrl = 'http://localhost:8000'; // TEST new approach
  const date = new Date().toLocaleDateString();
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for controlling the visibility of logout modal

  useEffect(() => {
    if (isAuthenticated && user) {
      axios.get(`${baseApiUrl}/digital_medlemsordning/get_member/${user.sub}`)
        .then(response => {
          const memberData = response.data.data.member;
          setFirstName(memberData.first_name);
          setLevel(memberData.level);
          const fullProfilePicUrl = memberData.profile_pic.startsWith('http') ? memberData.profile_pic : `${baseApiUrl}${memberData.profile_pic}`;
          setProfileImg(fullProfilePicUrl);
          localStorage.setItem('profileImg', fullProfilePicUrl);
        })
        .catch(error => {
          console.error("Failed to fetch user data:", error);
        });
    }
  }, [isAuthenticated, user, baseApiUrl]);

  const handleLogoutConfirmation = () => {
    localStorage.removeItem('isRegistered');
    logout({ returnTo: window.location.origin });
  };

  const renderContent = () => {
    switch (activeNavItem) {
      case 'Profil':
        return (
          <div className="profile-content">
            <div className="date-block">Dato: {date}</div>
            <RegistrationStatus userSub={user.sub} isRegistered={isRegistered} setIsRegistered={setIsRegistered} />
            <UserProfilePicture profileImg={profileImg} setProfileImg={setProfileImg} />
            <div className="user-info">
              <div className="user-name">Navn: {firstName.toUpperCase()}</div>
              <div className="user-level">Nivå: {level}</div>
            </div>
            <TodayActivitiesComponent />
          </div>
        );
      case 'Program':
        return <ProgramComponent />;
      case 'Meldinger':
        return <MeldingerComponent />;
      case 'MinMening':
        return <MinMening />;
      default:
        return <div>Vennligst velg en element fra navigasjonen</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="navbar">
        <div className="navbar-menu">
          <div className={`nav-item ${activeNavItem === 'Profil' ? 'active' : ''}`} onClick={() => setActiveNavItem('Profil')}>Profil</div>
          <div className={`nav-item ${activeNavItem === 'Program' ? 'active' : ''}`} onClick={() => setActiveNavItem('Program')}>Program</div>
          <div className={`nav-item ${activeNavItem === 'Meldinger' ? 'active' : ''}`} onClick={() => setActiveNavItem('Meldinger')}>Meldinger</div>
          <div className={`nav-item ${activeNavItem === 'MinMening' ? 'active' : ''}`} onClick={() => setActiveNavItem('MinMening')}>Min Mening</div>
          <div className="nav-item logout-item" onClick={() => setShowLogoutModal(true)}>Log Ut</div>
        </div>
      </div>
      <div className="main-content">
        {renderContent()}
      </div>
      {showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <p>Er du sikker på at du vil logge ut?</p>
            <div className="logout-modal-buttons">
              <button className="logout-confirm-button" onClick={handleLogoutConfirmation}>Ja</button>
              <button className="logout-confirm-button" onClick={() => setShowLogoutModal(false)}>Nei</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
