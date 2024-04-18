import React, { useEffect, useState } from 'react';
import './EndeligGodkjenning.css';

function EndeligGodkjenning() {
    const [unverifiedMembers, setUnverifiedMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showVerificationSuccessMessage, setShowVerificationSuccessMessage] = useState(false);

    useEffect(() => {
        fetchUnverifiedMembers();
    }, []);

    const fetchUnverifiedMembers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/digital_medlemsordning/get_all_unverified_members/');
            if (!response.ok) {
                throw new Error('Failed to fetch unverified members');
            }
            const data = await response.json();
            setUnverifiedMembers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const verifyMember = async (member) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/digital_medlemsordning/verify_member/${member.auth0ID}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to verify member');
            }
            setShowVerificationSuccessMessage(true);
            setTimeout(() => setShowVerificationSuccessMessage(false), 3000);
            fetchUnverifiedMembers();
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    const handleClose = () => {
        setSelectedMember(null);
    };

    return (
        <div className="eg-godkjenning-container">
            <h2 className="eg-section-title">Endelig Godkjenning</h2>
            <div className="eg-section-content">
                <ul className="eg-members-list">
                    {unverifiedMembers.map(member => (
                        <li key={member.userID} onClick={() => setSelectedMember(member)}>
                            {member.first_name} {member.last_name}
                        </li>
                    ))}
                </ul>
            </div>
            {selectedMember && (
                <div className="eg-modal-overlay">
                    <div className="eg-modal-content">
                        <p><strong>Navn:</strong> {selectedMember.first_name} {selectedMember.last_name}</p>
                        <p><strong>Navn og Tlf for Foresatt:</strong> {selectedMember.guardian_name || 'N/A'} {selectedMember.guardian_phone || 'N/A'}</p>
                        <div className="eg-modal-buttons">
                            <button className="eg-button-lukk" onClick={handleClose}>Lukk</button>
                            <button className="eg-button-godkjent" onClick={() => verifyMember(selectedMember)}>Godkjent</button>
                        </div>
                    </div>
                </div>
            )}
            {showVerificationSuccessMessage && (
                <div className="verification-success-banner">
                    Medlem ble verifisert
                </div>
            )}
        </div>
    );
}

export default EndeligGodkjenning;
