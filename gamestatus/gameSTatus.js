const { handleRoomEmit } = require("../common/emitHandler");
const GameSchema = require("../model/game");
const User = require("../model/user");

exports.startGame = async (data, socket) => {
  let plyaer1 = await User.findOne({ name: data.name });
  if (!plyaer1) {
    plyaer1 = await User.create({
      name: data.name,
      socketid: data.socketid,
      turn: data.turn,
    });
  } else {
    console.log("This Name is already taken please try with diffrent name");
  }

  let activetable = await GameSchema.findOne({
    activePlayerLength: { $lt: 2 },
  });

  if (activetable) {
    await socket.join(activetable._id.toString());

    await User.updateOne(
      { _id: plyaer1._id },
      { $set: { turn: false, socketid: data.socketid } }
    );

    let plyaer2update = await User.findOne({ _id: plyaer1._id });

    await GameSchema.updateOne(
      {
        // _id: activetable._id,
      },
      { $inc: { activePlayerLength: 1 }, $push: { playerInfo: plyaer2update } }
    );

    activetable = await GameSchema.findOne({ _id: activetable._id });
    publisher.publish(
      "products",
      JSON.stringify({
        roomId: activetable.playerInfo[0].socketid,
        data: { name: activetable.playerInfo[0].name, eventName: "playerName" },
      })
    );
    publisher.publish(
      "products",
      JSON.stringify({
        roomId: activetable.playerInfo[1].socketid,
        data: { name: activetable.playerInfo[1].name, eventName: "playerName" },
      })
    );

    handleRoomEmit(activetable._id.toString(), {
      eventName: "START_GAME",
      data: {
        message: "Players added....",
        playerInfo: activetable.playerInfo,
        tableId: activetable._id.toString(),
        board: activetable.board,
      },
    });
  } else {
    let tableData = await GameSchema.create({
      maxPlayerLength: 2,
      activePlayerLength: 1,
      playerInfo: [plyaer1],
      board: [
        null,
        0,
        null,
        1,
        null,
        2,
        null,
        3,
        4,
        null,
        5,
        null,
        6,
        null,
        7,
        null,
        null,
        8,
        null,
        9,
        null,
        10,
        null,
        11,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        12,
        null,
        13,
        null,
        14,
        null,
        15,
        null,
        null,
        16,
        null,
        17,
        null,
        18,
        null,
        19,
        20,
        null,
        21,
        null,
        22,
        null,
        23,
        null,
      ],
    });

    socket.join(tableData._id.toString());
    handleRoomEmit(tableData._id.toString(), {
      eventName: "START_GAME",
      data: {
        message: "Players added....",
        playerInfo: tableData.playerInfo,
        tableId: tableData._id.toString(),
        board: tableData.board,
      },
    });
  }
};

exports.autoMove = async (data, socket) => {
  handleRoomEmit(data.roomtableID.toString(), {
    eventName: "GAME_UPDETES11",
    data: data,
  });
};

exports.updateGameData = async (data, socket) => {
  if (data.roomtableID) {
    await GameSchema.updateOne(
      { _id: data.roomtableID },
      { board: data.board }
    );

    var game = await GameSchema.findById(data.roomtableID);

    handleRoomEmit(data.roomtableID.toString(), {
      eventName: "GAME_UPDATES",
      game,
    });
  }
  return;
};
