import React, { useState, useEffect } from 'react';
import './Medleminfo.css'; 

function Medleminfo() {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    //TODO
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    //TODO
  };

  return (
    <div className="medleminfo-container">
      {/* Each section designed for a specific part of the Medleminfo component */}
      <div className="medleminfo-section">
        <h2 className="medleminfo-title">Endelig Godkjenning</h2>
      </div>

      <div className="medleminfo-section">
        <h2 className="medleminfo-title">Ekstra Info om Medlem</h2>
      </div>

      <div className="medleminfo-section medleminfo-searchSection">
        <h2 className="medleminfo-title">Legg til Ekstra Info om Medlem</h2>
        <input
          type="text"
          className="medleminfo-searchInput"
          placeholder="Søk etter medlem..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="medleminfo-section">
        <h2 className="medleminfo-title">Medlems Nivåer</h2>
      </div>

      <div className="medleminfo-section medleminfo-searchSection">
        <h2 className="medleminfo-title">Registrer Endret Medlems Poeng</h2>
        <input
          type="text"
          className="medleminfo-searchInput"
          placeholder="Søk etter medlem..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="medleminfo-section">
        <h2 className="medleminfo-title">Forslag</h2>
      </div>

      <div className="medleminfo-section medleminfo-searchSection">
        <h2 className="medleminfo-title">Last opp Bevis</h2>
        <input
          type="text"
          className="medleminfo-searchInput"
          placeholder="Søk etter medlem..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}

export default Medleminfo;
