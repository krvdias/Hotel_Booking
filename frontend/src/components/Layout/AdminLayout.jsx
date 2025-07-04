import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { removeAuthToken, removeUserData } from '../../utils/auth';
import './Layout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => {
    removeAuthToken();
    removeUserData();
    navigate('/admin/login');
  };

  return (
    <div className="layout-container">
      {/* Header */}
      <header className="header">
        <button className="menu-button" onClick={toggleSidebar}>
          {sidebarOpen ? '◀' : '☰'}
        </button>
        <h2>Admin Dashboard</h2>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <nav>
          <ul className="nav-list">
            <li>
              <Link to="/admin" className="nav-link">
                <span className="nav-icon">📊</span>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/hotels" className="nav-link">
                <span className="nav-icon">🏨</span>
                <span>Hotels</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/bookings" className="nav-link">
                <span className="nav-icon">📅</span>
                <span>Bookings</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="nav-link">
                <span className="nav-icon">👥</span>
                <span>Users</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="logout-section">
          <button onClick={handleLogout} className="logout-button">
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;