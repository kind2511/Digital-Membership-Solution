import React, { useState } from 'react';
import './ProgramComponent.css';

function ProgramComponent() {
  const [programs] = useState([
    { id: 1, title: "Program 1", image: "https://via.placeholder.com/60", details: "This is the first program's details..." },
  ]);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const handleTitleClick = (program) => {
    setSelectedProgram(program); 
  };

  return (
    <div className="program-list">
      {programs.map(program => (
        <div key={program.id} className="program-entry" onClick={() => handleTitleClick(program)}>
          <img src={program.image || "https://via.placeholder.com/60"} alt="Program" className="program-image" />
          <div className="program-title">{program.title}</div>
        </div>
      ))}
      {selectedProgram && (
        <div className="program-modal" onClick={() => setSelectedProgram(null)}>
          <div className="program-modal-content" onClick={e => e.stopPropagation()}>
            <h2>{selectedProgram.title}</h2>
            <p>{selectedProgram.details}</p>
            <div className="modal-buttons">
              <button onClick={() => setSelectedProgram(null)}>Close</button>
              <button>Meld på</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgramComponent;
