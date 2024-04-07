import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const promoSentences = [
  "Bli medlem enkelt: Logg inn og start din reise hos oss",
  "Ditt nærvær teller - registrer besøket og nyt fordelene",
  "Stig opp i nivåer: Fra Noob til Pro, hver dag hos oss teller",
  "Hold deg oppdatert med dagens program - bli med på aktiviteten",
  "Din stemme teller: delta i meningsmålinger og bidra med forslag"
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
        setSentenceIndex((sentenceIndex + 1) % promoSentences.length);
        setDisplayedText('');
      }, 2000);
    } else {
      currentTimer = setTimeout(() => {
        setDisplayedText(promoSentences[sentenceIndex].substr(0, displayedText.length + 1));
      }, 50);
    }

    return () => {
      clearTimeout(currentTimer);
    };
  }, [displayedText, sentenceIndex]);

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
        <button onClick={handleAuthAction}>Login/Register</button>
      </div>
      <div className="kontakt-oss-link-container">
        <Link to="/kontakt-oss" className="kontakt-link">Kontakt oss</Link>
      </div>
    </div>
  );
};

export default HomePage;
