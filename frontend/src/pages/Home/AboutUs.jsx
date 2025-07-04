import React from 'react';
import { FaHotel, FaUsers, FaAward, FaGlobe } from 'react-icons/fa';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="hero-overlay"></div>
        <img 
          src="/assets/about-hero.jpg" 
          alt="Luxury hotel" 
          className="hero-image"
        />
        <div className="hero-content">
          <h1>Our Story</h1>
          <p>Discover the journey behind HotelBooking</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="about-main">
        <section className="about-section">
          <h2>Who We Are</h2>
          <p>
            HotelBooking is a premier online platform dedicated to providing seamless hotel booking experiences. 
            Founded in 2015, we've grown from a small startup to a trusted name in the travel industry, 
            connecting millions of travelers with their perfect accommodations worldwide.
          </p>
        </section>

        <section className="features-section">
          <div className="feature-card">
            <FaHotel className="feature-icon" />
            <h3>10,000+ Hotels</h3>
            <p>Extensive collection of properties worldwide</p>
          </div>
          <div className="feature-card">
            <FaUsers className="feature-icon" />
            <h3>5 Million Users</h3>
            <p>Trusted by travelers globally</p>
          </div>
          <div className="feature-card">
            <FaAward className="feature-icon" />
            <h3>Award Winning</h3>
            <p>Recognized for excellence in service</p>
          </div>
          <div className="feature-card">
            <FaGlobe className="feature-icon" />
            <h3>Global Presence</h3>
            <p>Available in 50+ countries</p>
          </div>
        </section>

        <section className="mission-section">
          <h2>Our Mission</h2>
          <p>
            To simplify travel by providing innovative booking solutions, exceptional customer service, 
            and the best rates for accommodations worldwide. We believe every journey should start with 
            the perfect stay.
          </p>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;