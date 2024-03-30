import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import './UserInfo.css';

function UserInfo() {
  const { user, logout } = useAuth0();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    telephoneNumber: '',
    gender: '',
    dateOfBirth: '',
    guardianName: '',
    guardianPhone: '',
    agreesToTerms: false,
  });
  const [ageError, setAgeError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(formData => ({ ...formData, email: user.email }));
    }
  }, [user]);

  const calculateAge = (dob) => {
    const birthday = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'dateOfBirth') {
      const age = calculateAge(value);
      if (age < 13) {
        setAgeError('Du må være minst 13 år gammel for å registrere deg.');
      } else {
        setAgeError('');
      }
    }
  };

  //--------------------------------------------------------------------------------
  // just for testing

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (calculateAge(formData.dateOfBirth) < 13) {
      setAgeError('Du må være minst 13 år gammel for å registrere deg.');
      return;
    }

    if (!formData.agreesToTerms) {
      alert('Du må samtykke til behandling av personopplysninger for å fullføre registreringen.');
      return;
    }

    const endpoint = 'http://127.0.0.1:8000/digital_medlemsordning/register_user/';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth0id: user.sub,
          first_name: formData.firstName,
          last_name: formData.lastName,
          birthdate: formData.dateOfBirth,
          gender: formData.gender,
          phone_number: formData.telephoneNumber,
          email: user.email,
          guardian_name: formData.guardianName,
          guardian_phone: formData.guardianPhone,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/user-dashboard'); // after register the user will be directed to dashboard (temp)
      } else {
        console.error('Registration error:', data);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  //---------------------------------------------------------------------------------------
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const showGuardianFields = formData.dateOfBirth && calculateAge(formData.dateOfBirth) < 16;


  return (
    <div className="userinfo-background">
      <div className="userinfo-container">
        <button onClick={handleLogout} className="logout-button">Logg Ut</button>
        <h2>Fullfør Registrering</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="Fornavn"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Etternavn"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="telephoneNumber"
            placeholder="Telefonnummer"
            value={formData.telephoneNumber}
            onChange={handleInputChange}
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Velg kjønn</option>
            <option value="gutt">gutt</option>
            <option value="jente">jente</option>
            <option value="ikke-binær">ikke-binær</option>
            <option value="vil ikke si">vil ikke si</option>
          </select>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            required
          />
          {showGuardianFields && (
            <>
              <input
                type="text"
                name="guardianName"
                placeholder="Foresattes navn"
                value={formData.guardianName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="guardianPhone"
                placeholder="Foresattes telefonnummer"
                value={formData.guardianPhone}
                onChange={handleInputChange}
                required
              />
            </>
          )}
          <label className="checkbox-container">
            <input
              type="checkbox"
              name="agreesToTerms"
              checked={formData.agreesToTerms}
              onChange={handleInputChange}
              required
            />
            Jeg samtykker til behandling av personopplysninger.
          </label>
          <button type="submit" className="submit-button">Send Inn</button>
          {ageError && <div className="error-message">{ageError}</div>}
        </form>
      </div>
      {showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <p>Er du sikker på at du vil logge ut?</p>
            <div className="logout-modal-buttons">
              <button className="logout-confirm-button" onClick={confirmLogout}>Ja</button>
              <button className="logout-confirm-button" onClick={cancelLogout}>Nei</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
}

export default UserInfo;