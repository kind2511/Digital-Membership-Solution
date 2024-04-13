import React, { useState, useEffect } from 'react';
import './Forslag.css';

function Forslag() {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/digital_medlemsordning/get_all_suggestions/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleDeleteSuggestion = async (suggestionID) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/digital_medlemsordning/delete_suggestion/${suggestionID}/`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete suggestion');
      }
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      await fetchSuggestions();
    } catch (error) {
      console.error('Error deleting suggestion:', error);
    }
  };

  return (
    <div className="forslag-container">
      <h2 className="section-title">Forslag</h2>
      <div className="section-content">
        {suggestions.map((suggestion) => (
          <div key={suggestion.suggestionID} className="suggestion-item">
            <h3>{suggestion.title}</h3>
            <p>{suggestion.description}</p>
            <button
              className="delete-suggestion-button"
              onClick={() => handleDeleteSuggestion(suggestion.suggestionID)}
            >
              Slett
            </button>
          </div>
        ))}
      </div>
      {showSuccessMessage && (
        <div className="delete-suggestion-success-message ">Forslaget ble slettet.</div>
      )}
    </div>
  );
}

export default Forslag;
