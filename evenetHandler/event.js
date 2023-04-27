const {
  startGame,
  changePlayerTurn,
  updateGameData,
  autoMove,
} = require("../gamestatus/gameSTatus");

const eventHandler = (data, socket) => {
  switch (data.eventName) {
    case "START_GAME":
      startGame(data.data, socket);
      break;
    case "CHANGE_PLAYER":
      changePlayerTurn(data.data, socket);
      break;
    case "GAME_UPDETES11":
      autoMove(data.data, socket);
      break;
    case "GAME_UPDETES":
      updateGameData(data.data, socket);
      break;
    default:
      break;
  }
};
module.exports = eventHandler;
