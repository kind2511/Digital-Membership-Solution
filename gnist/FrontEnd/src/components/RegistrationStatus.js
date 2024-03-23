import React from 'react';
import axios from 'axios';

function RegistrationStatus({ userSub, isRegistered, setIsRegistered }) {
  const baseApiUrl = 'http://localhost:8000'; // TEST new approach

  const toggleRegistration = async () => {
   
    const newIsRegistered = !isRegistered;
    setIsRegistered(newIsRegistered);
    
    const endpoint = `${baseApiUrl}/digital_medlemsordning/add_day/${userSub}/`;

    try {
      await axios.get(endpoint);
      console.log(newIsRegistered ? 'User registered.' : 'User unregistered.');
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
