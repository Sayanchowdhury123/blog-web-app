const app = require("./app")
const connectdb = require("./config/db")
const http = require("http")
const {Server} = require("socket.io")

const server = http.createServer(app)


connectdb()

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], 
    methods: ["GET", "POST"]
  }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
   
  });

 
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    [...onlineUsers.entries()].forEach(([key, value]) => {
      if (value === socket.id) onlineUsers.delete(key);
    });
  });
});



const PORT = process.env.PORT ;


server.listen(PORT, () => {
  console.log(`server running ${PORT}`);
});

module.exports = io;