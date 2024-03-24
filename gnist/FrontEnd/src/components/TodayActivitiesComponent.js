import React, { useState, useEffect } from 'react';
import './TodayActivitiesComponent.css';

const promoSentences = ["Dette skjer idag.."];

function TodayActivitiesComponent() {
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [displayedText, setDisplayedText] = useState('');
    const [sentenceIndex, setSentenceIndex] = useState(0);
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

    useEffect(() => {
        let currentTimer;

        const isCompleteSentence = displayedText === promoSentences[sentenceIndex];
        if (isCompleteSentence) {
            currentTimer = setTimeout(() => {
                const nextIndex = (sentenceIndex + 1) % promoSentences.length;
                setSentenceIndex(nextIndex);
                setDisplayedText('');
            }, 3000);
        } else {
            currentTimer = setTimeout(() => {
                const newText = promoSentences[sentenceIndex].substr(0, displayedText.length + 1);
                setDisplayedText(newText);
            }, 50);
        }

        return () => {
            clearTimeout(currentTimer);
        };
    }, [displayedText, sentenceIndex]);

    const handleActivityClick = (activity) => {
        setSelectedActivity(activity);
    };

    const handleCloseDetails = () => {
        setSelectedActivity(null);
    };

    return (
        <div className="today-activities-container">
            <div className="promo-sentence-container">
                <p className={`promo-sentence ${displayedText ? 'visible' : ''}`}>{displayedText}</p>
            </div>
            <div className="today-activities-list">
                {activities.map((activity, index) => (
                    <div key={index} className="today-activity-entry" onClick={() => handleActivityClick(activity)}>
                        <img src={activity.image ? `${baseApiUrl}${activity.image}` : "https://via.placeholder.com/60"} alt={activity.title} className="today-activity-image" />
                        <div className="today-activity-details">
                            <div className="today-activity-title">{activity.title}</div>
                            <div className="today-activity-date">{activity.date ? `Dato: ${activity.date}` : 'Ingen dato oppgitt'}</div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedActivity && (
                <div className="today-details-modal" onClick={handleCloseDetails}>
                    <div className="today-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedActivity.title}</h2>
                        <p>{selectedActivity.description}</p>
                        <div className="today-modal-buttons">
                            <button className="today-modal-button" onClick={handleCloseDetails}>Lukk</button>
                            <button className="today-modal-button">Meld på</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TodayActivitiesComponent;
