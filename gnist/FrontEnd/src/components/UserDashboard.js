import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './UserDashboard.css';

function UserDashboard() {
  const { logout } = useAuth0();
  const [activeNavItem, setActiveNavItem] = useState('Profil');
  const [isRegistered, setIsRegistered] = useState(false);
  const [profileImg, setProfileImg] = useState(localStorage.getItem('profileImg') || '');
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

  // Function to render content based on the activeNavItem
  const renderContent = () => {
    switch (activeNavItem) {
      case 'Profil':
        return (
          <div className="profile-content">
            {/* Profile content here */}
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
            {/* Profile Image Section */}
            <div className="profile-img-container" onClick={() => document.getElementById('profileImgInput').click()}>
              {profileImg ? (
                <img src={profileImg} alt="Profile" className="profile-img" />
              ) : (
                <div className="profile-img-placeholder">
                  <span>Legg til bilde</span>
                </div>
              )}
              <input
                id="profileImgInput"
                type="file"
                accept="image/*"
                onChange={handleProfileImgChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        );
      case 'Program':
        return <div>Program content here</div>; // Placeholder for Program content
      case 'Meldinger':
        return <div>Meldinger content here</div>; // Placeholder for Meldinger content
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
          <div className="nav-item logout-item" onClick={handleLogout}>Logg Ut</div>
        </div>
      </div>

      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default UserDashboard;
