import React, { useState, useEffect } from 'react';
import './EkstraInfoOmMedlem.css';

function EkstraInfoOmMedlem() {
    const [results, setResults] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showDeleteSuccessMessage, setShowDeleteSuccessMessage] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch('http://127.0.0.1:8000/digital_medlemsordning/get_members_with_info/')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setResults(data);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    };

    const handleSelectMember = (member) => {
        setSelectedMember(member);
        localStorage.setItem('selectedAuth0ID', member.auth0ID);
    };

    const handleDeleteMemberInfo = () => {
        const auth0ID = localStorage.getItem('selectedAuth0ID');
        if (auth0ID) {
            const url = `http://127.0.0.1:8000/digital_medlemsordning/remove_member_info/${auth0ID}/`;
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                setSelectedMember(null);
                localStorage.removeItem('selectedAuth0ID');
                fetchData();
                setShowDeleteSuccessMessage(true);
                setTimeout(() => setShowDeleteSuccessMessage(false), 3000);
            })
            .catch(error => {
                console.error("Error deleting member info:", error);
            });
        } else {
            console.error('Cannot delete member info: No auth0ID found in local storage');
        }
    };

    return (
        <div className="eiom-container">
            <h2 className="eiom-title">Ekstra Info om Medlem</h2>
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
                        <div className="eiom-modal-buttons">
                            <button onClick={handleDeleteMemberInfo} className="eiom-delete-btn">Slett</button>
                            <button onClick={() => {
                                setSelectedMember(null);
                                localStorage.removeItem('selectedAuth0ID');
                            }} className="eiom-close-btn">Lukk</button>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteSuccessMessage && (
                <div className="eiom-delete-success-banner">
                    Medlems ekstra info er slettet
                </div>
            )}
        </div>
    );
}

export default EkstraInfoOmMedlem;
