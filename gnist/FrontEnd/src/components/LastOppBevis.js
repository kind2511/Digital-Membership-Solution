import React, { useState, useRef } from 'react';
import './LastOppBevis.css';

function LastOppBevis() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [results, setResults] = useState([]);
    const [searchStatus, setSearchStatus] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [certificates, setCertificates] = useState([]);
    const [imageViewer, setImageViewer] = useState('');
    const fileInputRef = useRef(null);
    const certificateNameRef = useRef(null);

    const fetchData = (value) => {
        if (value.trim() === '') {
            setResults([]);
            setSearchStatus('');
            return;
        }
        setSearchStatus('Searching...');
        fetch(`http://127.0.0.1:8000/digital_medlemsordning/search_member/?name=${value}`)
            .then(response => response.json())
            .then(data => {
                setResults(data);
                setSearchStatus(`Found ${data.length} results.`);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setSearchStatus("Failed to fetch data. Please try again later.");
            });
    };

    const fetchCertificates = (auth0ID) => {
        fetch(`http://127.0.0.1:8000/digital_medlemsordning/get_member_certificates/${auth0ID}/`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched certificates:', data);
                setCertificates(data);
            })
            .catch(error => {
                console.error("Error fetching certificates:", error);
            });
    };

    const deleteCertificate = (certificateId) => {
        console.log('Deleting certificate with ID:', certificateId);
        if (certificateId === undefined) {
            console.error('Certificate ID is undefined.');
            return;
        }
        fetch(`http://127.0.0.1:8000/digital_medlemsordning/delete_member_certificate/${certificateId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json().catch(() => {});
        })
        .then(data => {
            console.log('Success data:', data);
            setDeleteSuccess(true);
            setTimeout(() => setDeleteSuccess(false), 3000);
            fetchCertificates(selectedMember.auth0ID);
        })
        .catch(error => {
            console.error("Error deleting certificate:", error);
            alert('Failed to delete certificate.');
        });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        fetchData(value);
    };

    const handleSelectMember = (member) => {
        setSelectedMember(member);
        setSearchTerm(`${member.first_name} ${member.last_name}`);
        setResults([]);
        setSearchStatus('');
        fetchCertificates(member.auth0ID);
    };

    const handleUpload = () => {
        if (!selectedMember) {
            alert('Velg et medlem å laste opp et bevis for.');
            return;
        }
        const file = fileInputRef.current.files[0];
        const certificateName = certificateNameRef.current.value;
        if (!file || !certificateName) {
            alert('Velg en fil og skriv inn et bevis navn for å laste opp.');
            return;
        }
        const formData = new FormData();
        formData.append('certificate_image', file);
        formData.append('certificate_name', certificateName);

        fetch(`http://127.0.0.1:8000/digital_medlemsordning/upload_member_certificates/${selectedMember.auth0ID}/`, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
            fetchCertificates(selectedMember.auth0ID); 
        })
        .catch(error => {
            alert('Failed to upload certificate.');
            console.error('Error:', error);
        });
    };

    const handleClose = () => {
        setSelectedMember(null);
        setSearchTerm('');
        setSearchStatus('');
        setCertificates([]); 
        setImageViewer(''); 
    };

    const toggleModal = () => {
        setShowModal(!showModal);
        setImageViewer(''); 
    };

    const handleCertificateClick = (cert) => {
        setImageViewer(cert.certificate_image); 
    };

    return (
        <div className="last-opp-bevis-container">
            <h2 className="section-title">Last Opp Bevis</h2>
            {!selectedMember && (
                <input
                    type="text"
                    className="search-input"
                    placeholder="Søk etter medlem..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            )}
            <div className="search-status">{searchStatus}</div>
            {selectedMember ? (
                <div className="selected-member">
                    <div className="selected-name">{`${selectedMember.first_name} ${selectedMember.last_name}`}</div>
                    <input type="file" ref={fileInputRef} className="file-input" />
                    <input type="text" ref={certificateNameRef} placeholder="Skriv inn bevis navn" className="certificate-name-input" />
                    <div className="buttons-container">
                        <button className="upload-button" onClick={handleUpload}>Last Opp</button>
                        <button className="close-button" onClick={handleClose}>Lukk</button>
                        <button className="vis-bevis-modal-button" onClick={toggleModal}>Vis Andre Bevis</button>
                    </div>
                </div>
            ) : (
                <div className="section-content">
                    {results.map((member, index) => (
                        <div key={index} className="search-result" onClick={() => handleSelectMember(member)}>
                            {`${member.first_name} ${member.last_name}`}
                        </div>
                    ))}
                </div>
            )}
            {uploadSuccess && (
                <div className="last-opp-success-message">Bevis ble lastet opp</div>
            )}
            {deleteSuccess && (
                <div className="last-opp-success-message">Bevis ble slettet</div>
            )}
            {showModal && (
                <div className="last-opp-modal-container">
                    <div className="last-opp-modal-content">
                        <span className="last-opp-close-modal" onClick={toggleModal}>&times;</span>
                        <div className="certificates-container">
                            {certificates.map((cert, index) => (
                                <div key={cert.certificateID} className="certificate-entry">
                                    <div onClick={() => handleCertificateClick(cert)}>
                                        {`${index + 1}. ${cert.certificate_name}`}
                                    </div>
                                    <button className="last-opp-delete-button" onClick={() => {
                                        console.log('Certificate ID to be deleted:', cert.certificateID);
                                        deleteCertificate(cert.certificateID);
                                    }}>Slett</button>
                                </div>
                            ))}
                        </div>
                        {imageViewer && <img src={imageViewer} alt="Certificate View" className="certificate-image" />}
                    </div>
                </div>
            )}
        </div>
    );
}

export default LastOppBevis;
