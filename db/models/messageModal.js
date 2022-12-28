const mongoose = require("mongoose");

const messageModal = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
    },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timeStamps: true,
  }
);

const Message = mongoose.model("Message", messageModal);

module.exports = Message;
