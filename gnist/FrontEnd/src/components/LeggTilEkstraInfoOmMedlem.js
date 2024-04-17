import React, { useState } from 'react';
import './LeggTilEkstraInfoOmMedlem.css';

function LeggTilEkstraInfoOmMedlem() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [searchStatus, setSearchStatus] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [additionalInfo, setAdditionalInfo] = useState('');

    const fetchData = (value) => {
        if (value.trim() === '') {
            setResults([]);
            setSearchStatus('');
            return;
        }
        setSearchStatus('Søker...');
        fetch(`http://127.0.0.1:8000/digital_medlemsordning/search_member/?name=${value}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setResults(data);
                setSearchStatus(`Fant ${data.length} resultater.`);
            })
            .catch((error) => {
                console.error("Feil ved henting av data:", error);
                setSearchStatus("Kunne ikke hente data. Vennligst prøv igjen senere.");
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

    const handleAdditionalInfoChange = (e) => {
        setAdditionalInfo(e.target.value);
    };

    const saveAdditionalInfo = () => {
        console.log('Lagrer informasjon for:', selectedMember.first_name, selectedMember.last_name, 'med tilleggsinfo:', additionalInfo);
        //TODD
        setAdditionalInfo('');
        setSelectedMember(null);
    };

    const closeForm = () => {
        setSelectedMember(null);
        setAdditionalInfo('');
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
            {selectedMember && (
                <div className="additional-info-modal">
                    <h3>Legg til informasjon for: {`${selectedMember.first_name} ${selectedMember.last_name}`}</h3>
                    <textarea
                        value={additionalInfo}
                        onChange={handleAdditionalInfoChange}
                        placeholder="Skriv inn tilleggsinformasjon her..."
                    ></textarea>
                    <button onClick={saveAdditionalInfo}>Lagre</button>
                    <button onClick={closeForm}>Lukk</button>
                </div>
            )}
        </div>
    );
}

export default LeggTilEkstraInfoOmMedlem;
