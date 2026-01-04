const app = require("./app");
const connectdb = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const { addUser, removeUser } = require("./socketStrore");

const { WebSocketServer } = require("ws");
const {
  setupWSConnection,
} = require("y-websocket/bin/utils");
const logger = require("./utils/logger");


const yjsServer = http.createServer();
const yjsWss = new WebSocketServer({ server: yjsServer });

yjsWss.on('connection', (conn, req) => {
  logger.info(' Yjs WebSocket connected');
  setupWSConnection(conn, req);
});

const startsever = async () => {
  try {
    await connectdb();
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
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

    const PORT = process.env.PORT || 5000;
    const PORT_YJS = 5001;


  

    server.listen(PORT, () => {
      logger.info(`server running ${PORT}`);
    });

    yjsServer.listen(PORT_YJS, () => {
      logger.info(` Yjs WebSocket running on ws://localhost:${PORT_YJS}`);
    });
  } catch (error) {
    logger.error(error);
  }
};
startsever();
