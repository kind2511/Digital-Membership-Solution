import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RegistrationStatus.css';

function RegistrationStatus({ userSub, isRegistered, setIsRegistered }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const baseApiUrl = 'http://localhost:8000';

  useEffect(() => {
    if (userSub) {
      const storedRegistrationStatus = localStorage.getItem('isRegistered');
      const isUserRegistered = storedRegistrationStatus ? storedRegistrationStatus === 'true' : false;
      setIsRegistered(isUserRegistered);
    }
  }, [userSub, setIsRegistered]);

  const handleCheckboxClick = () => {
    setShowConfirmModal(true);
  };

  const handleRegistrationChange = async (confirm) => {
    if (confirm) {
      const endpoint = `${baseApiUrl}/digital_medlemsordning/add_day/${userSub}/`;
      try {
        await axios.get(endpoint);
        const newRegistrationStatus = !isRegistered;
        setIsRegistered(newRegistrationStatus);
        localStorage.setItem('isRegistered', newRegistrationStatus.toString());
      } catch (error) {
        console.error("Error toggling registration:", error.response || error);
      }
    }
    setShowConfirmModal(false);
  };

  return (
    <div className="registration-status">
      <label className="switch">
        <input
          type="checkbox"
          checked={isRegistered}
          onChange={() => { }} 
          onClick={handleCheckboxClick}
        />
        <span className="slider round"></span>
      </label>
      <span className="status-text">{isRegistered ? 'Aktiv' : 'Ikke Aktiv'}</span>
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
