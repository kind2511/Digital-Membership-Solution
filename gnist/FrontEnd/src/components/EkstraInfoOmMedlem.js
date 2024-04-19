import React, { useState } from 'react';
import './EkstraInfoOmMedlem.css';

function EkstraInfoOmMedlem() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [searchStatus, setSearchStatus] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);

    const fetchData = (value) => {
        if (value.trim() === '') {
            setResults([]);
            setSearchStatus('');
            setSelectedMember(null);
            return;
        }
        setSearchStatus('Searching...');
        fetch(`http://127.0.0.1:8000/digital_medlemsordning/search_member/?name=${value}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setResults(data);
                setSearchStatus(`Found ${data.length} results.`);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setSearchStatus("Failed to fetch data. Please try again later.");
            });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        fetchData(value);
    };

    const handleSelectMember = (member) => {
        setSelectedMember(member);
    };

    return (
        <div className="eiom-container">
            <h2 className="eiom-title">Ekstra Info om Medlem</h2>
            <input
                type="text"
                className="eiom-search-input"
                placeholder="Søk etter medlem..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div className="eiom-search-status">{searchStatus}</div>
            <div className="eiom-section-content">
                {results.map((member, index) => (
                    <div key={index} className="eiom-search-result" onClick={() => handleSelectMember(member)}>
                        {`${member.first_name} ${member.last_name}`}
                    </div>
                ))}
            </div>
            {selectedMember && (
                <div className="eiom-modal">
                    <div className="eiom-modal-content">
                        <h3>{`${selectedMember.first_name} ${selectedMember.last_name}`}</h3>
                        <p>{selectedMember.info || "N/A"}</p>
                        <button onClick={() => setSelectedMember(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EkstraInfoOmMedlem;
