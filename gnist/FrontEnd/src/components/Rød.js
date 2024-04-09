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
          onChange={handleChange}
        />
        {searchResults.map((result, index) => (
          <div key={index} className="search-result" onClick={() => handleSelectMember(result)}>
            {result.first_name} {result.last_name}
          </div>
        ))}
      </div>
      {activeMember && (
        <div className="modal-rod">
          <div className="modal-content-rod">
            <p>{activeMember.first_name} {activeMember.last_name}</p>
            <div className="modal-buttons">
              <button className="modal-button-rod" onClick={handleBanMember}>Ban</button>
              <button className="modal-button-rod" onClick={handleCloseModal}>Lukk</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rød;
