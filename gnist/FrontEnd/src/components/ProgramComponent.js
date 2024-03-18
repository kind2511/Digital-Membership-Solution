import React, { useState, useEffect } from 'react';
import './ProgramComponent.css';

function ProgramComponent() {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/digital_medlemsordning/get_all_activity/');
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      const data = await response.json();
      setPrograms(data.activities);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTitleClick = (program) => {
    setSelectedProgram(program);
  };

  return (
    <div className="program-list">
      {programs.map(program => (
        <div key={program.title} className="program-entry" onClick={() => handleTitleClick(program)}>
          <img src={program.image ? program.image : "https://via.placeholder.com/60"} alt="Program" className="program-image" />
          <div className="program-details">
            <div className="program-title">{program.title}</div>
            <div className="program-date">{program.dates.join(", ")}</div>
          </div>
        </div>
      ))}
      {selectedProgram && (
        <div className="program-modal" onClick={() => setSelectedProgram(null)}>
          <div className="program-modal-content" onClick={e => e.stopPropagation()}>
            <h2>{selectedProgram.title}</h2>
            <p>{selectedProgram.description}</p>
            <div className="modal-buttons">
              <button onClick={() => setSelectedProgram(null)}>Close</button>
              <button>{selectedProgram.sign_up ? "Meld av" : "Meld på"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgramComponent;
