import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaHotel, FaMapMarkerAlt, FaStar, FaEye } from 'react-icons/fa';
import { getUserHotels } from '../../../services/userServices';
import './HotelList.css';
import { isAuthenticated } from '../../../utils/auth';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await getUserHotels();
        setHotels(response.data.hotels || []);
        setFilteredHotels(response.data.hotels || []);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    const results = hotels.filter(hotel => 
      hotel.hotel_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.hotel_address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHotels(results);
  }, [searchTerm, hotels]);

  const handleViewDetails = (hotel) => {
    if (!isAuthenticated()) {  // Make sure to call the function with parentheses
      navigate('/login');
      return;  // Important: return early to prevent further execution
    }
    navigate(`/user/rooms/${hotel._id}`, { state: { hotel } });
  };

  if (loading) {
    return (
      <div className="hotel-list-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="hotel-list-container">
      {/* Hero Section */}
      <div className="hotel-list-hero">
        <div className="hero-overlay"></div>
        <img 
          src="/assets/Main.jpg" 
          alt="Luxury hotel" 
          className="hero-image"
        />
        <div className="hero-content">
          <h1>Discover Amazing Hotels</h1>
          <p>Find your perfect stay with luxury amenities</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="hotel-list-main">
        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by hotel name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {filteredHotels.length === 0 ? (
          <div className="no-hotels">
            <h3>{searchTerm ? 'No matching hotels found' : 'No hotels available'}</h3>
            <p>{searchTerm ? 'Try a different search term' : 'Please check back later'}</p>
          </div>
        ) : (
          <div className="hotel-cards-container">
            <div className="hotel-cards-grid">
              {filteredHotels.map((hotel) => (
                <div key={hotel._id} className="hotel-card">
                  <div 
                    className="hotel-image-container"
                    style={{ backgroundImage: `url(${hotel.hotel_image})` }}
                  >
                    <div className="image-overlay"></div>
                    <div className="hotel-rating">
                      <FaStar className="star-icon" />
                      <span>4.5</span>
                    </div>
                    <h3 className="hotel-name">
                      <FaHotel className="icon" /> {hotel.hotel_name}
                    </h3>
                  </div>
                  <div className="hotel-details">
                    <p className="hotel-address">
                      <FaMapMarkerAlt className="icon" /> {hotel.hotel_address}
                    </p>
                    <button 
                      onClick={() => handleViewDetails(hotel)}
                      className="view-details-btn"
                    >
                      <FaEye className="btn-icon" /> View Rooms
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HotelList;