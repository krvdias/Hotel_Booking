import React, { useState, useEffect } from 'react';
import { FaUsers, FaHotel, FaBed, FaChartLine, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    hotels: 0,
    bookings: 0,
    revenue: 0,
    availableRooms: 0,
    occupancyRate: 0
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // In a real app, you would make actual API calls here
        // Example:
        // const statsResponse = await getDashboardStats();
        // const bookingsResponse = await getRecentBookings();
        
        // Mock data for demonstration
        setTimeout(() => {
          setStats({
            users: 1243,
            hotels: 87,
            bookings: 356,
            revenue: 125640,
            availableRooms: 423,
            occupancyRate: 72
          });
          
          setRecentBookings([
            { id: 1, hotel: 'Grand Plaza', user: 'John Doe', checkIn: '2023-06-15', checkOut: '2023-06-20', amount: 450 },
            { id: 2, hotel: 'Beach Resort', user: 'Alice Smith', checkIn: '2023-06-18', checkOut: '2023-06-25', amount: 780 },
            { id: 3, hotel: 'Mountain View', user: 'Bob Johnson', checkIn: '2023-06-20', checkOut: '2023-06-22', amount: 320 },
            { id: 4, hotel: 'City Central', user: 'Emma Wilson', checkIn: '2023-06-22', checkOut: '2023-06-27', amount: 600 },
            { id: 5, hotel: 'Lakeside Inn', user: 'Michael Brown', checkIn: '2023-06-25', checkOut: '2023-06-30', amount: 550 }
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      
      <div className="stats-grid">
        {/* Users Card */}
        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>Users</h3>
            <p>{stats.users.toLocaleString()}</p>
            <span className="stat-trend positive">+12% from last month</span>
          </div>
        </div>
        
        {/* Hotels Card */}
        <div className="stat-card">
          <div className="stat-icon hotels">
            <FaHotel />
          </div>
          <div className="stat-info">
            <h3>Hotels</h3>
            <p>{stats.hotels.toLocaleString()}</p>
            <span className="stat-trend positive">+5% from last month</span>
          </div>
        </div>
        
        {/* Bookings Card */}
        <div className="stat-card">
          <div className="stat-icon bookings">
            <FaCalendarAlt />
          </div>
          <div className="stat-info">
            <h3>Bookings</h3>
            <p>{stats.bookings.toLocaleString()}</p>
            <span className="stat-trend positive">+18% from last month</span>
          </div>
        </div>
        
        {/* Revenue Card */}
        <div className="stat-card">
          <div className="stat-icon revenue">
            <FaMoneyBillWave />
          </div>
          <div className="stat-info">
            <h3>Revenue</h3>
            <p>${stats.revenue.toLocaleString()}</p>
            <span className="stat-trend positive">+22% from last month</span>
          </div>
        </div>
        
        {/* Available Rooms Card */}
        <div className="stat-card">
          <div className="stat-icon rooms">
            <FaBed />
          </div>
          <div className="stat-info">
            <h3>Available Rooms</h3>
            <p>{stats.availableRooms.toLocaleString()}</p>
            <span className="stat-trend negative">-8% from last month</span>
          </div>
        </div>
        
        {/* Occupancy Rate Card */}
        <div className="stat-card">
          <div className="stat-icon occupancy">
            <FaChartLine />
          </div>
          <div className="stat-info">
            <h3>Occupancy Rate</h3>
            <p>{stats.occupancyRate}%</p>
            <span className="stat-trend positive">+3% from last month</span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        {/* Recent Bookings Section */}
        <div className="recent-bookings">
          <h2>Recent Bookings</h2>
          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Hotel</th>
                  <th>User</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.hotel}</td>
                    <td>{booking.user}</td>
                    <td>{booking.checkIn}</td>
                    <td>{booking.checkOut}</td>
                    <td>${booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Quick Stats Section */}
        <div className="quick-stats">
          <h2>Quick Stats</h2>
          <div className="stats-chart">
            {/* Placeholder for chart - in a real app you would use a charting library */}
            <div className="chart-placeholder">
              <p>Revenue Overview (Last 6 Months)</p>
              <div className="chart-bars">
                {[60, 80, 120, 150, 180, 220].map((height, index) => (
                  <div 
                    key={index} 
                    className="chart-bar" 
                    style={{ height: `${height}px` }}
                  ></div>
                ))}
              </div>
              <div className="chart-labels">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;