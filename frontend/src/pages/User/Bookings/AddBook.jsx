import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaArrowLeft, FaBed } from 'react-icons/fa';
import { userBookRoom } from '../../../services/userServices';
import './AddBook.css';

const AddBook = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId, userId } = location.state || {};
  
  const [bookingData, setBookingData] = useState({
    check_in: '',
    days_count: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: name === 'days_count' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        userId,
        roomId,
        check_in: bookingData.check_in,
        days_count: bookingData.days_count
      };
      
      await userBookRoom(data);
      navigate(`/user/bookings`); // Redirect to bookings page after success
    } catch (err) {
      console.error('Booking failed:', err);
      setError(err.response?.data?.message || 'Failed to book room');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to RoomList page
  };

  // Calculate check-out date
  const calculateCheckoutDate = () => {
    if (!bookingData.check_in || !bookingData.days_count) return '';
    
    const checkInDate = new Date(bookingData.check_in);
    checkInDate.setDate(checkInDate.getDate() + bookingData.days_count);
    return checkInDate.toISOString().split('T')[0];
  };

  return (
    <div className="add-book-container">
      <div className="add-book-header">
        <button className="back-button" onClick={handleCancel}>
          <FaArrowLeft /> Cancel
        </button>
        <h2>Book Your Room</h2>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="check_in">
            <FaCalendarAlt className="icon" /> Check-in Date
          </label>
          <input
            type="date"
            id="check_in"
            name="check_in"
            value={bookingData.check_in}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="days_count">
            <FaBed className="icon" /> Number of Days
          </label>
          <input
            type="number"
            id="days_count"
            name="days_count"
            min="1"
            max="30"
            value={bookingData.days_count}
            onChange={handleChange}
            required
          />
        </div>

        {bookingData.check_in && (
          <div className="date-summary">
            <p>
              <strong>Check-in:</strong> {bookingData.check_in}
            </p>
            <p>
              <strong>Check-out:</strong> {calculateCheckoutDate()}
            </p>
            <p>
              <strong>Total Nights:</strong> {bookingData.days_count}
            </p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-btn"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !bookingData.check_in}
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;