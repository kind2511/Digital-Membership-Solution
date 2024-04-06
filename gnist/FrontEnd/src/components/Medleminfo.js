import React, { useState, useEffect } from 'react';
import './Medleminfo.css'; 

function Medleminfo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [unverifiedMembers, setUnverifiedMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchUnverifiedMembers();
  }, []);

  const fetchUnverifiedMembers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/digital_medlemsordning/get_all_unverified_members/');
      if (!response.ok) {
        throw new Error('Failed to fetch unverified members');
      }
      const data = await response.json();
      setUnverifiedMembers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    //TODO:  
  };

  const handleNameClick = (member) => {
    setSelectedMember(member);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  const handleApprove = () => {
    // TODO: 
    console.log('Member approved');
    setSelectedMember(null);
  };

  return (
    <div className="medleminfo-container">
      {/* Endelig Godkjenning section */}
      <div className="medleminfo-section medleminfo-scrollable">
        <h2 className="medleminfo-title">Endelig Godkjenning</h2>
        <div className="medleminfo-list">
          {unverifiedMembers.map((member, index) => (
            <div key={index} className="medleminfo-list-item">
              <span onClick={() => handleNameClick(member)}>{index + 1}. {member.first_name} {member.last_name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for displaying member details */}
      {selectedMember && (
        <div className="medleminfo-modal">
          <div className="medleminfo-modal-content">
            <h2>Medlem Informasjon</h2>
            <p><strong>Navn:</strong> {selectedMember.first_name} {selectedMember.last_name}</p>
            <p><strong>Alder:</strong> {selectedMember.age}</p>
            <p><strong>Foresatt Navn:</strong> {selectedMember.foresatt_name}</p>
            <p><strong>Foresatt Tlf:</strong> {selectedMember.foresatt_tlf}</p>
            <div className="medleminfo-buttons">
              <button className="medleminfo-close-button" onClick={handleCloseModal}>Lukk</button>
              <button className="medleminfo-approve-button" onClick={handleApprove}>Godkjent</button>
            </div>
          </div>
        </div>
      )}

      {/* Other sections */}
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
