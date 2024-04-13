import React, { useState, useRef } from 'react';
import './LastOppBevis.css';

function LastOppBevis() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [results, setResults] = useState([]);
    const [searchStatus, setSearchStatus] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);  
    const fileInputRef = useRef(null);  

    const fetchData = (value) => {
        if (value.trim() === '') {
            setResults([]);
            setSearchStatus('');
            return;
        }

        setSearchStatus('Searching...');

        fetch(`http://127.0.0.1:8000/digital_medlemsordning/search_member/?name=${value}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setResults(data);
                setSearchStatus(`Found ${data.length} results.`);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setSearchStatus("Failed to fetch data. Please try again later.");
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
        setResults([]); // Clear search results
        setSearchStatus('');
    };

    const handleUpload = () => {
        if (!selectedMember) {
            alert('Please select a member to upload a certificate for.');
            return;
        }
        
        const file = fileInputRef.current.files[0]; // Access the file from the ref
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('certificate', file);

        fetch(`http://127.0.0.1:8000/digital_medlemsordning/add_user_certificate/${selectedMember.auth0ID}/`, {
            method: 'PATCH',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            setUploadSuccess(true); 
            setTimeout(() => setUploadSuccess(false), 3000); 
            setSelectedMember(null); // Reset selected member
            setSearchTerm(''); // Clear search term
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
                    <div className="buttons-container">
                        <button className="upload-button" onClick={handleUpload}>Last Opp</button>
                        <button className="close-button" onClick={handleClose}>Lukk</button>
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
        </div>
    );
}

export default LastOppBevis;
