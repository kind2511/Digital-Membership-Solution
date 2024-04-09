import React, { useState } from 'react';
import './Rød.css';

function Rød() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeMember, setActiveMember] = useState(null);

  const fetchMembers = (value) => {
    fetch(`http://127.0.0.1:8000/digital_medlemsordning/search_member/?name=${value}`)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setSearchResults([]);
      });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      fetchMembers(value);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectMember = (member) => {
    setActiveMember(member);
  };

  const handleCloseModal = () => {
    setActiveMember(null);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleBanMember = () => {
    console.log("Member banned:", activeMember);
    setActiveMember(null);
  };

  return (
    <div className="roed-unique-container">
      <div className="roed-section roed-expelled-members">
        <h2 className="roed-section-title">Utviste Medlemmer</h2>
      </div>

      <div className="roed-section roed-banned-members">
        <h2 className="roed-section-title">Utstengte Medlemmer</h2>
        <input
          type="text"
          className="roed-section-input"
          placeholder="Søk etter medlem..."
          value={searchTerm}
          onChange={handleChange}
        />
        <div className="roed-names-container">
          {searchResults.map((result, index) => (
            <div key={index} className="roed-search-result" onClick={() => handleSelectMember(result)}>
              {result.first_name} {result.last_name}
            </div>
          ))}
        </div>
      </div>
      {activeMember && (
        <div className="roed-modal">
          <div className="roed-modal-content">
            <p>{activeMember.first_name} {activeMember.last_name}</p>
            <div className="roed-modal-buttons">
              <button className="roed-modal-button-ban" onClick={handleBanMember}>Ban</button>
              <button className="roed-modal-button-close" onClick={handleCloseModal}>Lukk</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rød;
