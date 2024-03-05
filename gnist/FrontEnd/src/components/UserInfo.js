import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import './UserInfo.css';

function UserInfo() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    guardianName: '',
    guardianPhone: '',
    isSixteenOrAbove: false,
    agreesToTerms: false,
  });
  const [ageError, setAgeError] = useState(''); // State for managing the age error message
  const { logout } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', () => {
      window.history.pushState(null, null, window.location.href);
    });
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
      if (age < 16) {
        setAgeError('Du må være minst 16 år gammel.');
      } else {
        setAgeError(''); // Clear error message if age is valid
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
    if (age < 16) {
      // Prevent form submission if age is invalid
      return;
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
  const showGuardianFields = age >= 16 && age < 18;

  return (
    <div className="userinfo-background">
      <div className="userinfo-container">
        <button onClick={handleLogout} className="logout-button">Logg Ut</button>
        <h2>Vennligst fullfør registrering</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="firstName" placeholder="Fornavn" value={formData.firstName} onChange={handleInputChange} required />
          <input type="text" name="lastName" placeholder="Etternavn" value={formData.lastName} onChange={handleInputChange} required />
          <label htmlFor="dateOfBirth">Fødselsdato</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            required
          />
          {ageError && <p className="error-message">{ageError}</p>}
          <select name="gender" value={formData.gender} onChange={handleInputChange} required>
            <option value="">Velg kjønn</option>
            <option value="male">Mann</option>
            <option value="female">Kvinne</option>
            <option value="non-binary">Ikke-binær</option>
            <option value="prefer-not-to-say">Foretrekker å ikke si</option>
          </select>
          {showGuardianFields && (
            <>
              <input type="text" name="guardianName" placeholder="Fornavn og etternavn på en foresatt" value={formData.guardianName} onChange={handleInputChange} required />
              <input type="text" name="guardianPhone" placeholder="Telefonnummer på en foresatt" value={formData.guardianPhone} onChange={handleInputChange} required />
            </>
          )}
          {/* comment unused code
          <label className="checkbox-container">
            <input type="checkbox" name="isSixteenOrAbove" checked={formData.isSixteenOrAbove} onChange={handleInputChange} />
            Jeg bekrefter at jeg er 16 år eller eldre.
          </label>
          <label className="checkbox-container">
            <input type="checkbox" name="agreesToTerms" checked={formData.agreesToTerms} onChange={handleInputChange} />
            Jeg godtar vilkårene.
          </label>
          */}
          <button type="submit" className="submit-button">Send inn</button>
        </form>
      </div>
    </div>
  );
}

export default UserInfo;
