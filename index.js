const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./db/config/db");
const userRoute = require("./routes/UserRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messagesRoute");
const path = require("path");
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// ---------------Deployment-----------------//

const __dirname1 = path.resolve();

if ((process.env.NODE_ENV = "production")) {
  app.use(express.static(path.join(__dirname1, "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json("Api is Working");
  });
}
// ---------------Deployment-----------------//





const server = app.listen(process.env.PORT, (req, res) => {
  console.log(`Server is running on port no ${process.env.PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeOut: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room :" + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop Typing", (room) => {
    socket.in(room).emit("stop Typing");
  });

  socket.on("new message", (newMessageRecived) => {
    let chat = newMessageRecived.chat;
    if (!chat.users) {
      return console.log("chat users not defined");
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageRecived.sender._id) {
        return;
      }
      socket.in(user._id).emit("message recived", newMessageRecived);
    });
  });

  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});
