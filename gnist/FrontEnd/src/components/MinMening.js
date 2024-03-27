import React, { useState, useEffect } from "react";
import './MinMening.css';

function MinMening() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
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

    } catch (error) {
      console.error("Error sending suggestion:", error);
    }
  };

  return (
    <div className="minMening-container">
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
