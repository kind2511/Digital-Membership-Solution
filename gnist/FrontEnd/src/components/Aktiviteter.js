import React, { useState } from 'react';
import axios from 'axios';
import './Aktiviteter.css';

function Aktiviteter() {
  const [activity, setActivity] = useState({
    dato: '',
    tittel: '',
    bilde: null,
    beskrivelse: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setActivity(prev => ({
      ...prev,
      [name]: name === 'bilde' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', activity.bilde);
    formData.append('title', activity.tittel);
    formData.append('description', activity.beskrivelse);
    formData.append('date', activity.dato);

    try {
      const response = await axios.post('http://127.0.0.1:8000/digital_medlemsordning/create_activity/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log(response.data); 
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };

  return (
    <div className="aktiviteter-container">
      {/* Lag Ny Aktivitet Section */}
      <div className="section lag-ny-aktivitet">
        <h2 className="section-title">Lag Ny Aktivitet</h2>
        <form onSubmit={handleSubmit} className="activity-form">
          <input
            type="date"
            name="dato"
            value={activity.dato}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="tittel"
            placeholder="Tittel"
            value={activity.tittel}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="bilde"
            onChange={handleChange}
          />
          <textarea
            name="beskrivelse"
            placeholder="Beskrivelse"
            value={activity.beskrivelse}
            onChange={handleChange}
            required
          />
          <button type="submit">Lagre Aktivitet</button>
        </form>
      </div>

      {/* Alle Aktiviteter Section */}
      <div className="section fremtidig-design">
        <h2 className="section-title">Alle Aktiviteter</h2>
        {/* Alle Aktiviteter content goes here */}
      </div>
    </div>
  );
}

export default Aktiviteter;
