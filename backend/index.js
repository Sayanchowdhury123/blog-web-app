const app = require("./app")
const connectdb = require("./config/db")
const http = require("http")

connectdb()


const PORT = process.env.PORT ;




app.listen(PORT, () => {
  console.log(`server running ${PORT}`);
});