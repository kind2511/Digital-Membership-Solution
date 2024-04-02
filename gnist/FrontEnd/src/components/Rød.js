import React, { useState, useEffect } from 'react';
import './Rød.css';

function Rød() {
  /*
    // TODO: 
    // TODO: 
    */
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {

    /*
    // TODO: 
    // TODO: 
    */
  }, []);

  useEffect(() => {
    /*
    // TODO: 
    // TODO: 
    */
  }, [searchTerm /*, utstengteMembers*/]);

  return (
    <div className="rød-container">
      {/* Utviste Section */}
      <div className="section">
        <h2 className="section-title">Utviste Medlemmer</h2>
        {/* TODO Display logic for Utviste members */}
      </div>

      {/* Utstengte Medlem Section */}
      <div className="section">
        <h2 className="section-title">Utstengte Medlemmer</h2>
        <input
          type="text"
          placeholder="Søk etter medlem..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* TODO Display logic for  Utstengte members */}
      </div>
    </div>
  );
}

export default Rød;
