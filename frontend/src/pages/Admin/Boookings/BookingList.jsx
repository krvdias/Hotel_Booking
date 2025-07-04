import React, { useEffect, useState } from 'react';
import { getBookings } from '../../../services/adminService';
import { 
  FaUser,
  FaHotel,
  FaBed,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaCalendarTimes,
  FaExclamationTriangle
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './BookingList1.css';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getBookings();
        // Sort bookings by check_in date (newest first)
        const sortedBookings = response.data.bookings.sort((a, b) => 
          new Date(b.check_in) - new Date(a.check_in)
        );
        setBookings(sortedBookings);
      } catch (err) {
        setError('Failed to load bookings');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const isBookingExpired = (checkOutDate) => {
    return new Date(checkOutDate) < new Date();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <FaExclamationTriangle className="error-icon" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="booking-list-container">
      <h2>All Bookings</h2>
      
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => {
            const expired = isBookingExpired(booking.check_out);
            
            return (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`booking-card ${expired ? 'expired' : ''}`}
              >
                {expired && (
                  <div className="expired-badge">
                    <FaExclamationTriangle /> Expired
                  </div>
                )}
                
                <div className="booking-header">
                  <h3>
                    <FaUser /> {booking.user.first_name} {booking.user.last_name}
                  </h3>
                  <p className="mobile">{booking.user.mobile}</p>
                </div>
                
                <div className="booking-details">
                  <div className="detail-row-1">
                    <span><FaHotel /> Hotel:</span>
                    <span>{booking.room.hotel.hotel_name}, {booking.room.hotel.hotel_address}</span>
                  </div>
                  
                  <div className="detail-row-1">
                    <span><FaBed /> Room:</span>
                    <span>{booking.room.type} (Beds: {booking.room.bed_count})</span>
                  </div>
                  
                  <div className="detail-row-1">
                    <span><FaMoneyBillWave /> Price:</span>
                    <span>Rs. {booking.price} for {booking.days_count} days</span>
                  </div>
                  
                  <div className="date-row">
                    <div className="date-box">
                      <FaCalendarCheck />
                      <span>Check-in</span>
                      <strong>{formatDate(booking.check_in)}</strong>
                    </div>
                    
                    <div className="date-box">
                      <FaCalendarTimes />
                      <span>Check-out</span>
                      <strong>{formatDate(booking.check_out)}</strong>
                    </div>
                  </div>
                  
                  <div className="booked-dates">
                    <p>Booked Dates:</p>
                    <div className="date-chips">
                      {booking.booked_dates.map((date, i) => (
                        <span key={i} className="date-chip">
                          {formatDate(date)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingList;