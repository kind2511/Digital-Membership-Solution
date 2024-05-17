import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import './TodayActivitiesComponent.css';

const promoSentences = ["Dette skjer idag.."];

function TodayActivitiesComponent() {
    const { user, isAuthenticated } = useAuth0();
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [displayedText, setDisplayedText] = useState('');
    const [sentenceIndex, setSentenceIndex] = useState(0);
    const [todayDate, setTodayDate] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const baseApiUrl = 'http://127.0.0.1:8000';

    const fetchTodayActivities = useCallback(async () => {
        try {
            const response = await fetch(`${baseApiUrl}/digital_medlemsordning/get_activity_today/`);
            const data = await response.json();
            const updatedActivities = data.map(activity => ({
                ...activity,
                isUserSignedUp: activity.signed_up_members.some(member => member.auth0ID === user.sub)
            }));
            setActivities(updatedActivities);
            setTodayDate(data.length > 0 ? data[0].date : new Date().toISOString().split('T')[0]);
        } catch (error) {
            console.error("Failed to fetch today's activities:", error);
            setActivities([]);
        }
    }, [user.sub]);

    useEffect(() => {
        fetchTodayActivities();
    }, [fetchTodayActivities]);

    useEffect(() => {
        const timerId = setInterval(() => {
            setDisplayedText(promoSentences[sentenceIndex]);
            setSentenceIndex((sentenceIndex + 1) % promoSentences.length);
        }, 3000);
        return () => clearInterval(timerId);
    }, [sentenceIndex]);

    const handleActivityClick = (activity) => {
        setSelectedActivity(activity);
    };

    const handleSignUp = async () => {
        if (!isAuthenticated) {
            setMessage('Du må være logget inn for å melde på.');
            setMessageType('error');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        try {
            const response = await axios.post(`${baseApiUrl}/digital_medlemsordning/sign_up_activity/`, {
                auth0_id: user.sub,
                activity_id: selectedActivity.activityID,
            });
            if (response.status === 200 || response.status === 201) {
                setMessage('Du er registrert nå.');
                setMessageType('confirmation');
                setTimeout(() => {
                    setMessage('');
                    setSelectedActivity(null);
                    fetchTodayActivities();
                }, 3000);
            }
        } catch (error) {
            console.error('Failed to sign up for the activity:', error);
            setMessage('Du kan ikke registrere nå, vennligst vent litt.');
            setMessageType('error');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleUndoSignUp = async () => {
        if (!isAuthenticated) {
            setMessage('Du må være logget inn for å melde av.');
            setMessageType('error');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        try {
            const response = await axios.post(`${baseApiUrl}/digital_medlemsordning/undo_signup_activity/`, {
                auth0_id: user.sub,
                activity_id: selectedActivity.activityID,
            });
            if (response.status === 200) {
                setMessage('Du er avmeldt nå.');
                setMessageType('confirmation');
                setTimeout(() => {
                    setMessage('');
                    setSelectedActivity(null);
                    fetchTodayActivities();
                }, 3000);
            }
        } catch (error) {
            console.error('Failed to undo signup for the activity:', error);
            setMessage('Feil ved avmelding, vennligst prøv igjen.');
            setMessageType('error');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleCloseDetails = () => {
        setSelectedActivity(null);
        setMessage('');
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
                            <div className="today-activity-date">{todayDate ? `Dato: ${todayDate}` : 'Ingen dato oppgitt'}</div>
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
                            {selectedActivity.isUserSignedUp ? (
                                <button className="today-modal-button" onClick={handleUndoSignUp}>Meld av</button>
                            ) : (
                                <button className="today-modal-button" onClick={handleSignUp}>Meld på</button>
                            )}
                        </div>
                        {message && (
                            <div className={`message ${messageType === 'confirmation' ? 'confirmation' : 'error'}`}>{message}</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TodayActivitiesComponent;
