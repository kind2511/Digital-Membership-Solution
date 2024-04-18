import React, { useState, useEffect } from 'react';
import './MedlemsNivaer.css';

function MedlemsNivaer() {
    const [levels, setLevels] = useState([]);
    const [newLevelName, setNewLevelName] = useState('');
    const [newLevelPoints, setNewLevelPoints] = useState('');

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

    const handleEditLevel = (levelID) => {
        //TODO
        console.log(`Editing level with ID: ${levelID}`);
    };

    const handleDeleteLevel = (levelID) => {
        //TODO
        console.log(`Deleting level with ID: ${levelID}`);
    };

    const handleAddLevel = () => {
        //TODO:
        console.log('Adding new level:', newLevelName, newLevelPoints);
    };

    return (
        <div className="medlems-nivaer-container">
            <h2 className="medlems-nivaer-section-title">Medlems Nivåer</h2>
            <div className="section-content">
                <div className="level-list">
                    {levels.map((level, index) => (
                        <div key={index} className="level-item">
                            <p className="level-info">{level.name} - {level.points} Points</p>
                            <div>
                                <button className="level-button edit-button" onClick={() => handleEditLevel(level.levelID)}>Redigere</button>
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
        </div>
    );
}

export default MedlemsNivaer;
