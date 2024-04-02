import React, { useState } from 'react';
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
    if (name === 'bilde') {
      setActivity(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setActivity(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // logic here :)
    console.log(activity);
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
