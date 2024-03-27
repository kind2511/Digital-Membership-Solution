import React, { useState, useEffect } from "react";
import AnswerQuestions from "./AnswerQuestions";
import './MinMening.css';

function MinMening() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/digital_medlemsordning/get_all_questions');
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleSubmissionConfirm = async (confirm) => {
    if (confirm) {
      const requestBody = {
        title: title,
        description: description
      };

      try {
        const response = await fetch('http://127.0.0.1:8000/digital_medlemsordning/create_suggestion/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Suggestion sent successfully:', data);
        setTitle('');
        setDescription('');
        setConfirmationMessage('Takk for ditt forslag');
        setTimeout(() => setConfirmationMessage(''), 3000);
      } catch (error) {
        console.error("Error sending suggestion:", error);
      }
    }
    setShowConfirmModal(false);
  };

  return (
    <div className="minMening-container">
      {showConfirmModal && (
        <div className="forslag-modal-overlay">
          <div className="forslag-modal-content">
            <p>Er du sikker på at du vil sende forslag?</p>
            <button onClick={() => handleSubmissionConfirm(true)}>Ja</button>
            <button onClick={() => handleSubmissionConfirm(false)}>Nei</button>
          </div>
        </div>
      )}
      {confirmationMessage && (
        <div className="confirmation-message">{confirmationMessage}</div>
      )}
      <div className="questions-container">
        {questions.map((question) => (
          <div key={question.questionID} className="question-block">
            <h2 className="question-title">{question.question}</h2>
            <ul className="answers-list">
              {question.answers.map((answer) => (
                <li key={answer.answer_id} className="answer">
                  {answer.answer_text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <hr className="divider" />
      <h1 className="title">Send Inn Forslag</h1>
      <form className="forslag-form" onSubmit={(e) => e.preventDefault()}>
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
        <button type="button" className="forslag-submit" onClick={() => setShowConfirmModal(true)}>Send</button>
      </form>
      <AnswerQuestions />
    </div>
  );

}

export default MinMening;
