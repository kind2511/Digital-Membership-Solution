import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MinMening.css';

function MinMening() {
  const [forslagTittel, setForslagTittel] = useState('');
  const [forslagBeskrivelse, setForslagBeskrivelse] = useState('');
  const [sporsmal, setSporsmal] = useState([]);
  const [visSuksessMelding, setVisSuksessMelding] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/digital_medlemsordning/get_all_questions')
      .then(response => {
        setSporsmal(response.data.questions);
      })
      .catch(error => {
        console.error("Det oppstod en feil ved henting av spørsmål:", error);
      });
  }, []);

  const handleForslagSubmit = async (e) => {
    e.preventDefault();
    const endpoint = 'http://localhost:8000/digital_medlemsordning/create_suggestion/';
    try {
      await axios.post(endpoint, {
        title: forslagTittel,
        description: forslagBeskrivelse
      });
      setForslagTittel('');
      setForslagBeskrivelse('');
      setVisSuksessMelding(true);
      setTimeout(() => setVisSuksessMelding(false), 3000);
    } catch (error) {
      alert('Det oppstod en feil ved sending av forslaget.');
    }
  };

  return (
    <div className="minmening-grid-container">
      <div className="minmening-section-container">
        <div className="minmening-section-title">Avstemninger</div>
        <div className="minmening-section-content">
          {sporsmal.map((sporsmalItem) => (
            <div key={sporsmalItem.id} className="sporsmal-item">
              <p>{sporsmalItem.question}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="minmening-section-container">
        <div className="minmening-section-title">Send Forslag</div>
        <div className="minmening-section-content">
          <form onSubmit={handleForslagSubmit} className="forslag-form">
            <input
              type="text"
              className="forslag-input"
              placeholder="Tittel"
              value={forslagTittel}
              onChange={(e) => setForslagTittel(e.target.value)}
              required
            />
            <textarea
              className="forslag-textarea"
              placeholder="Beskrivelse"
              value={forslagBeskrivelse}
              onChange={(e) => setForslagBeskrivelse(e.target.value)}
              required
            />
            <button type="submit" className="forslag-submit">Send Inn</button>
          </form>
        </div>
      </div>
      {visSuksessMelding && (
        <div className="suksess-banner">
          Forslaget ditt har blitt sendt inn!
        </div>
      )}
    </div>
  );
}

export default MinMening;
