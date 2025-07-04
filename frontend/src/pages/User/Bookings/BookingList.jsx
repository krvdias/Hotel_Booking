import React, { useState, useEffect } from 'react';
import { FaHotel, FaBed, FaCalendarAlt, FaMoneyBillWave, FaUser, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import { getUserBooking, userCancelBooking } from '../../../services/userServices';
import { getUserData } from '../../../utils/auth';
import './BookingList.css';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = getUserData();
        if (!user?.id) {
          throw new Error('User not authenticated');
        }

        const response = await getUserBooking(user.id);
        setBookings(response.data.bookings || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await userCancelBooking(bookingId);
      // Remove the cancelled booking from state
      setBookings(prev => prev.filter(booking => booking._id !== bookingId));
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="booking-list-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-list-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="booking-list-container">
      <h1 className="booking-list-header">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You don't have any bookings yet.</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h2>
                  <FaHotel className="icon" /> {booking.room.hotel.hotel_name}
                </h2>
                <p className="hotel-address">
                  <FaMapMarkerAlt className="icon" /> {booking.room.hotel.hotel_address}
                </p>
              </div>
              
              <div className="booking-details">
                <div className="detail-row">
                  <p className="detail-label">
                    <FaBed className="icon" /> Room Type:
                  </p>
                  <p>{booking.room.type}</p>
                </div>
                
                <div className="detail-row">
                  <p className="detail-label">
                    <FaUser className="icon" /> Guest:
                  </p>
                  <p>{booking.user.first_name} {booking.user.last_name}</p>
                </div>
                
                <div className="detail-row">
                  <p className="detail-label">
                    <FaCalendarAlt className="icon" /> Dates:
                  </p>
                  <p>
                    {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                    ({booking.days_count} {booking.days_count === "1" ? 'night' : 'nights'})
                  </p>
                </div>
                
                <div className="detail-row">
                  <p className="detail-label">
                    <FaMoneyBillWave className="icon" /> Total Price:
                  </p>
                  <p>LKR {booking.price}</p>
                </div>
              </div>
              
              <div className="booked-dates">
                <h4>Booked Dates:</h4>
                <div className="dates-list">
                  {booking.booked_dates.map((date, index) => (
                    <span key={index} className="date-badge">
                      {formatDate(date)}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleCancelBooking(booking._id)}
                className="cancel-booking-btn"
                disabled={cancellingId === booking._id}
              >
                {cancellingId === booking._id ? 'Cancelling...' : (
                  <>
                    <FaTimes className="icon" /> Cancel Booking
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingList;