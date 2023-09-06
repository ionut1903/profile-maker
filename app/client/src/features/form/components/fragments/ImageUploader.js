import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const ProfilePhotoContainer =  styled.div`
  padding: 25px;
  display:flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
    position: relative;
  }
  &:hover::after {
    content: 'Change Photo';
    position: absolute;
    cursor: pointer;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
   
  }
`
const ErrorMessage = styled.p`
  color: red;
  font-size: 9pt
`

const ProfilePhoto = styled.img`
  max-width: 150px;
  max-height: 150px;
  cursor: pointer;
`;

const ImageUploader = ({ onPhotoChange, currentPhoto }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(currentPhoto);
  const [error, setError] = useState(false)
  const ref = useRef(null)
  function toBase64(file, callback) {
    var reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = function () {
     callback(reader.result);
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
  }


  const handlePhotoUpload = (event) => {
    const uploadedImage = event.target.files[0];
    const MB = 1024 * 1024;
    if(uploadedImage && uploadedImage.size > 1*MB) {
      setError(true);
      return;
    }
    if (uploadedImage && uploadedImage.size < 1*MB) {
      setError(false)
      setSelectedPhoto(URL.createObjectURL(uploadedImage));
      toBase64(uploadedImage, onPhotoChange)
    }
  };

  return (
    <ProfilePhotoContainer onClick={() => ref.current.click()}>
      <label htmlFor="profile-photo-input" className="profile-photo-label">
          <ProfilePhoto src={selectedPhoto? selectedPhoto: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png'} alt="Profile" className="profile-photo" width={200} height={250} />
      </label>
      <input
        type="file"
        ref={ref}
        id="profile-photo-input"
        accept="image/*"
        onChange={handlePhotoUpload}
        style={{ display: 'none'}}
      />
      {error && <ErrorMessage>Size should not exceed 1 MB</ErrorMessage>}
    </ProfilePhotoContainer>
  );
};

export default ImageUploader;