import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Tilstede from './Tilstede'; 
import Aktiviteter from './Aktiviteter';
import './EmployeeDashboard.css';

function EmployeeDashboard() {
  const { logout } = useAuth0();
  const [activeNavItem, setActiveNavItem] = useState('Tilstede');

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const renderContent = () => {
    switch (activeNavItem) {
      case 'Tilstede':
        return <Tilstede />; // Render the Tilstede component
      case 'Rød':
        return <div className="emp-content">Rød</div>;
      case 'Aktiviteter':
        return <Aktiviteter/>; // Render the Aktiviteter component
      case 'Undersøkelser':
        return <div className="emp-content">Undersøkelser</div>;
      case 'Medleminfo':
        return <div className="emp-content">Medleminfo</div>;
      default:
        return <div className="emp-content">Please select an item from the navbar.</div>;
    }
  };

  return (
    <div className="emp-dashboard-container">
      <div className="emp-navbar">
        <div className="emp-navbar-menu">
          <div className={`emp-nav-item ${activeNavItem === 'Tilstede' ? 'emp-active' : ''}`} onClick={() => setActiveNavItem('Tilstede')}>Tilstede</div>
          <div className={`emp-nav-item ${activeNavItem === 'Rød' ? 'emp-active' : ''}`} onClick={() => setActiveNavItem('Rød')}>Rød</div>
          <div className={`emp-nav-item ${activeNavItem === 'Aktiviteter' ? 'emp-active' : ''}`} onClick={() => setActiveNavItem('Aktiviteter')}>Aktiviteter</div>
          <div className={`emp-nav-item ${activeNavItem === 'Undersøkelser' ? 'emp-active' : ''}`} onClick={() => setActiveNavItem('Undersøkelser')}>Undersøkelser</div>
          <div className={`emp-nav-item ${activeNavItem === 'Medleminfo' ? 'emp-active' : ''}`} onClick={() => setActiveNavItem('Medleminfo')}>Medleminfo</div>
          <div className="emp-nav-item emp-logout-item" onClick={handleLogout}>Logg Ut</div>
        </div>
      </div>
      <div className="emp-main-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
