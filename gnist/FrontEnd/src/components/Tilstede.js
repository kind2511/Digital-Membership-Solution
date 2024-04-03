import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tilstede.css';

const DEFAULT_PROFILE_IMAGE = 'Default_Profile_Picture.jpg'; 

function Tilstede() {
  const [filterDate, setFilterDate] = useState('');
  const [registeredMembers, setRegisteredMembers] = useState([]);

  useEffect(() => {
    if (filterDate) {
      const fetchMembersByDate = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/digital_medlemsordning/get_member_attendance/', { params: { date: filterDate } });
          setRegisteredMembers(response.data.members_present || []);
        } catch (error) {
          console.error("Error fetching members by date:", error);
        }
      };

      fetchMembersByDate();
    }
  }, [filterDate]);

  const handleDateFilterChange = (event) => {
    setFilterDate(event.target.value);
  };

  const getProfileImage = (imagePath) => {
    return imagePath ? `http://127.0.0.1:8000${imagePath}` : DEFAULT_PROFILE_IMAGE;
  };

  return (
    <div className="tilstede-container">
      {/* Registered Members Section */}
      <div className="section registrerte-medlemmer">
        <h2 className="section-title">Registrerte Medlemmer</h2>
        <div className="date-filter-container">
          <label htmlFor="dateFilter" className="date-filter-label">Filtrer etter dato:</label>
          <input 
            id="dateFilter"
            type="date"
            className="date-filter-input"
            value={filterDate}
            onChange={handleDateFilterChange} 
          />
        </div>
        <div className="members-list">
          {registeredMembers.length > 0 ? (
            registeredMembers.map((member, index) => (
              <div key={index} className="member-item">
                <img src={getProfileImage(member.profile_pic)} alt={`${member.name}`} className="member-photo" />
                <span className="member-name">{member.name}</span>
              </div>
            ))
          ) : (
            <p>Ingen registrerte medlemmer funnet.</p>
          )}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="section statistikk">
        <h2 className="section-title">Statistikk</h2>
        <p>TODO.</p>
      </div>
    </div>
  );
}

export default Tilstede;
