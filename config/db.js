const mongoose = require("mongoose");
const {ProcessLog} = require("../logger/log")

mongoose.connect("mongodb://localhost:27017/boardGame", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("Database is Connected");
  ProcessLog(`DatabaseConnection : boardGame`, "SUCCESS:");

});
mongoose.connection.on("error", (e) => {
  console.log("Database is Not Connected", e);
});
