const mongoose = require("mongoose");
require('dotenv').config();
const URI = process.env.URI;

const connectDB = async () => {
  try {
    if (!URI) {
      throw new Error("MongoDB URI is missing. Please check your .env file.");
    }

    await mongoose.connect(URI);
    console.log("Database connected successfully");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;