const express = require("express");
const router = express.Router();

const userController = require('../controllers/userController');


router.post('/login', userController.login);
router.post('/register', userController.register);

router.get('/hotel/get', userController.getHotel);
router.get('/rooms/:hotelId/get', userController.getRooms);

router.post('/room/book', userController.roomBook);
router.get('/booking/:userId/get', userController.getBookings);
router.post('/room/bookcancel/:bookingId', userController.cancelBook);

module.exports = router;