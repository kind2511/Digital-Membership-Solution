import React, { useEffect, useState } from 'react';
import './EndeligGodkjenning.css';

function EndeligGodkjenning() {
    const [unverifiedMembers, setUnverifiedMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showVerificationSuccessMessage, setShowVerificationSuccessMessage] = useState(false);
    const [showDeletionSuccessMessage, setShowDeletionSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchUnverifiedMembers();
    }, []);

    const fetchUnverifiedMembers = async () => {
        const response = await fetch('http://127.0.0.1:8000/digital_medlemsordning/get_all_unverified_members/');
        const data = await response.json();
        setUnverifiedMembers(data);
    };

    const verifyMember = async (member) => {
        const response = await fetch(`http://127.0.0.1:8000/digital_medlemsordning/verify_member/${member.auth0ID}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            setShowVerificationSuccessMessage(true);
            setTimeout(() => setShowVerificationSuccessMessage(false), 3000);
            fetchUnverifiedMembers();
        }
        handleClose();
    };

    const deleteMember = async (member) => {
        const encodedAuth0ID = encodeURIComponent(member.auth0ID);
        const response = await fetch(`http://127.0.0.1:8000/digital_medlemsordning/delete_member/${encodedAuth0ID}/`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setShowDeletionSuccessMessage(true);
            setTimeout(() => setShowDeletionSuccessMessage(false), 3000);
            fetchUnverifiedMembers();
        }
        handleClose();
    };

    const handleClose = () => {
        setSelectedMember(null);
        setErrorMessage('');
    };

    // Function to calculate age based on birthdate
    const calculateAge = (birthdate) => {
        // Get today's date
        const today = new Date();
    
        // Convert birthdate string to a Date object
        const birthDate = new Date(birthdate);
    
        // Calculate the difference in years between today and birthdate
        let age = today.getFullYear() - birthDate.getFullYear();
    
        // Check if the current month is before the birth month or if it's the same month
        // but the current day is before the birth day
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            // If so, decrement the age by 1 since the birthday hasn't occurred yet this year
            age--;
        }
    
        // Return the calculated age
        return age;
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
                        <p><strong>Medlems Alder:</strong> {calculateAge(selectedMember.birthdate)}</p>
                        <p><strong>Medlems Navn:</strong> {selectedMember.first_name} {selectedMember.last_name}</p>
                        <p><strong>Navn Foresatt:</strong> {selectedMember.guardian_name || 'N/A'}</p>
                        <p><strong>Tlf. Foresatt:</strong> {selectedMember.guardian_phone || 'N/A'}</p>
                        <div className="eg-modal-buttons">
                            <button className="eg-button-lukk" onClick={handleClose}>Lukk</button>
                            <button className="eg-button-godkjent" onClick={() => verifyMember(selectedMember)}>Godkjent</button>
                            <button className="eg-button-ikke-godkjent" onClick={() => deleteMember(selectedMember)}>Ikke Godkjent</button>
                        </div>
                    </div>
                </div>
            )}
            {showVerificationSuccessMessage && (
                <div className="verification-success-banner">
                    Medlem ble verifisert
                </div>
            )}
            {showDeletionSuccessMessage && (
                <div className="verification-success-banner">
                    Bruker ble ikke godkjent
                </div>
            )}
            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                </div>
            )}
        </div>
    );
    
}

export default EndeligGodkjenning;
