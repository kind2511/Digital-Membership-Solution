import React, { useState } from 'react';
import './Undersøkelser.css';

function Undersøkelser() {
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    answers: ['', '', '']
  });

  const handleChangeQuestion = (e) => {
    setNewQuestion(prev => ({ ...prev, question: e.target.value }));
  };

  const handleChangeAnswer = (index, value) => {
    const updatedAnswers = [...newQuestion.answers];
    updatedAnswers[index] = value;
    setNewQuestion(prev => ({ ...prev, answers: updatedAnswers }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle  logic here :)
    console.log(newQuestion);
  };

  return (
    <div className="undersøkelser-container">
      {/* Nytt Spørsmål Section */}
      <div className="section nytt-spørsmål">
        <h2 className="section-title">Nytt Spørsmål</h2>
        <form onSubmit={handleSubmit} className="question-form">
          <input
            type="text"
            placeholder="Skriv inn spørsmålet"
            value={newQuestion.question}
            onChange={handleChangeQuestion}
            required
          />
          {newQuestion.answers.map((answer, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Svar ${index + 1}`}
              value={answer}
              onChange={(e) => handleChangeAnswer(index, e.target.value)}
              required
            />
          ))}
          <button type="submit">Lagre Spørsmål</button>
        </form>
      </div>

      {/* Alle Spørsmål Section */}
      <div className="section alle-spørsmål">
        <h2 className="section-title">Alle Spørsmål</h2>
        {/*  displaying all questions goes here */}
      </div>
    </div>
  );
}

export default Undersøkelser;
