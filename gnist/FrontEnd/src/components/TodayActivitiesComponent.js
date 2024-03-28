import React, { useState, useEffect } from 'react';
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
    const [signupStatus, setSignupStatus] = useState('');
    const baseApiUrl = 'http://127.0.0.1:8000';

    useEffect(() => {
        const fetchTodayActivities = async () => {
            try {
                const response = await fetch(`${baseApiUrl}/digital_medlemsordning/get_activity_today/`);
                const data = await response.json();
                setActivities(data.activities || []);
                setTodayDate(data.date);
            } catch (error) {
                console.error("Failed to fetch today's activities:", error);
                setActivities([]);
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

    useEffect(() => {
        if (signupStatus) {
            console.log(signupStatus);
        }
    }, [signupStatus]);


    const handleActivityClick = (activity) => {
        setSelectedActivity(activity);
    };

    const handleSignUp = async () => {
        if (!isAuthenticated) {
            console.log('User is not authenticated');
            setSignupStatus('Du må være logget inn for å melde på.');
            setTimeout(() => setSignupStatus(''), 3000);
            return;
        }

       
        if (!selectedActivity) {
            setSignupStatus('Ingen aktivitet er valgt.');
            setTimeout(() => setSignupStatus(''), 3000);
            return;
        }

        try {
            const response = await axios.post(`${baseApiUrl}/digital_medlemsordning/sign_up_activity/`, {
                auth0_id: user.sub,
                activity_id: selectedActivity.activity_id,
            });

            if (response.status === 200 || response.status === 201) {
                setSignupStatus('Du er registrert nå.');
                console.log(signupStatus)
                setTimeout(() => {
                    setSignupStatus('');
                    setSelectedActivity(null);
                    console.log(signupStatus);
                }, 3000);
            }
        } catch (error) {
            setSignupStatus('Du kan ikke registrere nå, vennligst vent litt.');
            setTimeout(() => {
                setSignupStatus('');
            }, 3000);
            console.error('Failed to sign up for the activity:', error);
        }
    };



    const handleCloseDetails = () => {
        setSelectedActivity(null);
        setSignupStatus('');
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
                            <button className="today-modal-button" onClick={() => handleSignUp(selectedActivity.activity_id)}>
                                Meld på
                            </button>
                        </div>
                        {signupStatus && <div className="signup-status">{signupStatus}</div>}
                    </div>
                </div>
            )}
        </div>
    );

}

export default TodayActivitiesComponent;