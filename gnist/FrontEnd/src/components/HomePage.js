import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
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
  const { loginWithRedirect} = useAuth0();
 // when remove comment from useEffect function below, should put isAuthenticated, user const useAuth0

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

  //Function to handler user login
  const handleLogin = () => {
    loginWithRedirect();
  };

  /*
   * useEffect hook for redirecting users to their dashboards after login
   */

  // useEffect(() => {
  //   if (isAuthenticated && user) {
  //     const role = user['https://my-namespace/role'];
  //     if (role === 'admin') {
  //       window.location.href = '/admin-dashboard';
  //     } else {
  //       window.location.href = '/user-dashboard';
  //     }
  //   }
  // }, [isAuthenticated, user]);


  // Functoin to handler user regiser
  const handleRegister = () => {
    loginWithRedirect({ screen_hint: 'signup' });
  };

  //Render function 

  return (
    <div className="home-page">
      <div className="left">
        <div className="sentence-section">
          <p>{displayedText}</p>
        </div>
      </div>
      <div className="right">
        <div className="nav-logo">Gen<span>Nex</span></div>
        <div className="navigation-section">
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
          <div className="footer-about">
            <a href="/about">About Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
