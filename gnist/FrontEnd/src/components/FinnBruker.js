import React, { useState } from 'react';
import './FinnBruker.css';

function FinnBruker() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [searchStatus, setSearchStatus] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

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

    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    const handleCloseDetails = () => {
        setSelectedUser(null);
    };

    return (
        <div className="finn-bruker-container">
            <h2 className="finn-bruker-title">Finn Bruker</h2>
            <input
                type="text"
                className="finn-bruker-input"
                placeholder="Søk etter medlem..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div className="finn-bruker-status">{searchStatus}</div>
            <div className="finn-bruker-results">
                {results.map((user, index) => (
                    <div key={index} className="finn-bruker-result" onClick={() => handleUserSelect(user)}>
                        {`${user.first_name} ${user.last_name}`}
                    </div>
                ))}
            </div>
            {selectedUser && (
                <div className="user-details">
                    <h3>Detaljer:</h3>
                    <p>Navn: {selectedUser.first_name} {selectedUser.last_name}</p>
                    <p>Fødselsdato: {selectedUser.birthdate || 'N/A'}</p>
                    <p>Kjønn: {selectedUser.gender}</p>
                    <p>E-post: {selectedUser.email}</p>
                    <p>Telefon: {selectedUser.phone_number}</p>
                    <p>Verge Navn: {selectedUser.guardian_name || 'N/A'}</p>
                    <p>Verge Telefon: {selectedUser.guardian_phone || 'N/A'}</p>
                    <p>Verifisert: {selectedUser.verified ? 'Ja' : 'Nei'}</p>
                    <p>Status : {selectedUser.banned ? 'Rød' : 'Grønn'}</p>
                    <p>Status Dato: {selectedUser.banned_from || 'N/A'} til {selectedUser.banned_until || 'N/A'}</p>
                    <p>Ekstra Info: {selectedUser.info || 'N/A'}</p>
                    <button className="close-details-button" onClick={handleCloseDetails}>Lukk</button>
                </div>
            )}
        </div>
    );
}

export default FinnBruker;
