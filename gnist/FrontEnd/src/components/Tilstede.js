import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tilstede.css';

const DEFAULT_PROFILE_IMAGE = 'Default_Profile_Picture.jpg';

function Tilstede() {
  const [filterDate, setFilterDate] = useState('');
  const [registeredMembers, setRegisteredMembers] = useState([]);
  const [message, setMessage] = useState('Velg en dato for å se aktive brukere');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (!filterDate) {
      setMessage('Velg en dato for å se aktive brukere');
      return;
    }

    const fetchMembersByDate = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/digital_medlemsordning/get_member_attendance/?date=${filterDate}`);
        setRegisteredMembers(response.data.members_present || []);
        setMessage(
          response.data.members_present && response.data.members_present.length === 0
            ? 'Ingen registrerte folk :('
            : ''
        );
      } catch (error) {
        console.error("Error fetching members by date:", error);
        setMessage('Feil ved henting av data.');
      }
    };

    fetchMembersByDate();
  }, [filterDate]);

  const handleDateFilterChange = (event) => {
    setFilterDate(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };


  useEffect(() => {
    const savedFilterDate = localStorage.getItem('filterDate');
    const savedMembers = JSON.parse(localStorage.getItem('registeredMembers'));

    if (savedFilterDate) {
      setFilterDate(savedFilterDate);
    }
    if (savedMembers) {
      setRegisteredMembers(savedMembers);
    }
  }, []);

  // This effect runs every time the filterDate or registeredMembers change and saves them to local storage
  useEffect(() => {
    localStorage.setItem('filterDate', filterDate);
    localStorage.setItem('registeredMembers', JSON.stringify(registeredMembers));
  }, [filterDate, registeredMembers]);

  const clearData = () => {
    setFilterDate('');
    setRegisteredMembers([]);
    setMessage('Velg en dato for å se aktive brukere');
  };

  const getProfileImage = (imagePath) => {
    return imagePath ? `http://127.0.0.1:8000${imagePath}` : DEFAULT_PROFILE_IMAGE;
  };

  return (
    <div className="tilstede-container">
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
          <button onClick={clearData} className="button-clear">Tøm</button>
        </div>
        <div className="members-list">
          {message && <p className="no-members-message">{message}</p>}
          {registeredMembers.map((member, index) => (
            <div key={index} className="member-item">
              <img src={getProfileImage(member.profile_pic)} alt={`${member.name}`} className="member-photo" />
              <span className="member-name">{member.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="section statistikk">
        <h2 className="section-title">Statistikk</h2>
        <div className="date-filter-container">
          <label htmlFor="startDate" className="date-filter-label">Start Dato:</label>
          <input
            id="startDate"
            type="date"
            className="date-filter-input"
            value={startDate}
            onChange={handleStartDateChange}
          />
          <label htmlFor="endDate" className="date-filter-label">Slutt Dato:</label>
          <input
            id="endDate"
            type="date"
            className="date-filter-input"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
        <div className="statistikk-message">
          {startDate === '' && endDate === '' && (
            <p>Velg en start dato og slutt dato for å se statistikken.</p>
          )}
        </div>
      </div>
    </div>
  );

}

export default Tilstede;
