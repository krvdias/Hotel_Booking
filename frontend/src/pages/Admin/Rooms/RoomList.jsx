import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoomsByHotel, deleteRoom } from '../../../services/adminService';
import {  
  FaBed, 
  FaCalendarAlt,
  FaMoneyBillWave,
  FaStar,
  FaWifi,
  FaTv,
  FaSnowflake,
  FaSwimmingPool,
  FaCoffee,
  FaImage
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './RoomList.css';

const RoomList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await getRoomsByHotel(id);
        setRooms(response.data.rooms || []);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = async (roomId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this room?');
    if (!confirmDelete) return;

    try {
      await deleteRoom(roomId);
      setRooms(rooms.filter(room => room._id !== roomId));
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const getAmenityIcon = (amenity) => {
    switch(amenity.toLowerCase()) {
      case 'wifi': return <FaWifi />;
      case 'tv': return <FaTv />;
      case 'ac': return <FaSnowflake />;
      case 'pool': return <FaSwimmingPool />;
      case 'breakfast': return <FaCoffee />;
      default: return <FaStar />;
    }
  };

  if (loading) {
    return (
      <div className="rooms-loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="spinner"
        />
      </div>
    );
  }

  return (
    <div className="rooms-preview-container">
      <div className="rooms-header">
        <h2>Available Rooms</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="add-room-button"
          onClick={() => navigate(`/admin/hotels/${id}/rooms/add`)}
        >
          Add New Room
        </motion.button>
      </div>

      {rooms.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="no-rooms"
        >
          <p>No rooms available for this hotel.</p>
        </motion.div>
      ) : (
        <div className="rooms-grid">
          {rooms.map((room, index) => (
            <motion.div
              key={room._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="room-card"
            >
              <div className="room-images-container">
                {room.images && room.images.length > 0 ? (
                  <div className="room-images-grid">
                    {room.images.slice(0, 4).map((image, idx) => (
                      <div key={idx} className="room-image-wrapper">
                        <img 
                          src={image} 
                          alt={`Room ${index + 1}`} 
                          className="room-image"
                          onError={(e) => {
                            e.target.src = '/placeholder-room.jpg';
                            e.target.alt = 'Room placeholder';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-images-placeholder">
                    <FaImage size={40} />
                    <span>No images available</span>
                  </div>
                )}
                <div className="room-rating">
                  <FaStar className="star-icon" />
                  <span>4.8</span>
                </div>
              </div>
              
              <div className="room-details">
                <h3>{room.type || 'Standard Room'}</h3>
                <div className="room-features">
                  <span><FaBed /> {room.bed_count || '1'} Beds</span>
                  <span><FaMoneyBillWave /> Rs.{room.price || '0'}/night</span>
                </div>
                
                <div className="amenities-grid">
                  {['Wifi', 'TV', 'AC', 'Breakfast'].map((amenity, i) => (
                    <div key={i} className="amenity-item">
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
                
                {room.book_dates && room.book_dates.length > 0 && (
                  <div className="booked-dates">
                    <h4><FaCalendarAlt /> Booked Dates:</h4>
                    <div className="date-chips">
                      {room.book_dates.map((date, i) => (
                        <motion.span 
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          className="date-chip"
                        >
                          {formatDate(date)}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="room-actions">
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="edit-button"
                    onClick={() => navigate(`/admin/hotels/rooms/edit/${room._id}`, { 
                      state: { 
                        roomData: room,
                        hotelId: id
                      } 
                    })}
                  >
                    Edit Room
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="delete-button"
                    onClick={() => handleDelete(room._id)}
                  >
                    Delete Room
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomList;