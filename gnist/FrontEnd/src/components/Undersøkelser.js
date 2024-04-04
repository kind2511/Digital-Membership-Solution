import React, { useState } from 'react';
import './Undersøkelser.css';

function Undersøkelser() {
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    answers: ['', '', '']
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


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

    const payload = {
      question: newQuestion.question,
      answers: newQuestion.answers.map(answer => ({ answer })),
    };

    fetch('http://127.0.0.1:8000/digital_medlemsordning/create_question/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setSuccessMessage('Spørsmålet ble lagret');
        setShowSuccessMessage(true);
        setTimeout(() => {
          setNewQuestion({ question: '', answers: ['', '', ''] });
          setShowSuccessMessage(false);
        }, 4000);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="undersøkelser-container">
      {showSuccessMessage && (
        <div className="undersokelse-success-message">{successMessage}</div>
      )}
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
        {/* displaying all questions goes here */}
      </div>
    </div>
  );
}

export default Undersøkelser;
