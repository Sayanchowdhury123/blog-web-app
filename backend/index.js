const app = require("./app");
const connectdb = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const { addUser, removeUser } = require("./socketStrore");
const server = http.createServer(app);

connectdb();

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("sendNotification", async (data) => {
    const { user, message, link, read, senderid } = data;
   
    const receiverSocket = onlineUsers.get(user);
    
    if (receiverSocket) {
      io.to(receiverSocket).emit("newNotification", {
        message,
        link,
        senderid,
        read,
        createdAt: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) onlineUsers.delete(userId);
    }
  });
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`server running ${PORT}`);
});
