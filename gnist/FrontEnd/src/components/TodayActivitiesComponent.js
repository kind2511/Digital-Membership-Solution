import React, { useState, useEffect } from 'react';
import './TodayActivitiesComponent.css';

function TodayActivitiesComponent() {
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const baseApiUrl = 'http://127.0.0.1:8000';

    useEffect(() => {
        const fetchTodayActivities = async () => {
            try {
                const response = await fetch(`${baseApiUrl}/digital_medlemsordning/get_activity_today/`);
                const data = await response.json();
                setActivities(data.activities);
            } catch (error) {
                console.error("Failed to fetch today's activities:", error);
            }
        };

        fetchTodayActivities();
    }, []);

    const handleActivityClick = (activity) => {
        setSelectedActivity(activity);
    };

    const handleCloseDetails = () => {
        setSelectedActivity(null);
    };

    return (
        <div className="today-activities-container">
            <div className="today-activities-list">
                {activities.map((activity, index) => (
                    <div key={index} className="today-activity-entry" onClick={() => handleActivityClick(activity)}>
                        <img src={activity.image ? `${baseApiUrl}${activity.image}` : "https://via.placeholder.com/60"} alt="Activity" className="today-activity-image" />
                        <div className="today-activity-details">
                            <div className="today-activity-title">{activity.title}</div>
                            <div className="today-activity-date">Dato: {activity.date}</div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedActivity && (
                <div className="today-details-modal" onClick={handleCloseDetails}>
                    <div className="today-modal-content" onClick={e => e.stopPropagation()}>
                        <h2>{selectedActivity.title}</h2>
                        <p>{selectedActivity.description}</p>
                        <div className="today-modal-buttons">
                            <button className="today-modal-button" onClick={handleCloseDetails}>Close</button>
                            <button className="today-modal-button">Meld på</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TodayActivitiesComponent;
