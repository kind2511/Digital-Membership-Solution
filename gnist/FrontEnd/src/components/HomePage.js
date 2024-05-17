import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const { loginWithRedirect } = useAuth0();

  const handleAuthAction = () => {
    loginWithRedirect();
  };

  return (
    <div className="home-page">
      <div className="left">
      </div>
      <div className="right">
        <div className="nav-logo"><span>GNIST</span></div>
        <button onClick={handleAuthAction}>Login/Register</button>
      </div>
      <div className="kontakt-oss-link-container">
        <Link to="/kontakt-oss" className="kontakt-link">Kontakt oss</Link>
      </div>
    </div>
  );
};

export default HomePage;
