var socket = io();
let is_mul = false;
parseInt(is_mul) === 1 ? true : false;

let isSystem_play = false;
const cells = $("td");
let redsPieces = $("p");
let blacksPieces = $("span");
const redTurnText = $(".red-turn-text");
const blackTurntext = $(".black-turn-text");
const divider = $("#divider");

let turn = true;
let sys_turn;
let redScore = 12;
let blackScore = 12;
let playerPieces;
let System_turn = false;
let blacks_Pieces_id = [];
let system_turn = false;
let First_plyer;
let Second_plyer;

let users = [];
let currentPlayer = "";
let currentPlayerSymbol;
let currentPlayerId = "";


let player1_sokcet_id;
let player2_sokcet_id;

let playerTurn;
let Data;
let gameActive = false;
let board;
let roomtableID;

let selectedPiece = {
  pieceId: -1,
  indexOfBoardPiece: -1,
  isKing: false,
  seventhSpace: false,
  ninthSpace: false,
  fourteenthSpace: false,
  eighteenthSpace: false,
  minusSeventhSpace: false,
  minusNinthSpace: false,
  minusFourteenthSpace: false,
  minusEighteenthSpace: false,
};

const startButton = document.querySelector(".game--start");
const restartButton = document.querySelector(".game--restart");

$(".game--restart").attr("disabled", true).addClass("disabled");

socket.on("response", async (data) => {
  console.log(data); // Debugging statement
  switch (data.eventName) {
    case "playerName":
      $("#playerName").html(`${data.name} Table`);
      break;
    case "START_GAME":
      $(".game--start").attr("disabled", true).addClass("disabled");

      console.log("dataaaaaaaaaaaaaaaaaaaa",data);
      if (data.data && data.data.tableId) {
        roomtableID = data.data.tableId;
        board = data.data.board;
        Data = data;
        First_plyer = data.data.playerInfo[0].name;
        if (data.data.playerInfo.length < 2) {
          player1_sokcet_id = data.data.playerInfo[0].socketid;
          $("#message").text("Wating for the Opponent");
          $("#start").remove();
          $(".game--restart").attr("disabled", false).addClass("enabled");
        } else {
          player2_sokcet_id = data.data.playerInfo[1].socketid;
          $("#message").text(`${data.data.playerInfo[0].name} Turn`);
          $(".black-turn-text").text("Red Turn").css("color", "red");
          $("#start").remove();
          $(".game--restart").attr("disabled", false).addClass("enabled");

          Second_plyer = data.data.playerInfo[1].name;
          playerTurn = data.data.playerInfo[0].turn;
          playerSecond = data.data.playerInfo[1].turn;
          let PlayerId = data.data.playerInfo;
          let firstPlayerId = PlayerId[0]._id;
          let secondPlayerId = PlayerId[1]._id;
          tableId = data.data.tableId;
          givePiecesEventListeners();
        }
      } else {
        console.error("Missing `tableId` property in `data` object.");
      }
      break;
    default:
      console.error(`Unknown event name: ${data.eventName}`);
      break;
  
    case "GAME_UPDETES11":
      selectedPiece = data.data.selectedPiece;
      document.getElementById(selectedPiece.pieceId).remove();
      cells[selectedPiece.indexOfBoardPiece].innerHTML = "";
      if (playerTurn) {
        if (selectedPiece.isKing) {
          cells[
            selectedPiece.indexOfBoardPiece + data.data.number
          ].innerHTML = `<p class="red-piece king" id="${selectedPiece.pieceId}"></p>`;
          redsPieces = document.querySelectorAll("p");
        } else {
          cells[
            selectedPiece.indexOfBoardPiece + data.data.number
          ].innerHTML = `<p class="red-piece" id="${selectedPiece.pieceId}"></p>`;
          redsPieces = document.querySelectorAll("p");
        }
      } else {
        if (selectedPiece.isKing) {
          cells[
            selectedPiece.indexOfBoardPiece + data.data.number
          ].innerHTML = `<span class="black-piece king" id="${selectedPiece.pieceId}"></span>`;
          blacksPieces = document.querySelectorAll("span");
        } else {
          cells[
            selectedPiece.indexOfBoardPiece + data.data.number
          ].innerHTML = `<span class="black-piece" id="${selectedPiece.pieceId}"></span>`;
          blacksPieces = document.querySelectorAll("span");
        }
      }

      let indexOfPiece = selectedPiece.indexOfBoardPiece;

      if (
        data.data.number === 14 ||
        data.data.number === -14 ||
        data.data.number === 18 ||
        data.data.number === -18
      ) {
        changeData(
          indexOfPiece,
          indexOfPiece + data.data.number,
          indexOfPiece + data.data.number / 2
        );
      } else {
        changeData(indexOfPiece, indexOfPiece + data.data.number);
      }
      break;
    case "GAME_UPDETES":
      break;
  }
});

