import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import './MinMening.css';

function MinMening() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [messageType, setMessageType] = useState('confirmation');

  useEffect(() => {
    axios.get('http://localhost:8000/digital_medlemsordning/get_all_questions')
      .then(response => {
        setQuestions(response.data.questions);
      })
      .catch(error => {
        console.error("Error fetching questions:", error);
      });
  }, []);


  const handleSubmissionConfirm = async (confirm) => {
    if (confirm) {
      try {
        await axios.post('http://localhost:8000/digital_medlemsordning/create_suggestion/', { title, description });
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


  const handleQuestionSelect = question => {
    setSelectedQuestion(question);
  };

  const handleCancel = () => {
    setSelectedQuestion(null);
  };

  const handleSubmitAnswer = async () => {
    if (!user?.sub) {
      console.error('User authentication required.');
      return;
    }

    const selectedAnswerValue = document.querySelector('input[name="selectedAnswer"]:checked')?.value;
    if (!selectedAnswerValue) {
      console.error('No answer selected.');
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const endpoint = `http://localhost:8000/digital_medlemsordning/submit_response/${user.sub}/`;

      const response = await axios.post(endpoint, {
        question: selectedQuestion.questionID,
        answer: selectedAnswerValue
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        setConfirmationMessage("Svar ble sendt.");
        setMessageType('confirmation');
        setSelectedQuestion(null);
        setTimeout(() => setConfirmationMessage(''), 3000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.error === "User has already answered this question") {
        setConfirmationMessage("Spørsmål allerede besvart.");
        setMessageType('error');
        setTimeout(() => setConfirmationMessage(''), 3000);
      } else {
        console.error("Error submitting answer:", error.response ? error.response.data : error);
      }
    }
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
        <div className={`message ${messageType === 'confirmation' ? 'confirmation' : 'error'}`}>{confirmationMessage}</div>
      )}
      <div className="questions-container">
        {questions.map((question) => (
          <div key={question.questionID} className="question-block" onClick={() => handleQuestionSelect(question)}>
            <h2 className="question-title">{question.question}</h2>
          </div>
        ))}
      </div>
      {selectedQuestion && (
        <div className="answers-container">
          <h3>Answers for: {selectedQuestion.question}</h3>
          <ul className="answers-list">
            {selectedQuestion.answers.map((answer) => (
              <li key={answer.answer_id} className="answer">
                <label>
                  <input type="radio" name="selectedAnswer" value={answer.answer_id} />
                  {answer.answer_text}
                </label>
              </li>
            ))}
          </ul>
          <div className="button-group">
            <button className="cancel-button" onClick={handleCancel}>Avbryt</button>
            <button className="answer-button" onClick={handleSubmitAnswer}>Svar</button>
          </div>
        </div>
      )}
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
        <button type="button" className="forslag-submit" onClick={() => setShowConfirmModal(true)}>Send Inn</button>
      </form>
    </div>
  );
}

export default MinMening;
