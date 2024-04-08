import React, { useState, useEffect } from 'react';
import './Medleminfo.css';

function Medleminfo() {
  const [searchTermEndretMedlemsPoeng, setSearchTermEndretMedlemsPoeng] = useState('');
  const [searchTermForslag, setSearchTermForslag] = useState('');
  const [searchTermLastOppBevis, setSearchTermLastOppBevis] = useState('');
  const [unverifiedMembers, setUnverifiedMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [levels, setLevels] = useState([]);
  const [showAddLevelModal, setShowAddLevelModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [levelToDelete, setLevelToDelete] = useState(null);
  const [newLevelName, setNewLevelName] = useState('');
  const [newLevelPoints, setNewLevelPoints] = useState('');
  const [showEditLevelModal, setShowEditLevelModal] = useState(false);
  const [levelToEdit, setLevelToEdit] = useState(null);
  const [editedLevelName, setEditedLevelName] = useState('');
  const [editedLevelPoints, setEditedLevelPoints] = useState('');

  useEffect(() => {
    fetchUnverifiedMembers();
    fetchLevels();
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

  const fetchLevels = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/digital_medlemsordning/get_all_levels/');
      if (!response.ok) {
        throw new Error('Failed to fetch levels');
      }
      const data = await response.json();
      setLevels(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChangeEndretMedlemsPoeng = (e) => {
    setSearchTermEndretMedlemsPoeng(e.target.value);
    // TODO: 
  };

  const handleSearchChangeForslag = (e) => {
    setSearchTermForslag(e.target.value);
    // TODO: 
  };

  const handleSearchChangeLastOppBevis = (e) => {
    setSearchTermLastOppBevis(e.target.value);
    // TODO: 
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

  const handleAddLevel = () => {
    setShowAddLevelModal(true);
  };

  const handleCloseAddLevelModal = () => {
    setShowAddLevelModal(false);
  };

  const handleSaveLevel = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/digital_medlemsordning/create_level/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newLevelName,
          points: newLevelPoints
        })
      });
      if (!response.ok) {
        throw new Error('Failed to add new level');
      }
      setShowAddLevelModal(false);
      setNewLevelName('');
      setNewLevelPoints('');
      fetchLevels(); // Fetch levels again to update the list
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteLevel = (levelId) => {
    setLevelToDelete(levelId);
    setShowDeleteConfirmationModal(true);
  };

  const handleCloseDeleteConfirmationModal = () => {
    setShowDeleteConfirmationModal(false);
  };

  const handleConfirmDeleteLevel = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/digital_medlemsordning/delete_level/${levelToDelete}/`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete level');
      }
      setShowDeleteConfirmationModal(false);
      fetchLevels(); // Fetch levels again to update the list
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditLevel = (level) => {
    setLevelToEdit(level);
    setEditedLevelName(level.name);
    setEditedLevelPoints(level.points);
    setShowEditLevelModal(true);
  };

  const handleCloseEditLevelModal = () => {
    setShowEditLevelModal(false);
  };

  const handleSaveEditedLevel = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/digital_medlemsordning/edit_level/${levelToEdit.levelID}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editedLevelName,
          points: editedLevelPoints
        })
      });
      if (!response.ok) {
        throw new Error('Failed to edit level');
      }
      setShowEditLevelModal(false);
      fetchLevels(); // Fetch levels again to update the list
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="medleminfo-container">
      {/* Endelig Godkjenning section */}
      <div className="medleminfo-section medleminfo-scrollable">
        <h2 className="medleminfo-title">Endelig Godkjenning</h2>
        <div className="medleminfo-list">
          {unverifiedMembers.map((member, index) => (
            <div key={index} className="medleminfo-list-item" onClick={() => handleNameClick(member)}>
              <span>{index + 1}. {member.first_name} {member.last_name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for displaying member details */}
      {selectedMember && (
        <div className="medleminfo-modal" onClick={handleCloseModal}>
          <div className="medleminfo-modal-content" onClick={(e) => e.stopPropagation()}>
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

      {/* Medlems Nivåer section */}
      <div className="medleminfo-section medleminfo-scrollable">
        <h2 className="medleminfo-title">Medlems Nivåer</h2>
        <div className="medleminfo-list">
          {levels.map((level, index) => (
            <div key={index} className="medleminfo-list-item">
              <p><strong>Navn:</strong> {level.name}</p>
              <p><strong>Poeng:</strong> {level.points}</p>
              <button className="medleminfo-edit-button" onClick={() => handleEditLevel(level)}>Endre</button>
              <button className="medleminfo-delete-button" onClick={() => handleDeleteLevel(level.levelID)}>Slett</button>
            </div>
          ))}
          <button className="medleminfo-add-button" onClick={handleAddLevel}>Legg til nytt nivå</button>
        </div>
      </div>

      {/* Add Level Modal */}
      {showAddLevelModal && (
        <div className="medleminfo-modal" onClick={handleCloseAddLevelModal}>
          <div className="medleminfo-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Legg til nytt nivå</h2>
            <input
              type="text"
              placeholder="Navn til nivå"
              value={newLevelName}
              onChange={(e) => setNewLevelName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Total poeng"
              value={newLevelPoints}
              onChange={(e) => setNewLevelPoints(e.target.value)}
            />
            <div className="medleminfo-buttons">
              <button className="medleminfo-save-button" onClick={handleSaveLevel}>Lagre</button>
              <button className="medleminfo-close-button" onClick={handleCloseAddLevelModal}>Lukk</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Level Modal */}
      {showEditLevelModal && (
        <div className="medleminfo-modal" onClick={handleCloseEditLevelModal}>
          <div className="medleminfo-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Rediger nivå</h2>
            <input
              type="text"
              placeholder="Navn til nivå"
              value={editedLevelName}
              onChange={(e) => setEditedLevelName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Total poeng"
              value={editedLevelPoints}
              onChange={(e) => setEditedLevelPoints(e.target.value)}
            />
            <div className="medleminfo-buttons">
              <button className="medleminfo-save-button" onClick={handleSaveEditedLevel}>Lagre</button>
              <button className="medleminfo-close-button" onClick={handleCloseEditLevelModal}>Avbryt</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmationModal && (
        <div className="medleminfo-modal" onClick={handleCloseDeleteConfirmationModal}>
          <div className="medleminfo-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Slette Nivå?</h2>
            <div className="medleminfo-buttons">
              <button className="medleminfo-save-button" onClick={handleConfirmDeleteLevel}>Ja</button>
              <button className="medleminfo-close-button" onClick={handleCloseDeleteConfirmationModal}>Nei</button>
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
          value={searchTermEndretMedlemsPoeng}
          onChange={handleSearchChangeEndretMedlemsPoeng}
        />
      </div>

      <div className="medleminfo-section">
        <h2 className="medleminfo-title">Endret Medlems Poeng</h2>
        <div className="medleminfo-search-container">
          <span className="medleminfo-search-icon" role="img" aria-label="Search">
            🔍
          </span>
          <input
            type="text"
            className="medleminfo-search-input"
            placeholder="Skriv navn til medlem..."
            value={searchTermForslag}
            onChange={handleSearchChangeForslag}
          />
        </div>
      </div>

      <div className="medleminfo-section medleminfo-searchSection">
        <h2 className="medleminfo-title">Forslag</h2>
      </div>

      <div className="medleminfo-section medleminfo-section-lastopp">
        <h2 className="medleminfo-title medleminfo-title-lastopp">Last opp Bevis</h2>
        <div className="medleminfo-search-container medleminfo-search-container-lastopp">
          <span className="medleminfo-search-icon medleminfo-search-icon-lastopp" role="img" aria-label="Search">
            🔍
          </span>
          <input
            type="text"
            className="medleminfo-search-input medleminfo-search-input-lastopp"
            placeholder="Skriv navn til medlem..."
            value={searchTermLastOppBevis}
            onChange={handleSearchChangeLastOppBevis}
          />
        </div>
      </div>
    </div>
  );
}

export default Medleminfo;
