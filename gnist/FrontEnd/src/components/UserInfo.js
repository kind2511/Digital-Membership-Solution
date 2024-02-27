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
  const { logout } = useAuth0(); // Destructure logout function from useAuth0
  const navigate = useNavigate(); // Hook for navigation

  // Prevent the user from go back to the previous page
  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', () => {
      window.history.pushState(null, null, window.location.href);
    });
  }, []);

 // const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.isSixteenOrAbove || !formData.agreesToTerms) {
      alert('Du må bekrefte at du er 16 år eller eldre og godtar vilkårene.');
      return;
    }
    // Mock a successful form submission
    console.log('Form data submitted:', formData);

    // Simulate a delay  if communicating with the backend-> // for testing//
    setTimeout(() => {
      // Redirect to user dashboard after a simulated delay
      navigate('/user-dashboard');
    }, 1000); //  timeout 
  }


  const handleLogout = () => {
    const isConfirmed = window.confirm("Er du sikker?"); // Confirmation dialog
    if (isConfirmed) {
      logout({ returnTo: window.location.origin }); // Logs the user out and redirects to the homepage
    }
  };


  return (
    <div className="userinfo-background">
      <div className="userinfo-container">
        {/*here the logout button at top right of userInfo page */}
        <button onClick={handleLogout} className="logout-button">Logg Ut</button>
        <h2>Vennligst fullfør din registrering</h2>
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
          <select name="gender" value={formData.gender} onChange={handleInputChange} required>
            <option value="">Velg kjønn</option>
            <option value="male">Mann</option>
            <option value="female">Kvinne</option>
            <option value="non-binary">Ikke-binær</option>
            <option value="prefer-not-to-say">Foretrekker å ikke si</option>
          </select>
          <input type="text" name="guardianName" placeholder="Fornavn og etternavn på en foresatt" value={formData.guardianName} onChange={handleInputChange} required />
          <input type="text" name="guardianPhone" placeholder="Telefonnummer på en foresatt " value={formData.guardianPhone} onChange={handleInputChange} required />
          <label className="checkbox-container">
            <input type="checkbox" name="isSixteenOrAbove" checked={formData.isSixteenOrAbove} onChange={handleInputChange} />
            Jeg bekrefter at jeg er 16 år eller eldre..
          </label>
          <label className="checkbox-container">
            <input type="checkbox" name="agreesToTerms" checked={formData.agreesToTerms} onChange={handleInputChange} />
            Jeg godtar vilkårene .
          </label>
          <button type="submit" className="submit-button">Send inn</button>
        </form>
      </div>
    </div>
  );
}

export default UserInfo;
