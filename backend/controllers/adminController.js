const Admin = require("../models/Admin");
const Hotel = require("../models/Hotel");
const HotelRoom = require("../models/HotelRoom");
const Booking = require("../models/Booking");
const User = require("../models/User");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const token = process.env.SESSION_SECRET;


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/hotels'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Room images upload configuration
const roomStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/rooms'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const uploadRoomImages = multer({ 
  storage: roomStorage,
  limits: { files: 4 } // Limit to 4 files
}).array('images', 4); // 'room_images' is the field name

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

const adminController = {

    async adminlogin(req, res) {
        try {
            const { username, password } = req.body;

            // Check if admin exists
            const admin = await Admin.findOne({ username });
            if (!admin) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Compare passwords
            const isValidPassword = await bcrypt.compare(password, admin.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Successful login
            res.status(200).json({
                admin: {
                    name: admin.username,
                    id: admin._id,
                },
                token: token
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Login Error' });
        }
    },

    async adminRegister(req, res) {
        try {
            const { username, password, mobile } = req.body;

            // Check if admin already exists
            const existingAdmin = await Admin.findOne({ username });
            if (existingAdmin) {
                return res.status(400).json({ message: 'Admin already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new admin
            const admin = new Admin({
                username,
                password: hashedPassword,
                mobile
            });

            await admin.save();

            res.status(201).json({
                message: 'Admin registered successfully',
                admin: {
                    id: admin._id,
                    username: admin.username
                },
                token: token
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Registration Error' });
        }
    },

    async addHotel(req, res) {
        try {
            // Handle the file upload first
            upload.single('hotel_image')(req, res, async function(err) {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading
                    return res.status(400).json({ message: 'File upload error', error: err.message });
                } else if (err) {
                    // An unknown error occurred
                    return res.status(500).json({ message: 'Server error during file upload' });
                }

                // Proceed with hotel creation after successful upload
                const { hotel_name, hotel_address, hotel_owner } = req.body;
                const hotel_image = req.file ? req.file.filename : null;

                // Validate required fields
                if (!hotel_name || !hotel_address || !hotel_owner) {
                    return res.status(400).json({ message: 'All fields are required' });
                }

                // Check if hotel exists
                const existingHotel = await Hotel.findOne({ hotel_name });
                if (existingHotel) {
                    // If there was a file uploaded but hotel exists, delete it
                    if (req.file) {
                        const fs = require('fs');
                        fs.unlinkSync(req.file.path);
                    }
                    return res.status(400).json({ message: 'Hotel already exists' });
                }

                // Create new hotel
                const hotel = new Hotel({
                    hotel_name,
                    hotel_address,
                    hotel_owner,
                    hotel_image
                });

                await hotel.save();

                res.status(201).json({
                    message: 'Hotel added successfully',
                    hotel: {
                        id: hotel._id,
                        hotel_name: hotel.hotel_name,
                        hotel_address: hotel.hotel_address,
                        hotel_owner: hotel.hotel_owner
                    }
                });
            });
        } catch (error) {
            console.error('Add Hotel error:', error);
            // If there was a file uploaded but error occurred, delete it
            if (req.file) {
                const fs = require('fs');
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({ message: 'Error adding hotel' });
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

    async addRoom(req, res) {
        try {
            // Handle multiple file uploads
            uploadRoomImages(req, res, async (err) => {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ 
                        message: 'File upload error', 
                        error: err.message 
                    });
                } else if (err) {
                    return res.status(500).json({ 
                        message: 'Server error during file upload' 
                    });
                }

                const { bed_count, type, price, hotel } = req.body;
                
                // Validate required fields
                if (!bed_count || !type || !price || !hotel) {
                    // Clean up uploaded files if validation fails
                    if (req.files && req.files.length > 0) {
                        const fs = require('fs');
                        req.files.forEach(file => fs.unlinkSync(file.path));
                    }
                    return res.status(400).json({ 
                        message: 'All fields are required' 
                    });
                }

                // Check if hotel exists
                const hotelExists = await Hotel.findById(hotel);
                if (!hotelExists) {
                    // Clean up uploaded files if hotel doesn't exist
                    if (req.files && req.files.length > 0) {
                        const fs = require('fs');
                        req.files.forEach(file => fs.unlinkSync(file.path));
                    }
                    return res.status(404).json({ 
                        message: 'Hotel not found' 
                    });
                }

                // Get image filenames
                const images = req.files ? req.files.map(file => file.filename) : [];

                // Create new room
                const room = new HotelRoom({
                    bed_count,
                    type,
                    price,
                    images: images, // This will be an array of filenames
                    hotel
                });

                await room.save();

                res.status(201).json({
                    message: 'Room added successfully',
                    room: {
                        id: room._id,
                        bed_count: room.bed_count,
                        type: room.type,
                        price: room.price,
                        images: images.map(img => 
                            `${req.protocol}://${req.get('host')}/uploads/rooms/${img}`
                        ),
                        hotel: room.hotel
                    }
                });
            });
        } catch (error) {
            console.error('Add Room error:', error);
            // Clean up any uploaded files if error occurs
            if (req.files && req.files.length > 0) {
                const fs = require('fs');
                req.files.forEach(file => fs.unlinkSync(file.path));
            }
            res.status(500).json({ 
                message: 'Error adding room',
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

    async getAdmins(req, res) {
        try {
            const admins = await Admin.find().select('-__v');
            
            res.status(200).json({
                message: 'Admins retrieved successfully',
                count: admins.length,
                admins: admins
            });
        } catch (error) {
            console.error('Get Admins error:', error);
            res.status(500).json({ 
                message: 'Error retrieving admins',
                error: error.message 
            });
        }
    },

    async updateHotel(req, res) {
        try {
            const { hotelId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(hotelId)) {
                return res.status(400).json({ message: 'Invalid hotel ID' });
            }

            // Handle image upload if provided
            upload.single('hotel_image')(req, res, async function(err) {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ message: 'File upload error', error: err.message });
                } else if (err) {
                    return res.status(500).json({ message: 'Server error during file upload' });
                }

                const { hotel_name, hotel_address, hotel_owner } = req.body;

                const updates = {};
            if (hotel_name) updates.hotel_name = hotel_name;
            if (hotel_address) updates.hotel_address = hotel_address;
            if (hotel_owner) updates.hotel_owner = hotel_owner;

                if (req.file) {
                    updates.hotel_image = req.file.filename;
                }

                const updatedHotel = await Hotel.findByIdAndUpdate(
                    hotelId,
                    updates,
                    { new: true, runValidators: true }
                ).select('-__v');

                if (!updatedHotel) {
                    // Clean up uploaded file if hotel not found
                    if (req.file) {
                        const fs = require('fs');
                        fs.unlinkSync(req.file.path);
                    }
                    return res.status(404).json({ message: 'Hotel not found' });
                }

                res.status(200).json({
                    message: 'Hotel updated successfully',
                    hotel: updatedHotel
                });
            });
        } catch (error) {
            console.error('Update Hotel error:', error);
            // Clean up uploaded file if error occurs
            if (req.file) {
                const fs = require('fs');
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({ 
                message: 'Error updating hotel',
                error: error.message 
            });
        }
    },

    async deleteHotel(req, res) {
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            const { hotelId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(hotelId)) {
                return res.status(400).json({ message: 'Invalid hotel ID' });
            }

            // Find and delete the hotel
            const hotel = await Hotel.findByIdAndDelete(hotelId).session(session);
            if (!hotel) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: 'Hotel not found' });
            }

            // Delete all rooms associated with this hotel
            await HotelRoom.deleteMany({ hotel: hotelId }).session(session);

            // Delete all bookings for rooms in this hotel
            const roomIds = await HotelRoom.find({ hotel: hotelId }).distinct('_id');
            await Booking.deleteMany({ room: { $in: roomIds } }).session(session);

            await session.commitTransaction();
            session.endSession();

            // Delete hotel image if exists
            if (hotel.hotel_image) {
                const fs = require('fs');
                const imagePath = path.join(__dirname, '../uploads/hotels', hotel.hotel_image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            res.status(200).json({
                message: 'Hotel and all associated rooms and bookings deleted successfully'
            });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('Delete Hotel error:', error);
            res.status(500).json({ 
                message: 'Error deleting hotel',
                error: error.message 
            });
        }
    },

    async updateRoom(req, res) {
        try {
            const { roomId } = req.params;
            
            if (!mongoose.Types.ObjectId.isValid(roomId)) {
                return res.status(400).json({ message: 'Invalid room ID' });
            }

            // Handle image upload if provided
            uploadRoomImages(req, res, async (err) => {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ 
                        message: 'File upload error', 
                        error: err.message 
                    });
                } else if (err) {
                    return res.status(500).json({ 
                        message: 'Server error during file upload' 
                    });
                }

                const { bed_count, type, price } = req.body;

                const updates = {};
                if (bed_count) updates.bed_count = bed_count;
                if (type) updates.type = type;
                if (price) updates.price = price;

                if (req.files && req.files.length > 0) {
                    updates.images = req.files.map(file => file.filename);
                }

                const updatedRoom = await HotelRoom.findByIdAndUpdate(
                    roomId,
                    updates,
                    { new: true, runValidators: true }
                ).select('-__v');

                if (!updatedRoom) {
                    // Clean up uploaded files if room not found
                    if (req.files && req.files.length > 0) {
                        const fs = require('fs');
                        req.files.forEach(file => fs.unlinkSync(file.path));
                    }
                    return res.status(404).json({ message: 'Room not found' });
                }

                res.status(200).json({
                    message: 'Room updated successfully',
                    room: updatedRoom
                });
            });
        } catch (error) {
            console.error('Update Room error:', error);
            // Clean up uploaded files if error occurs
            if (req.files && req.files.length > 0) {
                const fs = require('fs');
                req.files.forEach(file => fs.unlinkSync(file.path));
            }
            res.status(500).json({ 
                message: 'Error updating room',
                error: error.message 
            });
        }
    },

    async deleteRoom(req, res) {
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            const { roomId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(roomId)) {
                return res.status(400).json({ message: 'Invalid room ID' });
            }

            // Find and delete the room
            const room = await HotelRoom.findByIdAndDelete(roomId).session(session);
            if (!room) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: 'Room not found' });
            }

            // Delete all bookings for this room
            await Booking.deleteMany({ room: roomId }).session(session);

            await session.commitTransaction();
            session.endSession();

            // Delete room images if exist
            if (room.images && room.images.length > 0) {
                const fs = require('fs');
                room.images.forEach(image => {
                    const imagePath = path.join(__dirname, '../uploads/rooms', image);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                });
            }

            res.status(200).json({
                message: 'Room and all associated bookings deleted successfully'
            });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('Delete Room error:', error);
            res.status(500).json({ 
                message: 'Error deleting room',
                error: error.message 
            });
        }
    },

    async getUser(req, res) {
        try {
            const users = await User.find().select('-__v');

            res.status(200).json({
                message: 'User retrive Successfully',
                count: users.length,
                users: users
            });
        } catch (error) {
            console.error('Get Users error:', error);
            res.status(500).json({ 
                message: 'Error retrieving users',
                error: error.message 
            });
        }
    },

    async updateUser(req, res) {
        try {
            const { userId } = req.params;
            const { first_name, last_name, username, address, mobile } = req.body;

            // Validate user ID
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'Invalid user ID' });
            }

            // Prepare updates
            const updates = {};
            if (first_name) updates.first_name = first_name;
            if (last_name) updates.last_name = last_name;
            if (username) updates.username = username;
            if (address) updates.address = address;
            if (mobile) updates.mobile = mobile;

            // Check if username is being updated to one that already exists
            if (username) {
                const existingUser = await User.findOne({ username });
                if (existingUser && existingUser._id.toString() !== userId) {
                    return res.status(400).json({ message: 'Username already exists' });
                }
            }

            // Update user
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                updates,
                { new: true, runValidators: true }
            ).select('-__v');

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({
                message: 'User updated successfully',
                user: updatedUser
            });

        } catch (error) {
            console.error('Update User error:', error);
            res.status(500).json({ 
                message: 'Error updating user',
                error: error.message 
            });
        }
    },

    async deleteUser(req, res) {
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            const { userId } = req.params;

            // Validate user ID
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'Invalid user ID' });
            }

            // Find and delete the user
            const user = await User.findByIdAndDelete(userId).session(session);
            if (!user) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: 'User not found' });
            }

            // Delete all bookings for this user
            await Booking.deleteMany({ user: userId }).session(session);

            await session.commitTransaction();
            session.endSession();

            res.status(200).json({
                message: 'User and all associated bookings deleted successfully'
            });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('Delete User error:', error);
            res.status(500).json({ 
                message: 'Error deleting user',
                error: error.message 
            });
        }
    },

    async getBooking(req, res) {
        try {
            const bookings = await Booking.find()
                .select('-__v')  // Fixed: should be -__v to exclude
                .populate({
                    path: 'user',
                    select: 'first_name last_name username mobile'  // Include specific user fields you need
                })
                .populate({
                    path: 'room',
                    select: 'type bed_count price hotel',  // Include specific room fields
                    populate: {
                        path: 'hotel',
                        select: 'hotel_name hotel_address'  // Include hotel details if needed
                    }
                });

            // Transform data to include booked dates range
            const bookingsWithDetails = bookings.map(booking => ({
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
                count: bookings.length,
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

module.exports = adminController;