const findPiece = (pieceId) => {
  let parsed = parseInt(pieceId);
  return board.indexOf(parsed);
};

const startGame = () => {
  let player1 = prompt("Please enter Player Name");
  if (player1 != null) {
    socketEmit(socket, {
      eventName: "START_GAME",
      data: { name: player1, socketid: socket.id, turn: turn },
    });
  }
};
document.querySelector(".game--start").addEventListener("click", startGame);

function givePiecesEventListeners() {
  if (playerTurn && player1_sokcet_id) {
    for (let i = 0; i < redsPieces.length; i++) {
      redsPieces[i].addEventListener("click", getPlayerPieces);
    }
  } else if (player1_sokcet_id || playerTurn) {
    for (let i = 0; i < blacksPieces.length; i++) {
      blacksPieces[i].removeEventListener("click", getPlayerPieces);
    }
  } else {
    for (let i = 0; i < blacksPieces.length; i++) {
      blacksPieces[i].addEventListener("click", getPlayerPieces);
    }
  }
}

function getPlayerPieces() {
  const firstPlayerId = Data.data.playerInfo[0]._id;
  const secondPlayerId = Data.data.playerInfo[1]._id;

  if (playerTurn && firstPlayerId) {
    playerPieces = redsPieces;
  } else if (secondPlayerId) {
    playerPieces = blacksPieces;
  }
  removeCellonclick();
  resetBorders();
}

function removeCellonclick() {
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeAttribute("onclick");
    cells[i].style.backgroundColor = "";
  }
}

function resetBorders() {
  for (let i = 0; i < playerPieces.length; i++) {
    playerPieces[i].style.border = "1px solid white";
  }
  resetSelectedPieceProperties();
  getSelectedPiece();
}

function resetSelectedPieceProperties() {
  selectedPiece.pieceId = -1;
  selectedPiece.pieceId = -1;
  selectedPiece.isKing = false;
  selectedPiece.seventhSpace = false;
  selectedPiece.ninthSpace = false;
  selectedPiece.fourteenthSpace = false;
  selectedPiece.eighteenthSpace = false;
  selectedPiece.minusSeventhSpace = false;
  selectedPiece.minusNinthSpace = false;
  selectedPiece.minusFourteenthSpace = false;
  selectedPiece.minusEighteenthSpace = false;
}
function getSelectedPiece(sys) {
  sys = sys || false;
  if (sys) {
    selectedPiece.pieceId = parseInt(sys);
    selectedPiece.indexOfBoardPiece = findPiece(selectedPiece.pieceId);
  } else {
    selectedPiece.pieceId = parseInt(event.target.id);
    selectedPiece.indexOfBoardPiece = findPiece(selectedPiece.pieceId);
  }

  isPieceKing();
}

function isPieceKing() {
  if (
    document.getElementById(selectedPiece.pieceId).classList.contains("king")
  ) {
    selectedPiece.isKing = true;
  } else {
    selectedPiece.isKing = false;
  }
  getAvailableSpaces();
}

