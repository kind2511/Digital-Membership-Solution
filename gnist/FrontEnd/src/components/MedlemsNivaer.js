import React, { useState, useEffect } from 'react';
import './MedlemsNivaer.css';

function MedlemsNivaer() {
    const [levels, setLevels] = useState([]);
    const [newLevelName, setNewLevelName] = useState('');
    const [newLevelPoints, setNewLevelPoints] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showEditLevelModal, setShowEditLevelModal] = useState(false);
    const [levelToEdit, setLevelToEdit] = useState(null);
    const [editedLevelName, setEditedLevelName] = useState('');
    const [editedLevelPoints, setEditedLevelPoints] = useState('');

    useEffect(() => {
        fetchLevels();
    }, []);

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

    const handleEditLevel = (level) => {
        setLevelToEdit(level);
        setEditedLevelName(level.name);
        setEditedLevelPoints(level.points);
        setShowEditLevelModal(true);
    };

    const handleEditLevelSubmit = async () => {
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
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteLevel = async (levelID) => {
        try {
            //TODO
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddLevel = async () => {
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
            setShowSuccessMessage(true);
            setNewLevelName('');
            setNewLevelPoints('');
            fetchLevels(); // Fetch levels again to update the list
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="medlems-nivaer-container">
            <h2 className="medlems-nivaer-section-title">Medlems Nivåer</h2>
            <div className="section-content">
                <div className="level-list">
                    {levels.map((level, index) => (
                        <div key={index} className="level-item">
                            <p className="level-info">{level.name} - {level.points} Poeng</p>
                            <div>
                                <button className="level-button edit-button" onClick={() => handleEditLevel(level)}>Redigere</button>
                                <button className="level-button delete-button" onClick={() => handleDeleteLevel(level.levelID)}>Slett</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="add-level-form">
                    <input
                        type="text"
                        placeholder="Navn på nivå"
                        value={newLevelName}
                        onChange={(e) => setNewLevelName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Poeng"
                        value={newLevelPoints}
                        onChange={(e) => setNewLevelPoints(e.target.value)}
                    />
                    <button className="level-button add-button" onClick={handleAddLevel}>Legg til nytt nivå</button>
                </div>
            </div>
            {showSuccessMessage && (
                <div className="success-banner">
                    Niva har blitt lagt til
                </div>
            )}
            {showEditLevelModal && (
                <div className="edit-level-modal">
                    <h2>Rediger nivå</h2>
                    <input
                        type="text"
                        value={editedLevelName}
                        onChange={(e) => setEditedLevelName(e.target.value)}
                    />
                    <input
                        type="text"
                        value={editedLevelPoints}
                        onChange={(e) => setEditedLevelPoints(e.target.value)}
                    />
                    <button onClick={handleEditLevelSubmit}>Lagre</button>
                </div>
            )}
        </div>
    );
}

export default MedlemsNivaer;
