import React from 'react';
import './ContactPage.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnapchatGhost, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Kontakt oss</h1>
        <div className="social-media-links">
          <a href="https://t.snapchat.com/MzMp6E37" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faSnapchatGhost} size="2x" />
          </a>
          <a href="https://www.instagram.com/fyrung?igshid=ZDBsbW15ZGVkcDY2" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
          <a href="https://www.tiktok.com/@fyrung" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTiktok} size="2x" />
          </a>
        </div>
        <div className="contact-info">
          <p>Trenger du å snakke med noen? <span className="contact-detail">91 91 74 10 (Kathrine)</span></p>
          <p>Har du et forslag til klubben? Send inn her: 
            <a className="email-link" href="mailto:fyrverkeriet.ungdomshus@gmail.com">fyrverkeriet.ungdomshus@gmail.com</a>, hvis mulig.
          </p>
          <p>For mer info 
            <a className="info-link" href="https://www.vestre-toten.kommune.no/fyrverkerietung/fyrverkerietungdomshus/" target="_blank" rel="noopener noreferrer">her</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
