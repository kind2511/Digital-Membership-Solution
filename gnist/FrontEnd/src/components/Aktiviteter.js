import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Aktiviteter.css';

function Aktiviteter() {
  const [activities, setActivities] = useState([]);
  const [registrants, setRegistrants] = useState([]);
  const [activity, setActivity] = useState({
    dato: '',
    tittel: '',
    bilde: null,
    beskrivelse: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/digital_medlemsordning/get_all_activity/');
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setActivity(prev => ({
      ...prev,
      [name]: name === 'bilde' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', activity.bilde);
    formData.append('title', activity.tittel);
    formData.append('description', activity.beskrivelse);
    formData.append('date', activity.dato);

    try {
      await axios.post('http://127.0.0.1:8000/digital_medlemsordning/create_activity/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMessage('Aktivitetet ble lagret');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setActivity({
          dato: '',
          tittel: '',
          bilde: null,
          beskrivelse: '',
        });
      }, 5000);

    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };

  const fetchRegistrants = async (activityId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/digital_medlemsordning/get_signed_up_members/${activityId}/`);
      setRegistrants(response.data.sign_up_members);
      setSelectedActivity(activityId);
    } catch (error) {
      console.error("Error fetching registrants:", error);
    }
  };

  return (
    <div className="aktiviteter-container">
      <div className="activity-success-message" style={{ opacity: showSuccess ? 1 : 0, height: showSuccess ? 'auto' : '0' }}>
        {successMessage}
      </div>
      {/* Modal for Registrants */}
      {selectedActivity && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setSelectedActivity(null)}>Lukk</span>
            <h3>Folk som har registrert seg på denne aktiviteten:</h3>
            <ol className="registrants-list">
              {registrants.map((person, index) => (
                <li key={index} className="registrant">
                  {person.first_name} {person.last_name}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
      {/* Lag Ny Aktivitet Section */}
      <div className="section lag-ny-aktivitet">
        <h2 className="section-title">Lag Ny Aktivitet</h2>
        <form onSubmit={handleSubmit} className="activity-form">
          <input type="date" name="dato" value={activity.dato} onChange={handleChange} required />
          <input type="text" name="tittel" placeholder="Tittel" value={activity.tittel} onChange={handleChange} required />
          <input type="file" name="bilde" onChange={handleChange} />
          <textarea name="beskrivelse" placeholder="Beskrivelse" value={activity.beskrivelse} onChange={handleChange} required />
          <button type="submit">Lagre Aktivitet</button>
        </form>
      </div>
      {/* Alle Aktiviteter Section */}
      <div className="section alle-aktiviteter">
        <h2 className="section-title">Alle Aktiviteter</h2>
        <div className="activities-list">
          {activities.map((activity) => (
            <div className="activity-item" key={activity.activityID} onClick={() => fetchRegistrants(activity.activityID)}>
              <img src={activity.image} alt={activity.title} />
              <div className="activity-info">
                <h3>{activity.title}</h3>
                <p className="activity-date">{activity.date}</p>
                <p className="activity-description">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Aktiviteter;
