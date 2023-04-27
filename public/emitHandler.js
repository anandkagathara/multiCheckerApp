var socketEmit = (socket, data)=>{
    socket.emit("request", data)
}