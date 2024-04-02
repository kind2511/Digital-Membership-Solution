import React, { useState, useEffect } from 'react';
import './Tilstede.css'; 

function Tilstede() {
  const [filterDate, setFilterDate] = useState('');
  const [registeredMembers, setRegisteredMembers] = useState([]);

  //TODO
  useEffect(() => {
    // Fetch logic here :)
  }, []);

  const handleDateFilterChange = (event) => {
    setFilterDate(event.target.value);
  };

  return (
    <div className="tilstede-container">
      {/* Registered Members Section */}
      <div className="section registrerte-medlemmer">
        <h2 className="section-title">Registrerte Medlemmer</h2>
        <div className="date-filter-container">
          <label htmlFor="dateFilter" className="date-filter-label">Filtrer etter dato:</label>
          <input 
            id="dateFilter"
            type="date"
            className="date-filter-input"
            value={filterDate}
            onChange={handleDateFilterChange} 
          />
        </div>
        <div className="members-list">
          {registeredMembers.length > 0 ? (
            registeredMembers.map((member, index) => (
              <div key={index} className="member-item">
                {/* Display logic for each member */}
                {member.firstName} {member.lastName}
              </div>
            ))
          ) : (
            <p>Ingen registrerte medlemmer funnet.</p>
          )}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="section statistikk">
        <h2 className="section-title">Statistikk</h2>
        <p>TODO.</p>
      </div>
    </div>
  );
}

export default Tilstede;
