const express = require("express");
const app = express();
const server = require("http").createServer(app);
require("./config/db");
const {ProcessLog} = require("./logger/log")
global.io = require("socket.io")(server);
const port = 3000;

app.use(express.static("./public"));

const pubConnection = require("./config/redis/pub");
pubConnection();
const subConnection = require("./config/redis/sub");
subConnection();

const socketConnection = require("./config/socket");
socketConnection(io);
server.listen(port, () => {
  console.log("Server is running on ", port);
  ProcessLog(`ServerStart : ${port}`, "SUCCESS:");
});
