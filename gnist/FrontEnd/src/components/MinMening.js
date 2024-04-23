import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import './MinMening.css';

const MinMening = () => {
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

    // Confirm submission of suggestion
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

    // Handle question selection
    const handleQuestionSelect = question => {
        setSelectedQuestion(question);
    };

    // Cancel question selection
    const handleCancel = () => {
        setSelectedQuestion(null);
    };

    // Submit answer to selected question
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
        <div className="minMeningUniqueContainer">
            {showConfirmModal && (
                <div className="uniqueForslagModalOverlay">
                    <div className="uniqueForslagModalContent">
                        <p>Er du sikker på at du vil sende forslag?</p>
                        <button onClick={() => handleSubmissionConfirm(true)} className="uniqueForslagSubmit">Ja</button>
                        <button onClick={() => handleSubmissionConfirm(false)} className="uniqueCancelButton">Nei</button>
                    </div>
                </div>
            )}
            {confirmationMessage && (
                <div className={`uniqueMessage ${messageType === 'confirmation' ? 'confirmation' : 'error'}`}>{confirmationMessage}</div>
            )}
            <section className="uniqueSuggestionSection">
                <h2>Send Inn Forslag</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tittel" required />
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ditt forslag" required />
                    <button type="button" 
                    className="uniqueSendInnButton" 
                    onClick={() => setShowConfirmModal(true)}
                    disabled={!title.trim() || !description.trim()}
                    >Send Inn</button>
                </form>
            </section>
            <section className="uniqueQuestionSection">
                <h2>Avstemninger</h2>
                {questions.map(question => (
                    <div key={question.questionID} className="uniqueQuestion" onClick={() => handleQuestionSelect(question)}>
                        <p>{question.question}</p>
                    </div>
                ))}
            </section>
            {selectedQuestion && (
                <div className="uniqueModalOverlay">
                    <div className="uniqueModalContent">
                        <h3>{selectedQuestion.question}</h3>
                        <div className="uniqueAnswers">
                            <ul className="uniqueAnswersList">
                                {selectedQuestion.answers.map((answer) => (
                                    <li key={answer.answer_id} className="uniqueAnswer">
                                        <label>
                                            <input type="radio" name="selectedAnswer" value={answer.answer_id} />
                                            {answer.answer_text}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="uniqueModalButtons">
                            <button className="uniqueCancelButton" onClick={handleCancel}>Avbryt</button>
                            <button className="uniqueAnswerButton" onClick={handleSubmitAnswer}>Svar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MinMening;
