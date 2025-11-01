const app = require("./app")
const connectdb = require("./config/db")
const http = require("http")
const {Server} = require("socket.io")
const {addUser,removeUser} = require("./socketStrore") 
const server = http.createServer(app)


connectdb()

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], 
    methods: ["GET", "POST"]
  }
});



io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  
  socket.on("addUser", (userId) => {
    addUser(userId,socket.id)
  });

 
  socket.on("disconnect", () => {
    removeUser(socket.id)
  })
});


module.exports = {io};

const PORT = process.env.PORT ;


server.listen(PORT, () => {
  console.log(`server running ${PORT}`);
});




