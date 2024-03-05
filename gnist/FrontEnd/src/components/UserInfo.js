import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import './UserInfo.css';

function UserInfo() {
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
  const { logout } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, null, window.location.href);
    };
  }, []);

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
    if (name === 'dateOfBirth') {
      const age = calculateAge(value);
      if (age < 13) {
        setAgeError('Du må være minst 13 år gammel for å registrere deg.');
        return;
      } else {
        setAgeError('');
      }
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const age = calculateAge(formData.dateOfBirth);
    if (age < 13) {
      alert('Du må være minst 13 år gammel for å registrere deg.');
      return; // Prevent form submision if under 13
    }
    if (!formData.agreesToTerms) {
      alert('Du må samtykke til behandling av personopplysninger for å fullføre registreringen.');
      return; // Prevent form submision if consent is not given
    }
    console.log('Form data submitted:', formData);
    setTimeout(() => {
      navigate('/user-dashboard');
    }, 1000);
  };

  const handleLogout = () => {
    const isConfirmed = window.confirm('Er du sikker?');
    if (isConfirmed) {
      logout({ returnTo: window.location.origin });
    }
  };

  const age = calculateAge(formData.dateOfBirth);
  const showGuardianFields = age < 16;

  return (
    <div className="userinfo-background">
      <div className="userinfo-container">
        <button onClick={handleLogout} className="logout-button">Logg Ut</button>
        <h2>Fullfør Registrering</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="firstName" placeholder="Fornavn" value={formData.firstName} onChange={handleInputChange} required />
          <input type="text" name="lastName" placeholder="Etternavn" value={formData.lastName} onChange={handleInputChange} required />
          <input type="text" name="telephoneNumber" placeholder="Telefonnummer" value={formData.telephoneNumber} onChange={handleInputChange} required />
          <select name="gender" value={formData.gender} onChange={handleInputChange} required>
            <option value="">Velg kjønn</option>
            <option value="male">Gutt</option>
            <option value="female">Jente</option>
            <option value="non-binary">Ikke-binær</option>
            <option value="prefer-not-to-say">Foretrekker å ikke si</option>
          </select>
          <label htmlFor="dateOfBirth">Fødselsdato</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            required
          />
          {ageError && <p className="error-message">{ageError}</p>}
          {showGuardianFields && (
            <>
              <input type="text" name="guardianName" placeholder="Foresattes navn" value={formData.guardianName} onChange={handleInputChange} required />
              <input type="text" name="guardianPhone" placeholder="Foresattes telefonnummer"value={formData.guardianPhone} onChange={handleInputChange} required />
            </>
          )}
          <label className="checkbox-container">
            <input type="checkbox" name="agreesToTerms" checked={formData.agreesToTerms} onChange={handleInputChange} required />
            Jeg samtykker til behandling av personopplysninger.
          </label>
          <button type="submit" className="submit-button">Send inn</button>
        </form>
      </div>
    </div>
  );
}

export default UserInfo;
