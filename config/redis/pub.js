const { ProcessLog } = require("../../logger/log");

const pubConnection = () => {
  const redis = require("redis");
  const publisher = redis.createClient("redis://127.0.0.1:6379");

  const createClientserver = async () => {
    await publisher.connect();
    global.publisher = publisher;
    console.log("Pub is Connect::");
    ProcessLog(`PubConnection: `, "SUCCESS:");
  };
  createClientserver();
};

module.exports = pubConnection;
