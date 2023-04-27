const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  turn: {
    type: Boolean,
  },
  socketid: {
    type: String,
  },
  computer_turn: Boolean,
});

const User = mongoose.model("user", userSchema);
module.exports = User;
