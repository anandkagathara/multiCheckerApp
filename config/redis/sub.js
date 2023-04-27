const { ProcessLog } = require("../../logger/log");

const subConnection = () => {
  const redis = require("redis");
  const subscriber = redis.createClient("redis://127.0.0.1:6379");

  createClientserver = async () => {
    await subscriber.connect();
    console.log("sub redis connected..");
    ProcessLog(`PubConnection: `, "SUCCESS:");
  };
  createClientserver();

  subscriber.subscribe("products", (data) => {
    data = JSON.parse(data);
    io.to(data.roomId).emit("response", data.data);
  });
};

module.exports = subConnection;
