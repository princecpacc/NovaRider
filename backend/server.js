const app = require("./src/app");
const http = require("http")
const connectDB = require("./src/config/db");
const initializeSocket = require("./src/socket/index")
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try{
    await connectDB();

    const server = http.createServer(app);

    initializeSocket(server);


    server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})
  } catch(error){
    console.error("Falied to start server", error.message);
  }
}


startServer();

