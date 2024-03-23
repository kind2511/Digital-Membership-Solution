import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import './UserProfilePicture.css';

function UserProfilePicture({ profileImg, setProfileImg }) {
  const { user } = useAuth0();

  const handleProfileImgChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
        localStorage.setItem('profileImg', reader.result);
        handleProfileImgSubmit(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImgSubmit = async (file) => {
    const formData = new FormData();
    formData.append('profile_pic', file);
    try {
      const response = await axios.patch(
        `http://localhost:8000/digital_medlemsordning/upload-profile-picture/${user.sub}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log('Image uploaded successfully:', response.data);
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };
  

  return (
    <div className="profile-img-container" onClick={() => document.getElementById('profileImgInput').click()}>
      {profileImg ? (
        <img src={profileImg} alt="Profile" className="profile-img" />
      ) : (
        <div className="profile-img-placeholder">Legg til bilde</div>
      )}
      <input
        id="profileImgInput"
        type="file"
        accept="image/*"
        onChange={handleProfileImgChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default UserProfilePicture;
