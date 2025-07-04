// src/components/Navbar/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated as checkAuth, removeAuthToken, removeUserData } from '../../utils/auth';
import './Navbar.css';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedin(checkAuth());
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    removeUserData();
    setIsLoggedin(false);
    navigate('/');
  };

  return (
    <header className="navbar">
      <nav className="nav-container">
        <Link to="/" className="nav-logo">HotelBooking</Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/user/hotels">Hotels</Link>
          {isLoggedin && (
            <>
              <Link to="/user/bookings">Bookings</Link>
            </>
          )}
          <Link to="/user/about">About Us</Link>
          <Link to="/user/contact">Contact Us</Link>

          {isLoggedin ? (
            <button onClick={handleLogout} className="logout-btn">Sign Out</button>
          ) : (
            <>
              <Link to="/login" className="login-btn">Sign In</Link>
              <Link to="/register" className="nav-btn register-btn">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
