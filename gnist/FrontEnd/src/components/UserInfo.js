import React, { useState, useEffect } from 'react'; 
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
    console.log(formData);
 
    // i will add the logic here later
  }

  return (
    <div className="userinfo-background">
      <div className="userinfo-container">
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
