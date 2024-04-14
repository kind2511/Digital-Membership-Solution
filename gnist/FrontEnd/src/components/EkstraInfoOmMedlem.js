import React, { useState } from 'react';
import './EkstraInfoOmMedlem.css';

function EkstraInfoOmMedlem() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [searchStatus, setSearchStatus] = useState('');

    const fetchData = (value) => {
        if (value.trim() === '') {
            setResults([]);
            setSearchStatus('');
            return;
        }
        setSearchStatus('Searching...');
        fetch(`http://127.0.0.1:8000/digital_medlemsordning/search_member/?name=${value}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setResults(data);
                setSearchStatus(`Found ${data.length} results.`);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setSearchStatus("Failed to fetch data. Please try again later.");
            });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        fetchData(value);
    };

    return (
        <div className="ekstra-info-om-medlem-container">
            <h2 className="ekstra-info-om-medlem-title">Ekstra Info om Medlem</h2>
            <input
                type="text"
                className="ekstra-info-om-medlem-search-input"
                placeholder="Søk etter medlem..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div className="ekstra-info-om-medlem-search-status">{searchStatus}</div>
            <div className="ekstra-info-om-medlem-section-content">
                {results.map((member, index) => (
                    <div key={index} className="ekstra-info-om-medlem-search-result">
                        {`${member.first_name} ${member.last_name}`}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EkstraInfoOmMedlem;
