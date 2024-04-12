import React, { useState } from 'react';
import './LastOppBevis.css';

function LastOppBevis() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [searchStatus, setSearchStatus] = useState('');

    const fetchData = (value) => {
        if (value.trim() === '') {
            setResults([]);  
            setSearchStatus('');
            return;
        }

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
        <div className="last-opp-bevis-container">
            <h2 className="section-title">Last Opp Bevis</h2>
            <input
                type="text"
                className="search-input"
                placeholder="Søk etter medlem..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div className="search-status">{searchStatus}</div>
            <div className="section-content">
                {results.map((result, index) => (
                    <div key={index} className="search-result">
                        {result.first_name} {result.last_name}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LastOppBevis;
