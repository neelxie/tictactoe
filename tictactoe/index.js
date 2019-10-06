var myGameBoard;
const humanPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]; 

const cells = document.querySelectorAll('.tableCell');  
play();

function play() {  document.querySelector(".finish").style.display = "none"
 myGameBoard = Array.from(Array(9).keys())
 for (var i=0; i< cells.length; i++) {
  cells[i].innerText = '';
  cells[i].style.removeProperty('background-color');
  cells[i].addEventListener('click', turnClick, false);
    }
} 

function turnClick (square) {
  if (typeof myGameBoard[square.target.id] === 'number') {
    turn(square.target.id, humanPlayer)
    if (!checkTie()) turn(bestSpot(), aiPlayer);
    }   
} 


function turn(squareId, player) {
  myGameBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
 let gameWon = checkWin(myGameBoard, player)
 if (gameWon) gameOver(gameWon)
} 


function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => 
  (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {index: index, player: player};
      break;
    } 
} 
return gameWon;
} 


//defining gameOver function
function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) { //going through every index of the WinCombos
    document.getElementById(index).style.backgroundColor = 
    gameWon.player === humanPlayer ? "#4da6ff" : "#ff0000"; //if the human won-set background color to blue, if AI won-set background color to red
}
  for (var i= 0; i < cells.length; i++ ) { //making sure we cannot click on the cells anymore
    cells[i].removeEventListener('click', turnClick, false);
}
  declareWinner(gameWon.player === humanPlayer ? "You win!" : "You lose."); //if human Player won show "You win!", otherwise show "You lose."
} 


//defining declareWinner function
function declareWinner(who) {
    document.querySelector(".finish").style.display = "block";
    document.querySelector(".finish .derek").innerText = who;
}

//defining emptySuares function
function emptySquares() {
    return myGameBoard.filter(s => typeof s === 'number'); //filter every element in the myGameBoard to see if the type of element equals number. If yes, we are gonna return it (all the squares that are numbers are empty, the squares with X and O are not empty)
}


//defining bestSpot function
function bestSpot() {
    return minimax(myGameBoard, aiPlayer).index; //will always play in the first empty squre
}


//defining checkTie function
function checkTie() {
    if (emptySquares().length === 0) { //if every squre is filled up &nobody has won then it's a tie
        for (var i = 0; i < cells.length; i++) { 
            cells[i].style.backgroundColor = "#66ff66"; //setting the background color to green
            cells[i].removeEventListener('click', turnClick, false); //making sure user cannot click anywhere as the game is over
        }
        declareWinner("Its a tie.")
        return true; //returning true as it's a tie
    }
    return false;
}


//defining minimax function
function minimax(newBoard, player) {
    var availSpots = emptySquares(newBoard); //defining the indexes of the available spots in the board

    if(checkWin(newBoard, player)) { //checking who wins
        return {score: -10}; //if O wins we return -10
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 10} // if X wins we return 10
    } else if (availSpots.length === 0) {
        return {score: 0} //tie, we return 0
    }
    var moves = []; //collect the scores from each of the empty spots to evaluate them later
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]]; //setting the index number of the empty spot, that was store as a number in the myGameBoard, to the index property of the move object
        newBoard[availSpots[i]] = player; //setting empty spot on a newBoard to the current player

        if (player === aiPlayer) { //calling the minimax function with the other player in the newly changed newBoard
            var result = minimax(newBoard, humanPlayer);
            move.score = result.score; //store the object result from the minimax function call, that includes a score property, to the score property of the move object
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score; //if the minimax function does not find a terminal state, it goes level by level (deeper into the game). this recursion happens until it reached out the terminal state and returns a score one level up
        }

        newBoard[availSpots[i]] = move.index; // minimax resets newBoard to what it was before
        
        moves.push(move);//pushes the move object to the moves array
        }

        var bestMove; //minimax algorithm evaluates the best move in the moves array
        if(player === aiPlayer) {  //choosing the highest score when AI is playing and the lowest score when the human is playing            
            var bestScore = -10000; //if the player is AI player, it sets variable bestScore to a very low number
            for (var i = 0; i < moves.length; i++) { //looping through the moves array
                if (moves[i].score > bestScore) { //if a move has a higher score than the bestScore, the algorithm stores that move
                    bestScore = moves[i].score;
                    bestMove = i; //if there are moves with similar scores, only the first will be stored
                }
            }
        } else { // when human Player
            var bestScore = 10000;
            for(var i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) { //minimax looks for a move with the lowest score to store
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove]; //returning object stored in bestMove
    }