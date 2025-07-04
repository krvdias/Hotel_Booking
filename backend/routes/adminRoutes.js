const express = require("express");
const router = express.Router();

const adminController = require('../controllers/adminController');


router.post('/adminlogin', adminController.adminlogin);
router.post('/adminregister', adminController.adminRegister);
router.get('/get', adminController.getAdmins);

router.get('/users/get', adminController.getUser);
router.put('/user/update/:userId', adminController.updateUser);
router.delete('/user/delete/:userId', adminController.deleteUser);

router.post('/hotel/add', adminController.addHotel);
router.get('/hotel/get', adminController.getHotel);
router.put('/hotel/update/:hotelId', adminController.updateHotel);
router.delete('/hotel/delete/:hotelId', adminController.deleteHotel);

router.post('/room/add', adminController.addRoom);
router.get('/rooms/:hotelId/get', adminController.getRooms);
router.put('/room/update/:roomId', adminController.updateRoom);
router.delete('/room/delete/:roomId', adminController.deleteRoom);

router.get('/bookings/get', adminController.getBooking);
router.post('/room/book', adminController.roomBook);
router.post('/room/bookcancel/:bookingId', adminController.cancelBook);

module.exports = router;
