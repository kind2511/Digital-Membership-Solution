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
    limit: '',  
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [archivedActivities, setArchivedActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/digital_medlemsordning/get_future_activities/');
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
    formData.append('limit', activity.limit);

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
          limit: '',
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

  const handleDeleteActivity = async (activityId) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/digital_medlemsordning/delete_activity/${activityId}/`);
      console.log(response.data.message);
      setActivities(currentActivities => currentActivities.filter(act => act.activityID !== activityId));
      setSelectedActivity(null);
      setSuccessMessage('Aktivitet slettet');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  useEffect(() => {
    const fetchArchivedActivities = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/digital_medlemsordning/get_past_activities/');
        setArchivedActivities(response.data);
      } catch (error) {
        console.error("Error fetching archived activities:", error);
      }
    };

    fetchArchivedActivities();
  }, []);

  return (
    <div className="aktiviteter-container-unique">
      <div className="activity-success-message-unique" style={{ opacity: showSuccess ? 1 : 0, height: showSuccess ? 'auto' : '0' }}>
        {successMessage}
      </div>

      {/* Modal for Registrants */}
      {selectedActivity && (
        <div className="modal-unique">
          <div className="modal-content-unique">
            <h3>Folk som har registrert seg på denne aktiviteten:</h3>
            <ol className="registrants-list-unique">
              {registrants.map((person, index) => (
                <li key={index} className="registrant-unique">
                  {person.first_name} {person.last_name}
                </li>
              ))}
            </ol>
            <div className="modal-footer-unique">
              <button className="delete-button-unique" onClick={() => handleDeleteActivity(selectedActivity)}>Slett Aktivitet</button>
              <button className="close-button-unique" onClick={() => setSelectedActivity(null)}>Lukk</button>
            </div>
          </div>
        </div>
      )}

      {/* Lag Ny Aktivitet Section */}
      <div className="section-unique lag-ny-aktivitet-unique">
        <h2 className="section-title-unique">Lag Ny Aktivitet</h2>
        <form onSubmit={handleSubmit} className="activity-form-unique">
          <input type="date" name="dato" value={activity.dato} onChange={handleChange} required />
          <input type="text" name="tittel" placeholder="Tittel" value={activity.tittel} onChange={handleChange} required />
          <input type="file" name="bilde" onChange={handleChange} />
          <textarea name="beskrivelse" placeholder="Beskrivelse" value={activity.beskrivelse} onChange={handleChange} required />
          <input type="number" name="limit" placeholder="Antall Plasser" value={activity.limit} onChange={handleChange} required />
          <button type="submit">Lagre Aktivitet</button>
        </form>
      </div>

      {/* Kommende Aktiviteter Section */}
      <div className="section-unique alle-aktiviteter-unique">
        <h2 className="section-title-unique">Kommende Aktiviteter</h2>
        <div className="activities-list-unique">
          {activities.map((activity) => (
            <div className="activity-item-unique" key={activity.activityID} onClick={() => fetchRegistrants(activity.activityID)}>
              <img src={activity.image} alt={activity.title} />
              <div className="activity-info-unique">
                <h3>{activity.title}</h3>
                <p className="activity-date-unique">{activity.date}</p>
                <p className="activity-description-unique">{activity.description}</p>
                <p className="activity-places-unique">Antall Plasser: {activity.limit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arkiverte Aktiviteter Section */}
      <div className="section-unique alle-aktiviteter-unique">
        <h2 className="section-title-unique">Arkiverte Aktiviteter</h2>
        <div className="activities-list-unique">
          {archivedActivities.map((archivedActivity) => (
            <div className="activity-item-unique" key={archivedActivity.activityID} onClick={() => fetchRegistrants(archivedActivity.activityID)}>
              <img src={archivedActivity.image} alt={archivedActivity.title} />
              <div className="activity-info-unique">
                <h3>{archivedActivity.title}</h3>
                <p className="activity-date-unique">{archivedActivity.date}</p>
                <p className="activity-description-unique">{archivedActivity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}

export default Aktiviteter;
