import React, { useState } from 'react';
import './EndretMedlemsPoen.css';

function EndretMedlemsPoen() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [searchStatus, setSearchStatus] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [pointsAdjustment, setPointsAdjustment] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const fetchData = async (value) => {
        if (value.trim() === '') {
            setResults([]);
            setSearchStatus('');
            return;
        }
        setSearchStatus('Searching...');
        try {
            const response = await fetch(`http://127.0.0.1:8000/digital_medlemsordning/search_member/?name=${value}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setResults(data);
            setSearchStatus(`Found ${data.length} results.`);
        } catch (error) {
            console.error("Error fetching data:", error);
            setSearchStatus("Failed to fetch data. Please try again later.");
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        fetchData(value);
    };

    const handleSelectMember = (member) => {
        setSelectedMember(member);
        setPointsAdjustment('');
    };

    const handleAdjustPointsSubmit = async () => {
        if (selectedMember && pointsAdjustment !== '') {
            const adjustedPoints =  parseInt(pointsAdjustment);
            try {
                const response = await fetch(`http://127.0.0.1:8000/digital_medlemsordning/adjust_member_points_total/${selectedMember.auth0ID}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ points: adjustedPoints })
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                await response.json();
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 3000);
                setPointsAdjustment('');
                setSelectedMember(null);
                fetchData(searchTerm);
            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            alert('Please select a member and enter a value to adjust points.');
        }
    };

    const handleClose = () => {
        setSelectedMember(null);
        setPointsAdjustment('');
    };

    return (
        <div className="endret-medlems-poen-container">
            <h2 className="endret-medlems-poen-title">Endre Medlems Poeng</h2>
            <input
                type="text"
                className="endret-medlems-poen-search-input"
                placeholder="Søk etter medlem..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div className="endret-medlems-poen-search-status">{searchStatus}</div>
            <div className="endret-medlems-poen-section-content">
                {results.map((member, index) => (
                    <div key={index} className="endret-medlems-poen-search-result" onClick={() => handleSelectMember(member)}>
                        {`${member.first_name} ${member.last_name}`}
                    </div>
                ))}
            </div>
            {selectedMember && (
                <div className="endret-medlems-poen-selected-member-container">
                    <h2 className="endret-medlems-poen-selected-member-name">{`${selectedMember.first_name} ${selectedMember.last_name}`}</h2>
                    <p className="endret-medlems-poen-selected-member-points">Totale poeng: {selectedMember.points}</p>
                    <input
                        type="number"
                        className="endret-medlems-poen-points-input"
                        value={pointsAdjustment}
                        onChange={(e) => setPointsAdjustment(e.target.value)}
                        placeholder="Juster poeng"
                    />
                    <button className="endret-medlems-poen-submit-button" onClick={handleAdjustPointsSubmit}>Send inn justering</button>
                    <button className="endret-medlems-poen-lukk-button" onClick={handleClose}>Lukk</button>
                </div>
            )}
            {showSuccessMessage && (
                <div className="endret-medlems-poen-success-message">
                    Poeng har blitt justert.
                </div>
            )}
        </div>
    );
}

export default EndretMedlemsPoen;
