const Hotel = require("../models/Hotel");
const HotelRoom = require("../models/HotelRoom");
const Booking = require("../models/Booking");
const User = require("../models/User");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const token = process.env.SESSION_SECRET;

function getDatesBetween(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
    const stopDate = new Date(endDate);
    
    while (currentDate <= stopDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
}

const userController = {

    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Check if admin exists
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Compare passwords
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Successful login
            res.status(200).json({
                user: {
                    id: user._id,
                    username: user.username
                },
                token: token
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Login Error' });
        }
    },

    async register(req, res) {
        try {
            const { first_name, last_name, username, address, password, mobile } = req.body;

            // Check if admin already exists
            const existingUser = await User.findOne({ mobile });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new admin
            const user = new User({
                first_name,
                last_name,
                username,
                address,
                password: hashedPassword,
                mobile
            });

            await user.save();

            res.status(201).json({
                message: 'Registered successfully',
                user: {
                    id: user._id,
                    username: user.username
                },
                token: token
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Registration Error' });
        }
    },

    async getHotel(req, res) {
        try {
            const hotels = await Hotel.find().select('-__v'); // Exclude version key
            
            if (!hotels || hotels.length === 0) {
                return res.status(404).json({ message: 'No hotels found' });
            }

            // Map hotels to include full image URL if image exists
            const hotelsWithImageUrl = hotels.map(hotel => ({
                _id: hotel._id,
                hotel_name: hotel.hotel_name,
                hotel_address: hotel.hotel_address,
                hotel_owner: hotel.hotel_owner,
                hotel_image: hotel.hotel_image 
                    ? `${req.protocol}://${req.get('host')}/uploads/hotels/${hotel.hotel_image}`
                    : null,
                createdAt: hotel.createdAt,
                updatedAt: hotel.updatedAt
            }));

            res.status(200).json({
                message: 'Hotels retrieved successfully',
                count: hotels.length,
                hotels: hotelsWithImageUrl
            });
        } catch (error) {
            console.error('Get Hotels error:', error);
            res.status(500).json({ 
                message: 'Error retrieving hotels',
                error: error.message 
            });
        }
    },

    async getRooms(req, res) {
        try {
            const { hotelId } = req.params; // Get hotelId from URL params

            // Validate hotelId
            if (!mongoose.Types.ObjectId.isValid(hotelId)) {
                return res.status(400).json({ message: 'Invalid hotel ID' });
            }

            // Find all rooms for the specified hotel
            const rooms = await HotelRoom.find({ hotel: hotelId })
                .populate('hotel', 'hotel_name hotel_address hotel_image')
                .select('-__v')
                .lean();

            if (!rooms || rooms.length === 0) {
                return res.status(404).json({ 
                    message: 'No rooms found for this hotel',
                    hotelId: hotelId
                });
            }

            // Map rooms to include full image URLs and format dates
            const roomsWithDetails = rooms.map(room => ({
                _id: room._id,
                bed_count: room.bed_count,
                type: room.type,
                price: room.price,
                images: room.images.map(img => 
                    `${req.protocol}://${req.get('host')}/uploads/rooms/${img}`
                ),
                book_dates: room.book_dates || [], // Include booked dates
                createdAt: room.createdAt,
                updatedAt: room.updatedAt
            }));

            res.status(200).json({
                message: 'Rooms retrieved successfully',
                count: rooms.length,
                hotelId: hotelId,
                rooms: roomsWithDetails
            });
        } catch (error) {
            console.error('Get Rooms error:', error);
            res.status(500).json({ 
                message: 'Error retrieving rooms',
                error: error.message 
            });
        }
    },

    async roomBook(req, res) {
        try {
            const { userId, roomId, check_in, days_count } = req.body;

            // Validate input
            if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(roomId)) {
                return res.status(400).json({ message: 'Invalid user ID or room ID' });
            }

            if (!check_in || !days_count || days_count <= 0) {
                return res.status(400).json({ 
                    message: 'Check-in date and valid days count are required' 
                });
            }

            // Convert dates to Date objects
            const checkInDate = new Date(check_in);
            
            // Validate check-in date
            if (checkInDate < new Date()) {
                return res.status(400).json({ message: 'Check-in date cannot be in the past' });
            }

            // Calculate check-out date
            const checkOutDate = new Date(checkInDate);
            checkOutDate.setDate(checkOutDate.getDate() + parseInt(days_count));

            // Get room details including price
            const room = await HotelRoom.findById(roomId).select('price type book_dates');
            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }

            // Calculate total price
            const roomPrice = parseFloat(room.price);
            const totalPrice = roomPrice * parseInt(days_count);

            // Generate all booked dates for this reservation
            const bookedDates = [];
            const currentDate = new Date(checkInDate);
            
            while (currentDate < checkOutDate) {
                const dateStr = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                bookedDates.push(dateStr);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Check if any dates are already booked
            const isAlreadyBooked = bookedDates.some(date => room.book_dates.includes(date));
            if (isAlreadyBooked) {
                return res.status(409).json({ 
                    message: 'Room is already booked for some of the selected dates'
                });
            }

            // Create new booking
            const booking = new Booking({
                user: userId,
                room: roomId,
                check_in: checkInDate,
                check_out: checkOutDate,
                price: totalPrice,
                days_count: parseInt(days_count)
            });

            // Start transaction
            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                // Save booking
                await booking.save({ session });

                // Update room's book_dates
                await HotelRoom.findByIdAndUpdate(
                    roomId,
                    { $push: { book_dates: { $each: bookedDates } } },
                    { session }
                );

                // Commit transaction
                await session.commitTransaction();
                session.endSession();

                // Populate references for the response
                const populatedBooking = await Booking.findById(booking._id)
                    .populate('user', 'username')
                    .populate('room', 'type');

                res.status(201).json({
                    message: 'Room booked successfully',
                    booking: {
                        id: populatedBooking._id,
                        user: populatedBooking.user.username,
                        room: {
                            type: populatedBooking.room.type,
                            original_price_per_day: roomPrice,
                        },
                        check_in: populatedBooking.check_in,
                        check_out: populatedBooking.check_out,
                        days_count: populatedBooking.days_count,
                        total_price: populatedBooking.price,
                        booked_dates: bookedDates,
                        booking_date: populatedBooking.createdAt
                    }
                });

            } catch (error) {
                // If anything fails, abort transaction
                await session.abortTransaction();
                session.endSession();
                throw error;
            }

        } catch (error) {
            console.error('Booking error:', error);
            res.status(500).json({ 
                message: 'Error processing booking',
                error: error.message 
            });
        }
    },

    async cancelBook(req, res) {
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            const { bookingId } = req.params; // Destructure bookingId from req.params
            
            if (!mongoose.Types.ObjectId.isValid(bookingId)) {
                return res.status(400).json({ message: 'Invalid booking ID' });
            }

            const booking = await Booking.findById(bookingId).session(session);
            if (!booking) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: 'Booking not found' });
            }

            // Generate dates to remove
            const datesToRemove = [];
            const currentDate = new Date(booking.check_in);
            const endDate = new Date(booking.check_out);
            
            while (currentDate < endDate) {
                datesToRemove.push(currentDate.toISOString().split('T')[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Remove dates from room
            await HotelRoom.findByIdAndUpdate(
                booking.room,
                { $pull: { book_dates: { $in: datesToRemove } } },
                { session }
            );

            // Delete booking
            await Booking.deleteOne({ _id: bookingId }).session(session);

            await session.commitTransaction();
            session.endSession();

            res.status(200).json({
                message: 'Booking cancelled successfully',
                cancelledBooking: {
                    id: booking._id,
                    room: booking.room,
                    datesRemoved: datesToRemove
                }
            });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('Cancel booking error:', error);
            res.status(500).json({ 
                message: 'Error cancelling booking',
                error: error.message 
            });
        }
    },

    async getBookings(req, res) {
        try {
            const { userId } = req.params;

            const bookings = await Booking.find({ user: userId })
                .select('-__v')
                .populate({
                    path: 'user',
                    select: 'first_name last_name username mobile'
                })
                .populate({
                    path: 'room',
                    select: 'type bed_count price hotel',
                    populate: {
                        path: 'hotel',
                        select: 'hotel_name hotel_address'
                    }
                });

            const bookingsWithDetails = bookings
                .filter(booking => booking.user && booking.room && booking.room.hotel)
                .map(booking => ({
                    _id: booking._id,
                    user: booking.user,
                    room: {
                        ...booking.room._doc,
                        hotel: booking.room.hotel
                    },
                    check_in: booking.check_in,
                    check_out: booking.check_out,
                    price: booking.price,
                    days_count: booking.days_count,
                    booked_dates: getDatesBetween(booking.check_in, booking.check_out)
                }));

            res.status(200).json({
                message: 'Bookings retrieved successfully',
                count: bookingsWithDetails.length,
                bookings: bookingsWithDetails
            });
        } catch (error) {
            console.error('Get Bookings error:', error);
            res.status(500).json({ 
                message: 'Error retrieving bookings',
                error: error.message 
            });
        }
    }

}

module.exports = userController;