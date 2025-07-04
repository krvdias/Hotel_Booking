import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import AboutUs from './pages/Home/AboutUs';
import ContactUs from './pages/Home/ContactUs';
import AdminLayout from './components/Layout/AdminLayout';
import UserLayout from './components/Layout/UserLayout';
import AdminLogin from './pages/Auth/AdminLogin';
import AdminRegister from './pages/Auth/AdminRegister';
import UserLogin from './pages/Auth/UserLogin';
import UserRegister from './pages/Auth/UserRegister';
import AdminProtectedRoute from './components/Auth/AdminProtectedRoute';

import AdminDashboard from './pages/Admin/Dashboard';
import HotelList from './pages/Admin/Hotels/HotelList';
import AddHotel from './pages/Admin/Hotels/AddHotel';
import EditHotel from './pages/Admin/Hotels/EditHotel';
import RoomList from './pages/Admin/Rooms/RoomList';
import AddRoom from './pages/Admin/Rooms/AddRoom';
import EditRoom from './pages/Admin/Rooms/EditRoom';
import BookingList from './pages/Admin/Boookings/BookingList';
import UserList from './pages/Admin/Users/UserList';
import EditUser from './pages/Admin/Users/EditUser';
import AddBook from './pages/User/Bookings/AddBook';

import UserHotelList from './pages/User/Hotels/HotelList';
import UserRoomList from './pages/User/Rooms/RoomList';
import UserBookingList from './pages/User/Bookings/BookingList';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Protected User Routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<HomePage />} />
            <Route path="hotels" element={<UserHotelList />} />
            <Route path="rooms/:hotelId" element={<UserRoomList />} />
            <Route path="rooms/:roomId/book" element={<AddBook />} />
            <Route path="bookings" element={<UserBookingList />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<ContactUs />} />
          </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="hotels" element={<HotelList />} />
            <Route path="hotels/add" element={<AddHotel />} />
            <Route path="hotels/edit/:id" element={<EditHotel />} />
            <Route path="hotels/:id/rooms" element={<RoomList />} />
            <Route path="hotels/:id/rooms/add" element={<AddRoom />} />
            <Route path="hotels/rooms/edit/:id" element={<EditRoom />} />
            <Route path="bookings" element={<BookingList />} />
            <Route path="users" element={<UserList />} />
            <Route path="users/edit/:id" element={<EditUser />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
