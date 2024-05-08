import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import './ProgramComponent.css';

function ProgramComponent() {
  const { user, isAuthenticated } = useAuth0();
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [signupStatus, setSignupStatus] = useState('');
  const baseApiUrl = 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${baseApiUrl}/digital_medlemsordning/get_future_activities/`);
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      const data = await response.json();
      setPrograms(data); 
    } catch (error) {
      console.error(error);
      setPrograms([]);
    }
  };

  const handleTitleClick = (program) => {
    setSelectedProgram(program);
    const isUserSignedUp = program.signed_up_members.some(member => member.auth0ID === user.sub);
    program.isSignedUp = isUserSignedUp; // update local state 
    setSelectedProgram({...program}); //update
  };

  const handleSignUp = async (activityId) => {
    if (!isAuthenticated) {
      console.log('User is not authenticated');
      return;
    }

    setSelectedProgram(prev => ({...prev, isSignedUp: true})); //update 

    try {
      const response = await axios.post(`${baseApiUrl}/digital_medlemsordning/sign_up_activity/`, {
        auth0_id: user.sub,
        activity_id: activityId,
      });

      if (response.status === 200 || response.status === 201) {
        setSignupStatus('Du er registrert nå.');
        setTimeout(() => {
          setSignupStatus('');
        }, 3000);
      } else {
        throw new Error('Failed to sign up'); 
      }
    } catch (error) {
      console.error('Failed to sign up for the activity:', error);
      setSelectedProgram(prev => ({...prev, isSignedUp: false})); //  update
      setSignupStatus('Du kan ikke registrere nå, vennligst vent litt.');
      setTimeout(() => {
        setSignupStatus('');
      }, 3000);
    }
  };

  const handleUndoSignup = async (activityId) => {
    if (!isAuthenticated) {
      console.log('User is not authenticated');
      return;
    }

    setSelectedProgram(prev => ({...prev, isSignedUp: false})); //  update UI

    try {
      const response = await axios.post(`${baseApiUrl}/digital_medlemsordning/undo_signup_activity/`, {
        auth0_id: user.sub,
        activity_id: activityId,
      });

      if (response.status === 200) {
        setSignupStatus('Påmelding avmeldt.');
        setTimeout(() => {
          setSignupStatus('');
        }, 3000);
      } else {
        throw new Error('Failed to undo signup'); 
      }
    } catch (error) {
      console.error("Error undoing signup:", error);
      setSelectedProgram(prev => ({...prev, isSignedUp: true})); 
      setSignupStatus('Feil ved avmelding, vennligst prøv igjen senere.');
      setTimeout(() => {
        setSignupStatus('');
      }, 3000);
    }
  };

  return (
    <div className="program-list">
      {programs.map((program, index) => (
        <div key={index} className="program-entry" onClick={() => handleTitleClick(program)}>
          <img src={program.image ? `${baseApiUrl}${program.image}` : "https://via.placeholder.com/60"} alt={program.title} className="program-image" />
          <div className="program-details">
            <div className="program-title">{program.title}</div>
            <div className="program-date">{program.date}</div>
          </div>
        </div>
      ))}

      {selectedProgram && (
        <div className="program-modal" onClick={() => setSelectedProgram(null)}>
          <div className="program-modal-content" onClick={e => e.stopPropagation()}>
            <h2>{selectedProgram.title}</h2>
            <p>{selectedProgram.description}</p>
            <div className="modal-buttons">
              <button onClick={() => setSelectedProgram(null)}>Lukk</button>
              {selectedProgram.isSignedUp ? (
                <button onClick={() => handleUndoSignup(selectedProgram.activityID)}>Meld av</button>
              ) : (
                <button onClick={() => handleSignUp(selectedProgram.activityID)}>Meld på</button>
              )}
            </div>
            {signupStatus && <div className="signup-status">{signupStatus}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgramComponent;
