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
    <div className="Medleminfo-container">
      {/* Each section designed for a specific part of the Medleminfo component */}
      <div className="Medleminfo-section">
        <h2 className="Medleminfo-title">Endelig Godkjenning</h2>
      </div>

      <div className="Medleminfo-section">
        <h2 className="Medleminfo-title">Ekstra Info om Medlem</h2>
      </div>

      <div className="Medleminfo-section Medleminfo-searchSection">
        <h2 className="Medleminfo-title">Legg til Ekstra Info om Medlem</h2>
        <input
          type="text"
          className="Medleminfo-searchInput"
          placeholder="Søk etter medlem..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="Medleminfo-section">
        <h2 className="Medleminfo-title">Medlems Nivåer</h2>
      </div>

      <div className="Medleminfo-section Medleminfo-searchSection">
        <h2 className="Medleminfo-title">Registrer Endret Medlems Poeng</h2>
        <input
          type="text"
          className="Medleminfo-searchInput"
          placeholder="Søk etter medlem..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="Medleminfo-section">
        <h2 className="Medleminfo-title">Forslag</h2>
      </div>

      <div className="Medleminfo-section Medleminfo-searchSection">
        <h2 className="Medleminfo-title">Last opp Bevis</h2>
        <input
          type="text"
          className="Medleminfo-searchInput"
          placeholder="Søk etter medlem..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}

export default Medleminfo;
