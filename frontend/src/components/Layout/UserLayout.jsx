import { Outlet } from 'react-router-dom';
import './UserLayout.css';
import Navbar from '../common/Navbar';

const UserLayout = () => {


  return (
    <div className="user-layout">
        <Navbar />

      <main>
        <Outlet />
      </main>

      <footer className="user-footer">
        <p>© 2023 HotelBooking. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserLayout;