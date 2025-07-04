import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import './ContactUs.css';

const ContactUs = () => {
  return (
    <div className="contact-us-container">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="hero-overlay"></div>
        <img 
          src="/assets/contact-hero.jpg" 
          alt="Luxury hotel" 
          className="hero-image"
        />
        <div className="hero-content">
          <h1>Get In Touch</h1>
          <p>We're here to help you with your travel needs</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="contact-main">
        <div className="contact-info">
          <h2>Contact Information</h2>
          
          <div className="info-card">
            <FaMapMarkerAlt className="info-icon" />
            <div>
              <h3>Address</h3>
              <p>123 Hotel Street, Colombo 01, Sri Lanka</p>
            </div>
          </div>
          
          <div className="info-card">
            <FaPhone className="info-icon" />
            <div>
              <h3>Phone</h3>
              <p>+94 11 234 5678</p>
              <p>+94 77 123 4567 (24/7 Support)</p>
            </div>
          </div>
          
          <div className="info-card">
            <FaEnvelope className="info-icon" />
            <div>
              <h3>Email</h3>
              <p>info@hotelbooking.com</p>
              <p>support@hotelbooking.com</p>
            </div>
          </div>
          
          <div className="info-card">
            <FaClock className="info-icon" />
            <div>
              <h3>Working Hours</h3>
              <p>Monday - Friday: 8:30 AM - 6:00 PM</p>
              <p>Saturday: 9:00 AM - 3:00 PM</p>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" placeholder="Booking Inquiry" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="5" placeholder="Your message here..."></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;