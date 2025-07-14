const app = require("./app")
const connectdb = require("./config/db")

connectdb()

const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`server running ${PORT}`);
});