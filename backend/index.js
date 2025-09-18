const app = require("./app")
const connectdb = require("./config/db")
const {Server} = require("socket.io")
const http = require("http")


connectdb()

const server = http.createServer(app)
const jwt = require("jsonwebtoken")
const io = new Server(server,{
  cors: {origin: "*"}
})



const rooms = {};
const Y = require("yjs")
const Blogs = require("./models/Blogs")

io.on("connection",(socket) => {
  console.log("user connected",socket.id);
   
  


  socket.on("join-room", async({roomid,token}) => {
    try {
      const user = jwt.verify(token,process.env.JWT)
      const blog = await Blogs.findById(roomid).select("collabrators")
      if(!blog.collabrators.includes(user.id)){
      
        return socket.disconnect()
      }

        if(!rooms[roomid]){
         rooms[roomid] = new Y.Doc();
      }

      socket.join(roomid)

      
      console.log(`user joined room ${roomid}`);
  
    const state = Y.encodeStateAsUpdate(rooms[roomid])
    socket.emit("sync-step",{roomid,update: Array.from(state)})

    } catch (error) {
      console.log("auth failed",error);
      socket.disconnect()
    }
  })

  socket.on("sync-step",({roomid,update}) => {
    if(rooms[roomid]){
      Y.applyUpdate(rooms[roomid],update)
      socket.to(roomid).emit("sync-step",{update})
    }
  })

 


  socket.on("disconnect",() => {
    console.log("user disconnected",socket.id);
  })
})


const PORT = process.env.PORT ;




server.listen(PORT, () => {
  console.log(`server running ${PORT}`);
});