function getAvailableSpaces() {
  if (
    board[selectedPiece.indexOfBoardPiece + 7] === null &&
    cells[selectedPiece.indexOfBoardPiece + 7].classList.contains(
      "noPieceHere"
    ) !== true
  ) {
    selectedPiece.seventhSpace = true;
  }
  if (
    board[selectedPiece.indexOfBoardPiece + 9] === null &&
    cells[selectedPiece.indexOfBoardPiece + 9].classList.contains(
      "noPieceHere"
    ) !== true
  ) {
    selectedPiece.ninthSpace = true;
  }
  if (
    board[selectedPiece.indexOfBoardPiece - 7] === null &&
    cells[selectedPiece.indexOfBoardPiece - 7].classList.contains(
      "noPieceHere"
    ) !== true
  ) {
    selectedPiece.minusSeventhSpace = true;
  }
  if (
    board[selectedPiece.indexOfBoardPiece - 9] === null &&
    cells[selectedPiece.indexOfBoardPiece - 9].classList.contains(
      "noPieceHere"
    ) !== true
  ) {
    selectedPiece.minusNinthSpace = true;
  }
  checkAvailableJumpSpaces();
}

function checkAvailableJumpSpaces() {
  if (playerTurn) {
    if (
      board[selectedPiece.indexOfBoardPiece + 14] === null &&
      cells[selectedPiece.indexOfBoardPiece + 14].classList.contains(
        "noPieceHere"
      ) !== true &&
      board[selectedPiece.indexOfBoardPiece + 7] >= 12
    ) {
      selectedPiece.fourteenthSpace = true;
    }
    if (
      board[selectedPiece.indexOfBoardPiece + 18] === null &&
      cells[selectedPiece.indexOfBoardPiece + 18].classList.contains(
        "noPieceHere"
      ) !== true &&
      board[selectedPiece.indexOfBoardPiece + 9] >= 12
    ) {
      selectedPiece.eighteenthSpace = true;
    }
    if (
      board[selectedPiece.indexOfBoardPiece - 14] === null &&
      cells[selectedPiece.indexOfBoardPiece - 14].classList.contains(
        "noPieceHere"
      ) !== true &&
      board[selectedPiece.indexOfBoardPiece - 7] >= 12
    ) {
      selectedPiece.minusFourteenthSpace = true;
    }
    if (
      board[selectedPiece.indexOfBoardPiece - 18] === null &&
      cells[selectedPiece.indexOfBoardPiece - 18].classList.contains(
        "noPieceHere"
      ) !== true &&
      board[selectedPiece.indexOfBoardPiece - 9] >= 12
    ) {
      selectedPiece.minusEighteenthSpace = true;
    }
  } else if (playerSecond === false) {
    if (
      board[selectedPiece.indexOfBoardPiece + 14] === null &&
      cells[selectedPiece.indexOfBoardPiece + 14].classList.contains(
        "noPieceHere"
      ) !== true &&
      board[selectedPiece.indexOfBoardPiece + 7] < 12 &&
      board[selectedPiece.indexOfBoardPiece + 7] !== null
    ) {
      selectedPiece.fourteenthSpace = true;
    }
    if (
      board[selectedPiece.indexOfBoardPiece + 18] === null &&
      cells[selectedPiece.indexOfBoardPiece + 18].classList.contains(
        "noPieceHere"
      ) !== true &&
      board[selectedPiece.indexOfBoardPiece + 9] < 12 &&
      board[selectedPiece.indexOfBoardPiece + 9] !== null
    ) {
      selectedPiece.eighteenthSpace = true;
    }
    if (
      board[selectedPiece.indexOfBoardPiece - 14] === null &&
      cells[selectedPiece.indexOfBoardPiece - 14].classList.contains(
        "noPieceHere"
      ) !== true &&
      board[selectedPiece.indexOfBoardPiece - 7] < 12 &&
      board[selectedPiece.indexOfBoardPiece - 7] !== null
    ) {
      selectedPiece.minusFourteenthSpace = true;
    }
    if (
      board[selectedPiece.indexOfBoardPiece - 18] === null &&
      cells[selectedPiece.indexOfBoardPiece - 18].classList.contains(
        "noPieceHere"
      ) !== true &&
      board[selectedPiece.indexOfBoardPiece - 9] < 12 &&
      board[selectedPiece.indexOfBoardPiece - 9] !== null
    ) {
      selectedPiece.minusEighteenthSpace = true;
    }
  }
  checkPieceConditions();
}

