import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Tilstede from './Tilstede';
import Aktiviteter from './Aktiviteter';
import Undersøkelser from './Undersøkelser';
import Rød from './Rød';
import Medleminfo from './Medleminfo';
import FinnBruker from './FinnBruker'; 
import './EmployeeDashboard.css';

function EmployeeDashboard() {
  const { logout } = useAuth0();

  // Initialize activeNavItem from local storage or default to 'Tilstede'
  const [activeNavItem, setActiveNavItem] = useState(localStorage.getItem('activeNavItem') || 'Tilstede');
  const [showLogoutModal, setShowLogoutModal] = useState(false); 

  // Update local storage whenever activeNavItem changes
  useEffect(() => {
    localStorage.setItem('activeNavItem', activeNavItem);
  }, [activeNavItem]);

  const handleLogout = () => {
    // Show logout confirmation modal
    setShowLogoutModal(true);
  };

  const handleLogoutConfirmation = () => {
    // Perform logout
    logout({ returnTo: window.location.origin });
  };

  const renderContent = () => {
    switch (activeNavItem) {
      case 'Tilstede':
        return <Tilstede />;
      case 'Rød':
        return <Rød />;
      case 'Aktiviteter':
        return <Aktiviteter />;
      case 'Undersøkelser':
        return <Undersøkelser />;
      case 'Medleminfo': 
        return <Medleminfo />;
      case 'FinnBruker':
        return <FinnBruker />; 
      default:
        return <div className="emp-content">Velg et element fra navigasjonslinjen.</div>;
    }
  };

  return (
    <div className="emp-dashboard-container">
      <div className="emp-navbar">
        <div className="emp-navbar-menu">
          <div 
            className={`emp-nav-item ${activeNavItem === 'Tilstede' ? 'emp-active' : ''}`} 
            onClick={() => setActiveNavItem('Tilstede')}
          >
            Tilstede
          </div>
          <div 
            className={`emp-nav-item ${activeNavItem === 'Rød' ? 'emp-active' : ''}`} 
            onClick={() => setActiveNavItem('Rød')}
          >
            Rød
          </div>
          <div 
            className={`emp-nav-item ${activeNavItem === 'Aktiviteter' ? 'emp-active' : ''}`} 
            onClick={() => setActiveNavItem('Aktiviteter')}
          >
            Aktiviteter
          </div>
          <div 
            className={`emp-nav-item ${activeNavItem === 'Undersøkelser' ? 'emp-active' : ''}`} 
            onClick={() => setActiveNavItem('Undersøkelser')}
          >
            Undersøkelser
          </div>
          <div 
            className={`emp-nav-item ${activeNavItem === 'Medleminfo' ? 'emp-active' : ''}`} 
            onClick={() => setActiveNavItem('Medleminfo')}
          >
            Medleminfo
          </div>
          <div 
            className={`emp-nav-item ${activeNavItem === 'FinnBruker' ? 'emp-active' : ''}`} 
            onClick={() => setActiveNavItem('FinnBruker')}
          >
            Finn Bruker
          </div>
          <div 
            className="emp-nav-item emp-logout-item" 
            onClick={handleLogout}
          >
            Logg Ut
          </div>
        </div>
      </div>
      <div className="emp-main-content">
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

export default EmployeeDashboard;
