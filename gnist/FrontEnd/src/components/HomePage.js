import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './HomePage.css';

const promoSentences = [
  "Your first promo sentence here",
  "Your second promo sentence here!",
  "Your third promo sentence here!",
  "Your fourth promo sentence here"
];

const HomePage = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const { loginWithRedirect } = useAuth0();

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

  // Function to handle user login or registration
  const handleAuthAction = () => {
    loginWithRedirect();
  };

  return (
    <div className="home-page">
      <div className="left">
        <div className="sentence-section">
          <p>{displayedText}</p>
        </div>
      </div>
      <div className="right">
        <div className="nav-logo">Kom i<span> gang</span></div>
        <div className="navigation-section">
          <button onClick={handleAuthAction}>Login/Register</button>
          <div className="footer-about">
            <div className="links-container">
              <a href="/terms-of-use">Brukervilkår</a>
              <a href="/privacy-policy">Personvern</a>
            </div>
            <div className="nav-logo">
              <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
