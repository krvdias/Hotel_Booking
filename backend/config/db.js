require('dotenv').config();

module.exports = {
  uri: process.env.DATABASE_URL,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
};