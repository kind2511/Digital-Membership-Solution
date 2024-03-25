import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RegistrationStatus.css';

function RegistrationStatus({ userSub, isRegistered, setIsRegistered }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const baseApiUrl = 'http://localhost:8000';

  useEffect(() => {
    if (userSub) {
      const storedRegistrationStatus = localStorage.getItem('isRegistered');
      const isUserRegistered = storedRegistrationStatus ? storedRegistrationStatus === 'true' : false;
      setIsRegistered(isUserRegistered);
      setConfirmationMessage(isUserRegistered ? 'Du er registrert nå.' : 'Du er ikke registrert nå.');
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
        localStorage.setItem('isRegistered', newRegistrationStatus);
        setConfirmationMessage(newRegistrationStatus ? 'Du er registrert nå.' : 'Du er ikke registrert nå.');
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
        onChange={() => { }}
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
      {confirmationMessage && (
        <div className="confirmation-message">{confirmationMessage}</div>
      )}
    </div>
  );
}

export default RegistrationStatus;
