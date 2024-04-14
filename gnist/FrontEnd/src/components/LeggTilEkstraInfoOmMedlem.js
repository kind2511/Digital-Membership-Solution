import React, { useState } from 'react';
import './LeggTilEkstraInfoOmMedlem.css';

function LeggTilEkstraInfoOmMedlem() {
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
        <div className="legg-til-ekstra-info-om-medlem-container">
            <h2 className="section-title">Legg til ekstra info om medlem</h2>
            <input
                type="text"
                className="legg-til-ekstra-info-om-medlem-search-input"
                placeholder="Søk etter medlem..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div className="legg-til-ekstra-info-om-medlem-search-status">{searchStatus}</div>
            <div className="legg-til-ekstra-info-om-medlem-section-content">
                {results.map((member, index) => (
                    <div key={index} className="legg-til-ekstra-info-om-medlem-search-result" onClick={() => handleSelectMember(member)}>
                        {`${member.first_name} ${member.last_name}`}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LeggTilEkstraInfoOmMedlem;
