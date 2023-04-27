const eventHandler = require("../evenetHandler/event");
const { ProcessLog } = require("../logger/log");
const socket = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket Connected...", socket.id);
    ProcessLog(`SocketConnection : ${socket.id}`, "SUCCESS:");

    socket.on("request", async (data, callback) => {
      eventHandler(data, socket);
    });

    socket.on("Hello", (msg) => console.log("", msg));

    socket.on("disconnect", () => {
      console.log("Socket Disconnected...");
      ProcessLog(
        `Socket Disconnect : ${socket.id} Reason: Close Connection`,
        "SOCKET DISCONNECT:"
      );
    });
    socket.emit("testing", "working fine");
  });
};

module.exports = socket;
