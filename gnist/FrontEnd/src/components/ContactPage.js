import React from 'react';
import './ContactPage.css'; 

const ContactPage = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Kontakt oss</h1>
        <div className="social-media-links">
          <a href="https://t.snapchat.com/MzMp6E37" target="_blank" rel="noopener noreferrer">
            <img src="/Snapchat_App_Icon.png" alt="Snapchat" />
          </a>
          <a href="https://www.instagram.com/fyrung?igshid=ZDBsbW15ZGVkcDY2" target="_blank" rel="noopener noreferrer">
            <img src="/Instagram_App_Icon.png" alt="Instagram" />
          </a>
          <a href="https://www.tiktok.com/@fyrung" target="_blank" rel="noopener noreferrer">
            <img src="/Tiktok-App_Icon.png" alt="TikTok" />
          </a>
        </div>
        <p>Trenger du å snakke med noen? Send melding til 91 91 74 10 (Kathrine)</p>
        <p>Har du et forslag til klubben? Send inn her: 
          <a href="mailto:fyrverkeriet.ungdomshus@gmail.com">fyrverkeriet.ungdomshus@gmail.com</a>, hvis mulig.
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
