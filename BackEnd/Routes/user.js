const express = require("express");
const router = express.Router();
const usermodel = require("../Schemas/Users");
const Profilemodel = require("../Schemas/Profile");
const PersonalMessage = require("../Schemas/PersonalMessage");
const bcrypt = require("bcrypt");
const app = express();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
app.use(express.json());
require("dotenv").config();
const secretKey = process.env.JWT_SECRET;

// MIDDLE WARES
const PostuserSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
});

const generateToken = (data) => {
  const { _id } = data;
  const expiresIn = "7h";
  const payload = { _id };
  const token = jwt.sign(payload, secretKey, { expiresIn });
  return token;
};

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(200).json({ error: "Token is not provided" });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Failed to authenticate token" });
  }
};

router.post("/tokenvalidate", verifyToken, (req, res) => {
  res.status(200).json({ valid: true, user: req.decoded });
});

// *to get all of the users
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Find all profiles except the one with the given id
    const data = await Profilemodel.find({ _id: { $ne: id } });
    res.json(data);
  } catch (error) {
    console.error(
      "An error occurred with the GET method while getting the user data:",
      error
    );
    res.status(500).json({
      error:
        "Internal Server Error with the GET method while getting the user data",
    });
  }
});

// *to get one of the users
router.get("/myprofile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Profilemodel.findById(id);
    res.json(data);
  } catch (error) {
    console.error(
      "An error occurred with the GET method while getting the user data:",
      error
    );
    res.status(500).json({
      error:
        "Internal Server Error with the GET method while getting the user data",
    });
  }
});

// Fetch the profiles a user is following
router.get("/myfriends/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by id and populate the 'following' field
    const profile = await Profilemodel.findById(id)
      .populate({
        path: "following",
        select: "name profilePic",
      })
      .exec();

    res.json(profile.following);
  } catch (error) {
    console.error("Error fetching friends data:", error);
    res.status(500).json({ message: "Error fetching friends data" });
  }
});

const validateUserIds = (req, res, next) => {
  const { id } = req.params;
  const { userid } = req.body;

  if (!id || !userid) {
    return res
      .status(400)
      .json({ error: "Both user ID and follower ID are required" });
  }
  next();
};

router.post("/follow/:id", validateUserIds, async (req, res) => {
  const { id } = req.params;
  const { userid } = req.body;

  try {
    const followedUser = await Profilemodel.findById(id);
    const followingUser = await Profilemodel.findById(userid);

    if (!followedUser) {
      return res.status(404).json({ error: "User to follow not found" });
    }

    if (!followingUser) {
      return res.status(404).json({ error: "User following not found" });
    }

    if (followingUser.following.includes(id)) {
      return res
        .status(400)
        .json({ error: "User is already following this user" });
    }

    // Update the users using $push
    await Profilemodel.updateOne({ _id: userid }, { $push: { following: id } });

    await Profilemodel.updateOne({ _id: id }, { $push: { followers: userid } });
    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    console.error("Error while following the user:", error);
    res.status(500).json({
      error: "Internal Server Error while following the user",
    });
  }
});

router.post("/unfollow/:id", validateUserIds, async (req, res) => {
  const { id } = req.params; // ID of the user being unfollowed
  const { userid } = req.body; // ID of the user who is unfollowing

  try {
    // Check if the users exist
    const followedUser = await Profilemodel.findById(id);
    const followingUser = await Profilemodel.findById(userid);

    if (!followedUser) {
      return res.status(404).json({ error: "User to unfollow not found" });
    }

    if (!followingUser) {
      return res.status(404).json({ error: "User unfollowing not found" });
    }

    // Check if the following user is currently following the target user
    if (!followingUser.following.includes(id)) {
      return res.status(400).json({ error: "User is not following this user" });
    }

    // Update the users to remove the follow relationship
    await Profilemodel.updateOne({ _id: userid }, { $pull: { following: id } });

    await Profilemodel.updateOne({ _id: id }, { $pull: { followers: userid } });

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    console.error("Error while unfollowing the user:", error);
    res.status(500).json({
      error: "Internal Server Error while unfollowing the user",
    });
  }
});

//* to login authentication
router.post("/getone", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const userProfile = await Profilemodel.findOne({
      name: user.name,
    });

    const token = generateToken(userProfile);

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "User Logged in successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = PostuserSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      const userData = { ...req.body, password: hashedPassword };

      // Create user
      const user = await usermodel.create(userData);

      // Create user profile
      const userProfileData = {
        name: req.body.name,
        email: req.body.email,
        profilePic:
          "https://firebasestorage.googleapis.com/v0/b/cosmos-16de1.appspot.com/o/dp%2FScreenshot%202024-06-27%20011730.png?alt=media&token=46546fec-441e-4fe6-835a-5a39bda65c8a",
        user_id: user._id,
      };

      const userProfile = await Profilemodel.create(userProfileData);
      const token = generateToken(userProfile);
      console.log("token while creating an account :-  ", token);

      res.cookie("token", token, {
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({ message: "User created successfully" });
    }
  } catch (err) {
    console.log(
      "An error is caught with the POST method while posting the user data",
      err
    );
    res.status(500).json({
      error:
        "Internal Server Error with the POST method while posting the user data",
    });
  }
});
router.patch("/updateProfile/:id", async (req, res) => {
  const { id } = req.params;
  const { imageUrl, name } = req.body;

  try {
    // Find the old profile to get the current profilePic and name
    const oldProfile = await Profilemodel.findById(id);
    if (!oldProfile) {
      return res.status(404).send("User not found");
    }

    // Construct update object
    const updateData = {};
    if (imageUrl) updateData.profilePic = imageUrl;
    if (name) updateData.name = name;

    // Update profile picture and name in Profilemodel
    const updatedProfile = await Profilemodel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    // Update profile pictures and names in messages in Message model
    const messageUpdate = {};
    if (imageUrl) messageUpdate["messages.$[elem].profile_picture"] = imageUrl;
    if (name) messageUpdate["messages.$[elem].name"] = name;

    if (Object.keys(messageUpdate).length > 0) {
      await PersonalMessage.updateMany(
        { "messages.senderId": id },
        { $set: messageUpdate },
        { arrayFilters: [{ "elem.senderId": id }] }
      );
    }

    res.json(updatedProfile);
  } catch (err) {
    console.error("Error while updating profile picture or name:", err);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE ACCORDING ID
router.delete("/deleteMyAccount/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const profile = await Profilemodel.findById(userId);
    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    await Profilemodel.findByIdAndDelete(userId);
    await usermodel.findOneAndDelete({
      email: profile.email,
      _id: profile.user_id,
    });

    res.status(200).json({
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({
      message: "An error occurred while deleting the account",
    });
  }
});

module.exports = router;
