import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBed, FaMoneyBillWave, FaCalendarAlt, FaBook, FaChevronLeft, FaChevronRight, FaHotel } from 'react-icons/fa';
import { getUserRoomsByHotel } from '../../../services/userServices';
import { getUserData } from '../../../utils/auth';
import './RoomList.css';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.hotel) {
      setHotel(location.state.hotel);
    }

    const fetchRooms = async () => {
      try {
        const hotelId = location.pathname.split('/')[3];
        const response = await getUserRoomsByHotel(hotelId);
        setRooms(response.data.rooms || []);
        
        // Initialize image indexes for each room
        const indexes = {};
        response.data.rooms?.forEach(room => {
          indexes[room._id] = 0;
        });
        setCurrentImageIndex(indexes);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [location]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleBookNow = (roomId) => {
    const user = getUserData();
    const userId = user.id;
    navigate(`/user/rooms/${roomId}/book`, { 
      state: { 
        roomId,
        userId,
        hotelId: hotel?._id 
      } 
    });
  };

  const handleNextImage = (roomId, e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => {
      const room = rooms.find(r => r._id === roomId);
      const nextIndex = (prev[roomId] + 1) % room.images.length;
      return {...prev, [roomId]: nextIndex};
    });
  };

  const handlePrevImage = (roomId, e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => {
      const room = rooms.find(r => r._id === roomId);
      const prevIndex = (prev[roomId] - 1 + room.images.length) % room.images.length;
      return {...prev, [roomId]: prevIndex};
    });
  };

  if (loading) {
    return (
      <div className="room-list-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="room-list-container">
      {/* Hero Section with Hotel Image */}
      {hotel && (
        <div className="room-list-hero">
          <div 
            className="hero-image"
            style={{ backgroundImage: `url(${hotel.hotel_image})` }}
          >
            <div className="image-overlay"></div>
            <button className="back-button" onClick={handleBack}>
              X
            </button>
            <div className="hotel-name-container">
              <h1 className="hotel-name">
                <FaHotel className="icon" /> {hotel.hotel_name}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Rooms Section */}
      <main className="room-list-main">
        <h2 className="section-title">Available Rooms</h2>
        
        {rooms.length === 0 ? (
          <div className="no-rooms">
            <h3>No rooms available at this hotel</h3>
            <p>Please check back later or try another hotel</p>
          </div>
        ) : (
          <div className="rooms-horizontal">
            {rooms.map((room) => (
              <div key={room._id} className="room-card-horizontal">
                <div className="room-images-horizontal">
                  <div 
                    className="room-image-main"
                    style={{ backgroundImage: `url(${room.images[currentImageIndex[room._id] || 0]})` }}
                  >
                    {room.images.length > 1 && (
                      <>
                        <button 
                          className="image-nav-button prev-button"
                          onClick={(e) => handlePrevImage(room._id, e)}
                        >
                          <FaChevronLeft />
                        </button>
                        <button 
                          className="image-nav-button next-button"
                          onClick={(e) => handleNextImage(room._id, e)}
                        >
                          <FaChevronRight />
                        </button>
                        <div className="image-counter">
                          {currentImageIndex[room._id] + 1}/{room.images.length}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="room-details-horizontal">
                  <div className="room-info-horizontal">
                    <h3 className="room-type">
                      <FaBed className="icon" /> {room.type} Room
                    </h3>
                    <p className="room-price">
                      <FaMoneyBillWave className="icon" /> LKR {room.price}
                    </p>
                    <p className="room-beds">
                      <FaBed className="icon" /> {room.bed_count} {room.bed_count === "1" ? 'Bed' : 'Beds'}
                    </p>
                  </div>
                  
                  {room.book_dates && room.book_dates.length > 0 && (
                    <div className="booked-dates">
                      <h4>Booked Dates:</h4>
                      <div className="dates-list">
                        {room.book_dates.map((date, index) => (
                          <span key={index} className="date-badge">
                            <FaCalendarAlt className="icon" /> {date}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => handleBookNow(room._id)}
                    className="book-now-btn"
                  >
                    <FaBook className="icon" /> Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RoomList;