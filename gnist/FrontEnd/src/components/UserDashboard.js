import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './UserDashboard.css';
import ProgramComponent from './ProgramComponent';  
import MeldingerComponent from './MeldingerComponent';  


function UserDashboard() {
  const { logout } = useAuth0();
  const [activeNavItem, setActiveNavItem] = useState('Profil');
  const [isRegistered, setIsRegistered] = useState(false);
  const [profileImg, setProfileImg] = useState(localStorage.getItem('profileImg') || '');
  const [firstName, setFirstName] = useState('Example'); // Placeholder
  const [level, setLevel] = useState(1); // Placeholder
  const date = new Date().toLocaleDateString();

  useEffect(() => {
    localStorage.setItem('profileImg', profileImg);
  }, [profileImg]);

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const toggleRegistration = () => {
    setIsRegistered(!isRegistered);
  };

  const handleProfileImgChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderContent = () => {
    switch (activeNavItem) {
      case 'Profil':
        return (
          <div className="profile-content">
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
            <div className="profile-img-container" onClick={() => document.getElementById('profileImgInput').click()}>
              {profileImg ? (
                <img src={profileImg} alt="Profile" className="profile-img" />
              ) : (
                <div className="profile-img-placeholder">Legg til bilde</div>
              )}
              <input
                id="profileImgInput"
                type="file"
                accept="image/*"
                onChange={handleProfileImgChange}
                style={{ display: 'none' }}
              />
            </div>
            <div className="user-info">
              <div className="user-name">Name: {firstName.toUpperCase()}</div>
              <div className="user-level">Level: {level}</div>
            </div>
            <h2 className="activities-title">Dette skjer idag</h2>
            <div className="activities-container">
            </div>
          </div>
        );
      case 'Program':
        return <ProgramComponent />;  
      case 'Meldinger':
        return <MeldingerComponent />;  
      default:
        return <div>Select a nav item</div>;
    }
  };
  

  return (
    <div className="dashboard-container">
      <div className="navbar">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="navbar-logo" />
        <div className="navbar-menu">
          <div className={`nav-item ${activeNavItem === 'Profil' ? 'active' : ''}`} onClick={() => setActiveNavItem('Profil')}>Profil</div>
          <div className={`nav-item ${activeNavItem === 'Program' ? 'active' : ''}`} onClick={() => setActiveNavItem('Program')}>Program</div>
          <div className={`nav-item ${activeNavItem === 'Meldinger' ? 'active' : ''}`} onClick={() => setActiveNavItem('Meldinger')}>Meldinger</div>
          <div className="nav-item logout-item" onClick={handleLogout}>LoggUt</div>
        </div>
      </div>
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default UserDashboard;
