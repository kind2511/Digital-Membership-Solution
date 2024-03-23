import React from 'react';
import axios from 'axios';

function RegistrationStatus({ userSub, isRegistered, setIsRegistered }) {
  const baseApiUrl = 'http://localhost:8000';

  const toggleRegistration = async () => {
    // Ask for confirmation before toggling registration status
    const confirmMessage = isRegistered
      ? "Er du sikker på at du vil avregistrere deg?"
      : "Er du sikker på at du vil registrere deg?";

    if (window.confirm(confirmMessage)) {
      const newIsRegistered = !isRegistered;
      setIsRegistered(newIsRegistered);

      const endpoint = `${baseApiUrl}/digital_medlemsordning/add_day/${userSub}/`;

      try {
        await axios.get(endpoint);
        console.log(newIsRegistered ? 'User registered.' : 'User unregistered.');
      } catch (error) {
        console.error("Error toggling registration:", error.response || error);
        setIsRegistered(isRegistered);
      }
    }
  };

  return (
    <div className="registration-status" onClick={toggleRegistration}>
      <input
        type="checkbox"
        checked={isRegistered}
        onChange={toggleRegistration}
        className="register-checkbox"
      />
      Registrer
    </div>
  );
}
export default RegistrationStatus;
