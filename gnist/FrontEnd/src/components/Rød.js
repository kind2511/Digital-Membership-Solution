import React, { useState, useEffect } from 'react';
import './Rød.css';

function Rød() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeMember, setActiveMember] = useState(null);
  const [bannedMembers, setBannedMembers] = useState([]);
  const [isExpelledMemberModal, setIsExpelledMemberModal] = useState(false);
  const [banStartDate, setBanStartDate] = useState(null);
  const [banEndDate, setBanEndDate] = useState(null);

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
    setBanStartDate(null);
    setBanEndDate(null);
  };

  const handleBanMember = () => {
    const auth0ID = localStorage.getItem('Auth0SearchedMember');
    if (!auth0ID || !banStartDate || !banEndDate) {
      console.error("Please select a member and provide ban start and end dates");
      return;
    }

    fetch(`http://127.0.0.1:8000/digital_medlemsordning/ban_member/${auth0ID}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        banned_from: banStartDate,
        banned_until: banEndDate,
      }),
    })
      .then(response => {
        if (response.ok) {
          console.log("Member banned successfully");
          handleCloseModal();
          fetchBannedMembers();
        } else {
          console.error("Failed to ban member");
        }
      })
      .catch(error => {
        console.error("Error banning member:", error);
      });
  };

  return (
    <div className="roed-unique-container">
      <div className="roed-section roed-banned-members">
        <h2 className="roed-section-title">Utviste Medlemmer</h2>
        <div className="roed-names-container">
          {bannedMembers.map((member, index) => (
            <div key={index} className="roed-banned-member-item">
              <img src={member.profile_picture} alt={`${member.full_name}`} className="roed-member-image" />
              <div className="roed-member-info">
                <p className="roed-member-name">{member.full_name}</p>
                <p className="banned-date">Utestengt fra: {member.banned_from || 'Ikke oppgitt'}</p>
                <p className="banned-date">Utestengt til: {member.banned_until || 'Ikke oppgitt'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section for Utstengte Medlemmer*/}
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

      {/* Modal for handling banning*/}
      {activeMember && (
        <div className="roed-modal">
          <div className="roed-modal-content">
            <p>{activeMember.full_name || `${activeMember.first_name} ${activeMember.last_name}`}</p>
            <label htmlFor="banStartDate">Ban Start Date:</label>
            <input
              type="date"
              id="banStartDate"
              value={banStartDate}
              onChange={e => setBanStartDate(e.target.value)}
            />
            <label htmlFor="banEndDate">Ban End Date:</label>
            <input
              type="date"
              id="banEndDate"
              value={banEndDate}
              onChange={e => setBanEndDate(e.target.value)}
            />
            <div className="roed-modal-buttons">
              <button
                className={isExpelledMemberModal ? "roed-modal-button-unban" : "roed-modal-button-ban"}
                onClick={handleBanMember}
              >
                Ban
              </button>
              <button
                className="roed-modal-button-close"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rød;
