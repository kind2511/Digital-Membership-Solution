import React, { useState, useEffect } from 'react';
import './Undersøkelser.css';

function Undersøkelser() {
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    answers: ['', '', '', '', '']
  });

  const [questions, setQuestions] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionDetails, setQuestionDetails] = useState({});

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
          setNewQuestion({ question: '', answers: ['', '', '', '', ''] });
          setShowSuccessMessage(false);
        }, 4000);
        // Fetch updated list of questions
        return fetch('http://127.0.0.1:8000/digital_medlemsordning/get_all_questions/');
      })
      .then(response => response.json())
      .then(data => {
        setQuestions(data.questions);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  

  useEffect(() => {
    fetch('http://127.0.0.1:8000/digital_medlemsordning/get_all_questions/')
      .then(response => response.json())
      .then(data => {
        setQuestions(data.questions);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const handleQuestionClick = (questionId) => {
    fetch(`http://127.0.0.1:8000/digital_medlemsordning/get_question_responses/${questionId}/`)
      .then(response => response.json())
      .then(data => {
        setQuestionDetails(data);
        setSelectedQuestion(questionId);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleDeleteQuestion = async (questionId) => {
    console.log('Attempting to delete question with ID:', questionId);
    const url = `http://127.0.0.1:8000/digital_medlemsordning/delete_question/${questionId}/`;
    console.log('DELETE Request URL:', url);

    try {
      const response = await fetch(url, { method: 'DELETE' });

      if (response.ok) {
        setSuccessMessage('Spørsmålet ble slettet');
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 4000);
        setQuestions(questions.filter(q => q.questionID !== questionId));
        setSelectedQuestion(null);
      } else {
        if (response.status !== 204) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete the question');
        } else {
          setSuccessMessage('Spørsmålet ble slettet');
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 4000);
          setQuestions(questions.filter(q => q.questionID !== questionId));
          setSelectedQuestion(null);
        }
      }
    } catch (error) {
      console.error('Deletion error:', error);
      setSuccessMessage(error.toString());
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 4000);
    }
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
      {/* Fetched Questions Section */}
      <div className="section fetched-questions">
        <h2 className="section-title">Alle Spørsmål</h2>
        <div className="questions-list">
          {questions.map(question => (
            <div className="question-item" key={question.questionID} onClick={() => handleQuestionClick(question.questionID)}>
              <h3>{question.question}</h3>
              {/* ... answers ... */}
            </div>
          ))}
        </div>
      </div>
      {selectedQuestion && (
        <div className="question-details">
          <h4>{questionDetails.question}</h4>
          {Object.entries(questionDetails.answer_counts).map(([answer, count]) => (
            <p key={answer}>{answer} : {count} brukere</p>
          ))}
          <button onClick={() => setSelectedQuestion(null)}>Lukk</button>
          <button onClick={() => handleDeleteQuestion(selectedQuestion)}>Slett</button>
        </div>
      )}
    </div>
  );
}

export default Undersøkelser;