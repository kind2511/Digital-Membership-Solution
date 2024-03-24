import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RegistrationStatus.css';

function RegistrationStatus({ userSub, isRegistered, setIsRegistered }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const baseApiUrl = 'http://localhost:8000';

  useEffect(() => {
    const storedRegistrationStatus = localStorage.getItem('isRegistered') === 'true';
    setIsRegistered(storedRegistrationStatus);
  }, [setIsRegistered]);

  const handleCheckboxClick = () => {
    setShowConfirmModal(true);
  };

  const handleRegistrationChange = async (confirm) => {
    if (confirm) {
      const endpoint = `${baseApiUrl}/digital_medlemsordning/add_day/${userSub}/`;
      try {
        await axios.get(endpoint); 
        setIsRegistered(!isRegistered);
        localStorage.setItem('isRegistered', !isRegistered);
        console.log(!isRegistered ? 'User registered.' : 'User unregistered.');
      } catch (error) {
        console.error("Error toggling registration:", error.response || error);
      }
    }
    
    setShowConfirmModal(false);
  };

  return (
    <div className="registration-status">
      <input
        type="checkbox"
        checked={isRegistered}
        onChange={() => {}} 
        onClick={handleCheckboxClick}
        className="register-checkbox"
      />
      Registrer
      {showConfirmModal && (
        <div className="registration-modal-overlay">
          <div className="registration-modal-content">
            <p>{isRegistered ? 'Er du sikker på at du vil avregistrere deg?' : 'Er du sikker på at du vil registrere deg?'}</p>
            <button onClick={() => handleRegistrationChange(true)}>Ja</button>
            <button onClick={() => handleRegistrationChange(false)}>Nei</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistrationStatus;
