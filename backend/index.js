const app = require("./app");
const connectdb = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const { addUser, removeUser } = require("./socketStrore");
const logger = require("./utils/logger");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },

});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  logger.info("Socket connected", { socketId: socket.id });

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



const startsever = async () => {
  try {
    await connectdb();

    const PORT = process.env.PORT || 5000;
   

    server.listen(PORT, () => {
      logger.info(`server running ${PORT}`);
    
    });


  } catch (error) {
    logger.error(error);

  }
};
startsever();
