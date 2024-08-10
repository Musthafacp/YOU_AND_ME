const express = require("express");
const PersonalMessage = require("../Schemas/PersonalMessage");
const router = express.Router();

router.get(
  "/personalMessages/:otherUserId/:currentUserId",
  async (req, res) => {
    const { otherUserId, currentUserId } = req.params;
    const room = [currentUserId, otherUserId].sort().join("_");
    try {
      const personalMessages = await PersonalMessage.findOne({ room });
      res.json(personalMessages ? personalMessages.messages : []);
    } catch (error) {
      console.error("Error fetching personal messages:", error);
      res.status(500).send("Error fetching personal messages");
    }
  }
);

module.exports = router;
