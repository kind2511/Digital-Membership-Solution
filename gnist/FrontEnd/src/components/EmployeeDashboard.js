import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './EmployeeDashboard.css';

function EmployeeDashboard() {
  const { logout } = useAuth0();
  const [activeNavItem, setActiveNavItem] = useState('Tilstede');

  // Function to simulate logout with Auth0
  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const renderContent = () => {
    switch (activeNavItem) {
      case 'Tilstede':
        return <div className="content">Content for Tilstede</div>;
      case 'Aktiviteter':
        return <div className="content">Content for Aktiviteter</div>;
      case 'Undersokelser':
        return <div className="content">Content for Undersokelser</div>;
      case 'Kommunikasjon':
        return <div className="content">Content for Kommunikasjon</div>;
      default:
        return <div className="content">Please select an item from the navbar.</div>;
    }
  };

  return (
    <div className="employee-dashboard-container">
      <div className="employee-navbar">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="employee-navbar-logo" />
        <div className="employee-navbar-menu">
          <div className={`employee-nav-item ${activeNavItem === 'Tilstede' ? 'employee-active' : ''}`} onClick={() => setActiveNavItem('Tilstede')}>Tilstede</div>
          <div className={`employee-nav-item ${activeNavItem === 'Aktiviteter' ? 'employee-active' : ''}`} onClick={() => setActiveNavItem('Aktiviteter')}>Aktiviteter</div>
          <div className={`employee-nav-item ${activeNavItem === 'Undersokelser' ? 'employee-active' : ''}`} onClick={() => setActiveNavItem('Undersokelser')}>Undersokelser</div>
          <div className={`employee-nav-item ${activeNavItem === 'Kommunikasjon' ? 'employee-active' : ''}`} onClick={() => setActiveNavItem('Kommunikasjon')}>Kommunikasjon</div>
          <div className="employee-nav-item logout-item" onClick={handleLogout}>Logg Ut</div>
        </div>
      </div>
      <div className="employee-main-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
