import React, { useEffect } from 'react';
import axios from 'axios';

function RegistrationStatus({ userSub, isRegistered, setIsRegistered }) {
  const baseApiUrl = 'http://localhost:8000';

  useEffect(() => {
    const storedRegistrationStatus = localStorage.getItem('isRegistered') === 'true';
    setIsRegistered(storedRegistrationStatus);
  }, [setIsRegistered]);

  const toggleRegistration = async () => {
    const endpoint = `${baseApiUrl}/digital_medlemsordning/add_day/${userSub}/`;

    try {
      await axios.get(endpoint); 
      setIsRegistered(!isRegistered);
      localStorage.setItem('isRegistered', !isRegistered);
      console.log(!isRegistered ? 'User registered.' : 'User unregistered.');
    } catch (error) {
      console.error("Error toggling registration:", error.response || error);
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
