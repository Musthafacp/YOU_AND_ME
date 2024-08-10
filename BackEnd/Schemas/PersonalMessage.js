// Schemas/PersonalMessage.js

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Profile",
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Profile",
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const personalMessageSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  messages: [messageSchema],
});

module.exports = mongoose.model("PersonalMessage", personalMessageSchema);
