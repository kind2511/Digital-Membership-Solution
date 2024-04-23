import React, { useState, useEffect } from 'react';
import './MinMening.css';

const MinMening = () => {
    const [title, setTitle] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    
    // TEST STYLE 
    useEffect(() => {
        setQuestions([
            { id: 1, text: "What is your favorite color?", answers: ["Red", "Blue", "Green"] },
            { id: 2, text: "Best programming language?", answers: ["JavaScript", "Python", "C#", "Rust"] },
        ]);
    }, []);

    const handleSuggestionSubmit = (e) => {
        e.preventDefault();
        console.log(`Suggestion Sent: ${title} - ${suggestion}`);
        setTitle('');
        setSuggestion('');
    };

    const openQuestionModal = (question) => {
        setSelectedQuestion(question);
        setSelectedAnswer('');
    };

    const closeQuestionModal = () => {
        setSelectedQuestion(null);
        setSelectedAnswer('');
    };

    const handleAnswerChange = (answer) => {
        setSelectedAnswer(answer);
    };

    const submitAnswer = () => {
        console.log(`Answer Submitted for Question ID ${selectedQuestion.id}: ${selectedAnswer}`);
        closeQuestionModal();
    };

    return (
        <div className="minMeningContainer">
            <section className="suggestionSection">
                <h2>Forslag</h2>
                <form onSubmit={handleSuggestionSubmit}>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tittel" required />
                    <textarea value={suggestion} onChange={(e) => setSuggestion(e.target.value)} placeholder="Ditt forslag" required />
                    <button type="submit">Send Inn</button>
                </form>
            </section>
            <section className="questionSection">
                <h2>Avstemninger</h2>
                {questions.map(question => (
                    <div key={question.id} className="question" onClick={() => openQuestionModal(question)}>
                        <p>{question.text}</p>
                    </div>
                ))}
            </section>

            {selectedQuestion && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h3>{selectedQuestion.text}</h3>
                        <div className="answers">
                            {selectedQuestion.answers.map(answer => (
                                <div key={answer} className="answerOption">
                                    <label>
                                        <input
                                            type="radio"
                                            name="answer"
                                            value={answer}
                                            checked={selectedAnswer === answer}
                                            onChange={() => handleAnswerChange(answer)}
                                        />
                                        {answer}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="modalButtons">
                            <button onClick={submitAnswer} disabled={!selectedAnswer}>Send Inn</button>
                            <button onClick={closeQuestionModal}>Lukk</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MinMening;
