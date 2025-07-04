// src/pages/Home/HomePage.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import { getUserHotels } from '../../services/userServices';
import './HomePage.css';

const HomePage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await getUserHotels();
        setHotels(response.data.hotels || []);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      
      {/* Hero Section with Main Image */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Your Perfect Stay</h1>
          <p>Luxury accommodations at unbeatable prices</p>
        </div>
        <div className="hero-overlay"></div>
        <img 
          src="/assets/main.jpg" 
          alt="Luxury hotel" 
          className="hero-image"
        />
      </section>

      {/* Hotels Section */}
      <main className="hotels-main">
        <div className="section-header">
          <h2>Featured Hotels</h2>
          <p>Explore our top-rated accommodations</p>
        </div>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : hotels.length === 0 ? (
          <p className="no-hotels">No hotels available at the moment.</p>
        ) : (
          <div className="hotels-grid">
            {hotels.map((hotel) => (
              <div key={hotel._id} className="hotel-card">
                <div 
                  className="hotel-image-container"
                  style={{ backgroundImage: `url(${hotel.hotel_image})` }}
                >
                  <div className="hotel-overlay"></div>
                  <h3 className="hotel-name">{hotel.hotel_name}</h3>
                </div>
                <div className="hotel-details">
                  <p className="hotel-address">
                    <i className="fas fa-map-marker-alt"></i> {hotel.hotel_address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} HotelBooking. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;