const express = require('express');
const { chats } = require('./data/data');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./Config/db');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const { notfound, errorHandler } = require('./Middlewares/ErrorMiddleware');


const app = express();
connectDB();
dotenv.config();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Api running...');
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chat/message", messageRoutes);
app.use("/api/chat", chatRoutes);


app.use(notfound);
app.use(errorHandler);


const port = process.env.PORT || 3000;

const server = app.listen(port, () => console.log(`Server running on port ${port}`));

const io = require('socket.io')(server, {

  pingtimeout: 60000,
  cors: {
    origin:process.env.FRONTEND_URI,
  },
});

app.use(cors({ origin: process.env.FRONTEND_URI }));

io.on("connection", (socket) => {
  console.log("connected to socket io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("A user joined chat room" + room);
  })

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit(" stop typing"));



  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    })
  })

  socket.off("setup", () => {
    console.log("disconnected");
    socket.leave(userData._id);
  })
});



