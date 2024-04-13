import React, { useEffect, useState } from 'react';
import './Bevis.css'; 

function Bevis() {
  const [certificate, setCertificate] = useState(null);

  
  useEffect(() => {
    // TODO: 
    const fetchCertificate = async () => {
      const mockCertificate = { 
        id: 1, 
        title: "Certificate 1", 
        date: "2024-04-15", 
        url: "#" 
      };

      setCertificate(mockCertificate);
    };

    fetchCertificate(); 
  }, []);

  return (
    <div className="meldinger-content">
      <h2 className="section-title">Mitt Bevis</h2>
      {certificate && (
        <div className="certificate-card">
          <div className="certificate-info">
            <p className="certificate-title">{certificate.title}</p>
            <p className="certificate-date">{certificate.date}</p>
          </div>
          <a className="certificate-link" href={certificate.url} target="_blank" rel="noopener noreferrer">
            Åpne Bevis
          </a>
        </div>
      )}
    </div>
  );
}

export default Bevis;
