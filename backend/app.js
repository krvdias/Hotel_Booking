require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const compression = require('compression');

// Configurations
const dbConfig = require('./config/db');
const sessionConfig = require('./config/session');
const corsConfig = require('./config/cors');

// Routes
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize Express app
const app = express();

// Database connection with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(dbConfig.uri, {
      ...dbConfig.options,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log('✅ Connected to MongoDB Atlas');
    
    // Initialize collections after connection
    await initializeCollections();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Collection initialization function
const initializeCollections = async () => {
  try {
    // Import models
    const HotelRoom = require('./models/HotelRoom');
    const Hotel = require('./models/Hotel');
    const Admin = require('./models/Admin');
    const Booking = require('./models/Booking');
    const User = require('./models/User');

    // Create collections if they don't exist
    await Promise.all([
      HotelRoom.createCollection(),
      Hotel.createCollection(),
      Admin.createCollection(),
      Booking.createCollection(),
      User.createCollection()
    ]);

    console.log('✅ All collections initialized');
  } catch (err) {
    console.error('❌ Collection initialization error:', err);
  }
};

// Start database connection
connectWithRetry();

// Middlewares
app.use(helmet());
app.use(morgan('combined'));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// CORS configuration
app.use(cors());
app.use(cors(corsConfig));

// Session configuration
app.use(session(sessionConfig));

// Serve static files from different upload directories
app.use('/uploads/hotels', express.static(path.join(__dirname, 'uploads/hotels'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', '*');
    res.set('Access-Control-Allow-Headers', '*');
    res.set('Access-Control-Expose-Headers', '*');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Private-Network', 'true');
  }
}));
app.use('/uploads/rooms', express.static(path.join(__dirname, 'uploads/rooms'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', '*');
    res.set('Access-Control-Allow-Headers', '*');
    res.set('Access-Control-Expose-Headers', '*');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Private-Network', 'true');
  }
}));

// Create the upload directories if they don't exist
const fs = require('fs');
const uploadDirs = ['uploads/hotels', 'uploads/rooms'];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// API routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

module.exports = app;