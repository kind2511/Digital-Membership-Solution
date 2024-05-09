import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import './Bevis.css';

function Bevis() {
  const [certificates, setCertificates] = useState([]);
  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`http://localhost:8000/digital_medlemsordning/get_member_certificates/${user.sub}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCertificates(response.data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };

    if (user) {
      fetchCertificates();
    }
  }, [user, getAccessTokenSilently]);

  return (
    <div className="meldinger-content">
      <h2 className="section-title">Mitt Bevis</h2>
      {certificates.length > 0 ? (
        certificates.map((certificate) => (
          <div className="certificate-card" key={certificate.certificateID}>
            <div className="certificate-info">
              <p className="certificate-title">{certificate.certificate_name}</p>
              <img src={`http://localhost:8000${certificate.certificate_image}`} alt="Certificate" className="certificate-image"/>
            </div>
            <a className="certificate-link" href={`http://localhost:8000${certificate.certificate_image}`} target="_blank" rel="noopener noreferrer">
              Åpne Bevis
            </a>
          </div>
        ))
      ) : (
        <p>Ingen sertifikater funnet.</p>
      )}
    </div>
  );
}

export default Bevis;
