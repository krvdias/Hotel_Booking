import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { updateHotel } from '../../../services/adminService';
import { FaHotel, FaMapMarkerAlt, FaUser, FaSave, FaTimes } from 'react-icons/fa';
import './EditHotel.css';

const EditHotel = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Initialize form with passed hotel data
  const [hotel, setHotel] = useState(state?.hotelData || {
    _id: id,
    hotel_name: '',
    hotel_address: '',
    hotel_owner: '',
    hotel_image: null
  });
  
  const [previewImage, setPreviewImage] = useState(state?.hotelData?.hotel_image || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotel(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHotel(prev => ({ ...prev, hotel_image: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('hotel_name', String(hotel.hotel_name));
      formData.append('hotel_address', String(hotel.hotel_address));
      formData.append('hotel_owner', String(hotel.hotel_owner));
      
      if (hotel.hotel_image instanceof File) {
        formData.append('hotel_image', hotel.hotel_image);
      }

      await updateHotel(id, formData);
      navigate('/admin/hotels', { state: { message: 'Hotel updated successfully' } });
    } catch (err) {
      setError('Failed to update hotel');
      console.error('Error updating hotel:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-hotel-container">
      <div className="edit-hotel-header">
        <h2><FaHotel className="header-icon" /> Edit Hotel</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-hotel-form">
        <div className="form-group">
          <label htmlFor="hotel_name">
            <FaHotel className="form-icon" /> Hotel Name
          </label>
          <input
            type="text"
            id="hotel_name"
            name="hotel_name"
            value={hotel.hotel_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="hotel_address">
            <FaMapMarkerAlt className="form-icon" /> Address
          </label>
          <input
            type="text"
            id="hotel_address"
            name="hotel_address"
            value={hotel.hotel_address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="hotel_owner">
            <FaUser className="form-icon" /> Owner
          </label>
          <input
            type="text"
            id="hotel_owner"
            name="hotel_owner"
            value={hotel.hotel_owner}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Hotel Image</label>
          <div className="image-upload-container">
            {previewImage ? (
              <img 
                src={typeof previewImage === 'string' ? 
                  previewImage : 
                  URL.createObjectURL(previewImage)}
                alt="Hotel Preview" 
                className="image-preview"
              />
            ) : (
              <div className="image-placeholder">No Image Selected</div>
            )}
            <input
              type="file"
              id="hotel_image"
              accept="image/*"
              onChange={handleImageChange}
              className="image-upload-input"
            />
            <label htmlFor="hotel_image" className="image-upload-label">
              {previewImage ? 'Change Image' : 'Select Image'}
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={loading}>
            <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/admin/hotels')}
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHotel;