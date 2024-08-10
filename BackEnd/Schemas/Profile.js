const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