function checkPieceConditions() {
  if (selectedPiece.isKing) {
    givePieceBorder();
  } else {
    if (playerTurn) {
      selectedPiece.minusSeventhSpace = false;
      selectedPiece.minusNinthSpace = false;
      selectedPiece.minusFourteenthSpace = false;
      selectedPiece.minusEighteenthSpace = false;
    } else {
      selectedPiece.seventhSpace = false;
      selectedPiece.ninthSpace = false;
      selectedPiece.fourteenthSpace = false;
      selectedPiece.eighteenthSpace = false;
    }
    givePieceBorder();
  }
}

function givePieceBorder() {
  if (
    selectedPiece.seventhSpace ||
    selectedPiece.ninthSpace ||
    selectedPiece.fourteenthSpace ||
    selectedPiece.eighteenthSpace ||
    selectedPiece.minusSeventhSpace ||
    selectedPiece.minusNinthSpace ||
    selectedPiece.minusFourteenthSpace ||
    selectedPiece.minusEighteenthSpace
  ) {
    document.getElementById(selectedPiece.pieceId).style.border =
      "3px solid green";
    giveCellsClick();
  } else {
    return;
  }
}
function giveCellsClick() {
  if (selectedPiece.seventhSpace) {
    cells[selectedPiece.indexOfBoardPiece + 7].setAttribute(
      "onclick",
      "makeMove(7)"
    );
    cells[selectedPiece.indexOfBoardPiece + 7].style.backgroundColor = "green";
  }
  if (selectedPiece.ninthSpace) {
    cells[selectedPiece.indexOfBoardPiece + 9].setAttribute(
      "onclick",
      "makeMove(9)"
    );
    cells[selectedPiece.indexOfBoardPiece + 9].style.backgroundColor = "green";
  }
  if (selectedPiece.fourteenthSpace) {
    cells[selectedPiece.indexOfBoardPiece + 14].setAttribute(
      "onclick",
      "makeMove(14)"
    );
    cells[selectedPiece.indexOfBoardPiece + 14].style.backgroundColor = "green";
  }
  if (selectedPiece.eighteenthSpace) {
    cells[selectedPiece.indexOfBoardPiece + 18].setAttribute(
      "onclick",
      "makeMove(18)"
    );
    cells[selectedPiece.indexOfBoardPiece + 18].style.backgroundColor = "green";
  }
  if (selectedPiece.minusSeventhSpace) {
    cells[selectedPiece.indexOfBoardPiece - 7].setAttribute(
      "onclick",
      "makeMove(-7)"
    );
    cells[selectedPiece.indexOfBoardPiece - 7].style.backgroundColor = "green";
  }
  if (selectedPiece.minusNinthSpace) {
    cells[selectedPiece.indexOfBoardPiece - 9].setAttribute(
      "onclick",
      "makeMove(-9)"
    );
    cells[selectedPiece.indexOfBoardPiece - 9].style.backgroundColor = "green";
  }
  if (selectedPiece.minusFourteenthSpace) {
    cells[selectedPiece.indexOfBoardPiece - 14].setAttribute(
      "onclick",
      "makeMove(-14)"
    );
    cells[selectedPiece.indexOfBoardPiece - 14].style.backgroundColor = "green";
  }
  if (selectedPiece.minusEighteenthSpace) {
    cells[selectedPiece.indexOfBoardPiece - 18].setAttribute(
      "onclick",
      "makeMove(-18)"
    );
    cells[selectedPiece.indexOfBoardPiece - 18].style.backgroundColor = "green";
  }
}

const makeMove = (number) => {
  socketEmit(socket, {
    eventName: "GAME_UPDETES11",
    data: {
      roomtableID: roomtableID,
      selectedPiece: selectedPiece,
      number: number,
    },
  });
};

function changeData(indexOfBoardPiece, modifiedIndex, removePiece) {
  board[indexOfBoardPiece] = null;
  board[modifiedIndex] = parseInt(selectedPiece.pieceId);
  if (playerTurn && selectedPiece.pieceId < 12 && modifiedIndex >= 56) {
    document.getElementById(selectedPiece.pieceId).classList.add("king");
  }
  if (
    playerTurn === false &&
    selectedPiece.pieceId >= 12 &&
    modifiedIndex <= 7
  ) {
    document.getElementById(selectedPiece.pieceId).classList.add("king");
  }
  if (removePiece) {
    board[removePiece] = null;
    if (playerTurn && selectedPiece.pieceId < 12) {
      cells[removePiece].innerHTML = "";
      blackScore--;
    }
    if (playerSecond === false && selectedPiece.pieceId >= 12) {
      cells[removePiece].innerHTML = "";
      redScore--;
    }
  }
  resetSelectedPieceProperties();
  removeCellonclick();
  removeEventListeners();
  socketEmit(socket, {
    eventName: "GAME_UPDETES",
    data: {
      roomtableID: roomtableID,
      board: board,
    },
  });
}

