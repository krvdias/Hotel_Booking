import API from './api';

export const userLogin = (data) => API.post('/user/login', data);
export const userRegister = (data) => API.post('/user/register', data);

// Hotel Services
export const getUserHotels = () => API.get('/user/hotel/get');

// Room Services
export const getUserRoomsByHotel = (hotelId) => API.get(`/user/rooms/${hotelId}/get`);

// Booking Services
export const getUserBooking = (userId) => API.get(`/user/booking/${userId}/get`);
export const userBookRoom = (data) => API.post('/user/room/book', data);
export const userCancelBooking = (id) => API.post(`/user/room/bookcancel/${id}`);