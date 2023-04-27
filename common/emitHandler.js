const handleRoomEmit = (roomId, data) => {
  publisher.publish("products", JSON.stringify({ roomId, data }));
};

var socketEmit = (socket, data) => {
  socket.emit("request", data);
};
module.exports = { handleRoomEmit, socketEmit };
