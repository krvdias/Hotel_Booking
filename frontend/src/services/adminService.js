import API from './api';

export const adminLogin = (data) => API.post('/admin/adminlogin', data);
export const adminRegister = (data) => API.post('/admin/adminregister', data);
export const getAdmins = () => API.get('/admin/get');

// Hotel Services
export const addHotel = (data) => API.post('/admin/hotel/add', data);
export const getHotels = () => API.get('/admin/hotel/get');
export const updateHotel = (id, data) => API.put(`/admin/hotel/update/${id}`, data);
export const deleteHotel = (id) => API.delete(`/admin/hotel/delete/${id}`);

// Room Services
export const addRoom = (data) => API.post('/admin/room/add', data);
export const getRoomsByHotel = (hotelId) => API.get(`/admin/rooms/${hotelId}/get`);
export const updateRoom = (id, data) => API.put(`/admin/room/update/${id}`, data);
export const deleteRoom = (id) => API.delete(`/admin/room/delete/${id}`);

// Booking Services
export const getBookings = () => API.get('/admin/bookings/get');
export const bookRoom = (data) => API.post('/admin/room/book', data);
export const cancelBooking = (id) => API.post(`/admin/room/bookcancel/${id}`);

// User Services
export const getUsers = () => API.get('/admin/users/get');
export const updateUser = (id, data) => API.put(`/admin/user/update/${id}`, data);
export const deleteUser = (id) => API.delete(`/admin/user/delete/${id}`);