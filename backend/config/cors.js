require('dotenv').config();

module.exports = {
  origin: process.env.CORS_ORIGIN || '*',
  allowedHeaders: '*',
  exposedHeaders: '*',
  credentials: true,
};