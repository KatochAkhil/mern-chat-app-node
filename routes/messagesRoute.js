const express = require("express");
const Chat = require("../db/models/chatmodal");
const User = require("../db/models/usermodal");
const Message = require("../db/models/messageModal");

const { protect } = require("../moddleware/authmiddleware");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { content, chatId } = req.body;
  console.log(content, chatId)
  if (!content || !chatId) {
    console.log("Invalid data ");
    res.status(400).send("Invalid data");
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name picture");
    message = await message.populate("chat")
    message = await User.populate(message, {
      path: "chat.users",
      select: "name picture email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:chatId", protect, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name picture email")
      .populate("chat");

     

    res.json(messages);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
