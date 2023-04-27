const fs = require("fs");
const path = require("path");

const ProcessLog = (msg, msgType) => {
  const logpath = path.join(__dirname, "../", "Applog", "Applog.txt");
  fs.appendFile(logpath, ` ${msgType} ${msg} at ${new Date()}\n`, (err) => {
    if (err) {
      console.log("Log - Error", err.message);
    }
    if (!err) {
      if (process.env.ENVIRONMENT === "development") {
        console.log("MESSAGE BY LOGGER", msg);
      }
    }
  });
};

module.exports = { ProcessLog };
