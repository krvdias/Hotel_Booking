import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addRoom } from '../../../services/adminService';
import { 
  FaPlus,
  FaTimes,
  FaImage
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './AddRoom.css';

const AddRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bed_count: '',
    type: '',
    price: '',
    hotel: id,
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4); // Limit to 4 images
    
    if (files.length + imagePreviews.length > 4) {
      setError('Maximum 4 images allowed');
      return;
    }

    const newImagePreviews = [];
    const newImages = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImagePreviews.push(reader.result);
        newImages.push(file);
        
        if (newImagePreviews.length === files.length) {
          setImagePreviews(prev => [...prev, ...newImagePreviews]);
          setFormData(prev => ({ 
            ...prev, 
            images: [...prev.images, ...newImages] 
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    const newImages = [...formData.images];
    
    newPreviews.splice(index, 1);
    newImages.splice(index, 1);
    
    setImagePreviews(newPreviews);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const formDataToSend = new FormData();
      formDataToSend.append('bed_count', formData.bed_count);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('hotel', formData.hotel);
      
      formData.images.forEach(image => {
        formDataToSend.append('images', image);
      });

      await addRoom(formDataToSend);
      navigate(`/admin/hotels/${id}/rooms`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add room');
      console.error('Error adding room:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-room-container">
      <h2>Add New Room</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="room-form">
        <div className="form-group">
          <label>Room Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="AC">AC Room</option>
            <option value="Non-AC">Non-AC Room</option>
            <option value="Deluxe">Deluxe Room</option>
            <option value="Suite">Suite</option>
          </select>
        </div>

        <div className="form-group">
          <label>Bed Count</label>
          <select
            name="bed_count"
            value={formData.bed_count}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="1">1 Bed</option>
            <option value="2">2 Beds</option>
            <option value="3">3 Beds</option>
          </select>
        </div>

        <div className="form-group">
          <label>Price per Night (Rs.)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Room Images (Max 4)</label>
          <div className="image-upload-container">
            {imagePreviews.length > 0 ? (
              <div className="image-preview-grid">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview-wrapper">
                    <img 
                      src={preview} 
                      alt={`Preview ${index}`} 
                      className="image-preview"
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-images-placeholder">
                <FaImage size={40} />
                <span>No images selected</span>
              </div>
            )}

            {imagePreviews.length < 4 && (
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="room-images"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple
                  className="file-input"
                />
                <label htmlFor="room-images" className="upload-label">
                  <FaPlus /> Add Images
                </label>
                <span className="file-upload-hint">(Select up to {4 - imagePreviews.length} more)</span>
              </div>
            )}
          </div>
        </div>

        <motion.button
          type="submit"
          className="submit-button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
          {loading ? 'Adding Room...' : 'Add Room'}
        </motion.button>
      </form>
    </div>
  );
};

export default AddRoom;