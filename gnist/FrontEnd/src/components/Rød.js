import React, { useState, useEffect } from 'react';
import './Rød.css';

function Rød() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeMember, setActiveMember] = useState(null);
  const [bannedMembers, setBannedMembers] = useState([]);
  const [isExpelledMemberModal, setIsExpelledMemberModal] = useState(false);

  useEffect(() => {
    fetchBannedMembers();
  }, []);

  const fetchBannedMembers = () => {
    fetch('http://127.0.0.1:8000/digital_medlemsordning/get_banned_members/')
      .then(response => response.json())
      .then(data => {
        setBannedMembers(data.banned_members);
      })
      .catch(error => {
        console.error("Error fetching banned members:", error);
        setBannedMembers([]);
      });
  };

  const fetchMembers = value => {
    fetch(`http://127.0.0.1:8000/digital_medlemsordning/search_member/?name=${value}`)
      .then(response => response.json())
      .then(data => {
        setSearchResults(data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setSearchResults([]);
      });
  };

  const handleChange = e => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      fetchMembers(value);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectMember = (member, isExpelled) => {
    setActiveMember(member);
    setIsExpelledMemberModal(isExpelled);
    localStorage.setItem('Auth0SearchedMember', member.auth0ID);
  };

  const handleCloseModal = () => {
    setActiveMember(null);
    setSearchTerm('');
    setSearchResults([]);
    setIsExpelledMemberModal(false);
  };

  const handleBanOrUnbanMember = () => {
    if (isExpelledMemberModal) {
      console.log("Member unbanned:", activeMember);
    } else {
      console.log("Member banned:", activeMember);
    }
    handleCloseModal();
  };

  return (
    <div className="roed-unique-container">
      <div className="roed-section roed-expelled-members">
        <h2 className="roed-section-title">Utviste Medlemmer</h2>
        <div className="roed-names-container">
          {bannedMembers.map((member, index) => (
            <div key={index} className="roed-search-result" onClick={() => handleSelectMember(member, true)}>
              <img src={member.profile_picture} alt={`${member.full_name}`} />
              <div>
                <p>{member.full_name}</p>
                {/* Display the banned dates */}
                <p>Utestengt fra: {member.banned_from || 'Ikke oppgitt'}</p>
                <p>Utestengt til: {member.banned_until || 'Ikke oppgitt'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="roed-section">
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
            <div key={index} className="roed-search-result" onClick={() => handleSelectMember(result, false)}>
              <p>{result.first_name} {result.last_name}</p>
            </div>
          ))}
        </div>
      </div>

      {activeMember && (
        <div className="roed-modal">
          <div className="roed-modal-content">
            <p>{activeMember.full_name || `${activeMember.first_name} ${activeMember.last_name}`}</p>
            <div className="roed-modal-buttons">
              <button
                className={isExpelledMemberModal ? "roed-modal-button-unban" : "roed-modal-button-ban"}
                onClick={handleBanOrUnbanMember}
              >
                {isExpelledMemberModal ? 'Unban' : 'Ban'}
              </button>
              <button
                className="roed-modal-button-close"
                onClick={handleCloseModal}
              >
                Lukk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rød;
