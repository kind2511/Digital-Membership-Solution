import React, { useState } from "react";
import './MinMening.css';

function MinMening() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ title, description });
  };

  return (
    <div className="minMening-container">
      <hr className="divider" />
      <h1 className="title">Send Inn Forslag</h1>
      <form className="forslag-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="forslag-input"
          placeholder="Tittel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="forslag-textarea"
          placeholder="Beskrivelse"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit" className="forslag-submit">Send</button>
      </form>
    </div>
  );
}

export default MinMening;
