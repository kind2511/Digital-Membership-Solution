import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const promoSentences = [
    "Add your sentence here",
    "Add your sentence here!",
    "Add your sentence here!",
    "Add your sentence here"
];

const HomePage = () => {
    const [displayedText, setDisplayedText] = useState('');
    const [sentenceIndex, setSentenceIndex] = useState(0);

    useEffect(() => {
        let currentTimer;

        const isCompleteSentence = displayedText === promoSentences[sentenceIndex];
        if (isCompleteSentence) {
            currentTimer = setTimeout(() => {
                const nextIndex = (sentenceIndex + 1) % promoSentences.length;
                setSentenceIndex(nextIndex);
                setDisplayedText('');
            }, 3000);
        } else {
            currentTimer = setTimeout(() => {
                const newText = promoSentences[sentenceIndex].substr(0, displayedText.length + 1);
                setDisplayedText(newText);
            }, 50);
        }

        return () => {
            clearTimeout(currentTimer);
        };
    }, [displayedText, sentenceIndex]);

    return (
        <div className="home-page">
            <div className="left">
                <div className="sentence-section">
                    <p>{displayedText}</p>
                </div>
            </div>
            <div className="right">
                <Link to="/" className="nav-logo">Gen<span>Nex</span></Link>
                <div className="navigation-section">
                    <button><Link to="/login">Login</Link></button>
                    <button><Link to="/register">Register</Link></button>
                    <div className="footer-about">
                        <Link to="/about">About Us</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
