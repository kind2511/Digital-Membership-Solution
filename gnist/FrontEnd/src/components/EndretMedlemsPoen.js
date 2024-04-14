import React, { useState } from 'react';
import './EndretMedlemsPoen.css';

function EndretMedlemsPoen() {
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

    const handleSelectMember = (member) => {
        console.log('Selected member:', member);
    };

    return (
        <div className="endret-medlems-poen-container">
            <h2 className="endret-medlems-poen-title">Endret medlems poeng</h2>
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
        </div>
    );
}

export default EndretMedlemsPoen;
