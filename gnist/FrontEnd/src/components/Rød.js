import React, { useState, useEffect } from 'react';
import './Rød.css';  

function Rød() {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    //TODO
  }, []);

  useEffect(() => {
    //TODO
  }, [searchTerm]);

  return (
    <div className="unique-rod-container">
      <div className="unique-section unique-expelled-members">
        <h2 className="unique-section-title">Utviste Medlemmer</h2>
      </div>

      <div className="unique-section unique-banned-members">
        <h2 className="unique-section-title">Utstengte Medlemmer</h2>
        <input
          type="text"
          className="unique-section-input"
          placeholder="Søk etter medlem..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Rød;