function removeEventListeners() {
  if (playerTurn === false) {
    for (let i = 0; i < redsPieces.length; i++) {
      redsPieces[i].removeEventListener("click", getPlayerPieces);
    }
  } else {
    for (let i = 0; i < blacksPieces.length; i++) {
      blacksPieces[i].removeEventListener("click", getPlayerPieces);
    }
  }
  checkForWin();
}

function checkForWin() {
  if (blackScore === 0) {
    alert("Red WIn");
    divider.style.display = "none";
    for (let i = 0; i < redTurnText.length; i++) {
      redTurnText[i].style.color = "black";
      blackTurntext[i].style.display = "none";
      redTurnText[i].textContent = "Red WINS!";
    }
  } else if (redScore === 0) {
    alert("Black WIn");
    divider.style.display = "none";
    for (let i = 0; i < blackTurntext.length; i++) {
      blackTurntext[i].style.color = "black";
      redTurnText[i].style.display = "none";
      blackTurntext[i].textContent = "BLACK WINS!";
    }
  }
  changePlayer();
}

function changePlayer() {
  debugger;
  if (playerTurn) {
    playerTurn = false;
    $("#message").text(`${Second_plyer} turn`);
    for (let i = 0; i < redTurnText.length; i++) {
      blackTurntext[i].style.color = "black";
      blackTurntext[i].innerHTML = "Black Turn";
    }
    is_mul === true ? $(`#${selectedPiece.pieceId}`).trigger(system()) : "";
  } else {
    playerTurn = true;
    $("#message").text(`${First_plyer} turn`);
    for (let i = 0; i < blackTurntext.length; i++) {
      blackTurntext[i].style.color = "red";
      blackTurntext[i].innerHTML = "Red Turn";
    }
  }
  givePiecesEventListeners();
}

let system = () => {
  blacksPieces = $("span");

  let pieceId;
  let make_move;
  let jumb_space;
  let move_piece;
  let pieceId_index;
  let no_move;
  givePiecesEventListeners();
  for (let i = 0; i < blacksPieces.length; i++) {
    pieceId = parseInt(blacksPieces[i].attributes.id.value);
    selectedPiece.pieceId = parseInt(blacksPieces[i].attributes.id.value);
    getSelectedPiece(blacksPieces[i].attributes.id.value);
    if (
      selectedPiece.seventhSpace ||
      selectedPiece.ninthSpace ||
      selectedPiece.fourteenthSpace ||
      selectedPiece.eighteenthSpace ||
      selectedPiece.minusSeventhSpace ||
      selectedPiece.minusNinthSpace ||
      selectedPiece.minusFourteenthSpace ||
      selectedPiece.minusEighteenthSpace
    ) {
      no_move = false;
      break;
    } else {
      no_move = true;
    }
  }
  if (no_move) return alert("NO MOVE AVAILABLE FOR BLACK PIECES GAME OVER");
  if (selectedPiece.seventhSpace) make_move = 7;
  if (selectedPiece.ninthSpace) make_move = 9;
  if (selectedPiece.fourteenthSpace) jumb_space = 14;
  if (selectedPiece.eighteenthSpace) jumb_space = 18;
  if (selectedPiece.minusSeventhSpace) make_move = -7;
  if (selectedPiece.minusNinthSpace) make_move = -9;
  if (selectedPiece.minusFourteenthSpace) jumb_space = -14;
  if (selectedPiece.minusEighteenthSpace) jumb_space = -18;

  if (jumb_space) {
    move_piece = jumb_space;
  } else {
    move_piece = make_move;
  }
  makeMove(move_piece);
  turn = true;
};
givePiecesEventListeners();
