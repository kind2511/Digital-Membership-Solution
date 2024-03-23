import React from 'react';
import './RegistrationStatus.css'; 

function RegistrationStatus({ isRegistered, toggleRegistration }) {
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
