import React, { useEffect, useState } from 'react';
import './EndeligGodkjenning.css';

function EndeligGodkjenning() {
    const [unverifiedMembers, setUnverifiedMembers] = useState([]);

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

    return (
        <div className="eg-godkjenning-container">
            <h2 className="eg-section-title">Endelig Godkjenning</h2>
            <div className="eg-section-content">
                <ul className="eg-members-list">
                    {unverifiedMembers.map(member => (
                        <li key={member.id} onClick={() => console.log(`Member ${member.first_name} ${member.last_name} clicked`)}>
                            {member.first_name} {member.last_name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default EndeligGodkjenning;
