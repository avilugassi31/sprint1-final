'use strict'

const MINE = '💣'
const EMPTY_CELL = ' ';
const FLAG = '🚩';
const HAPPY = '😄';
const UNHAPPY = '☹️';
var gLevel = { SIZE: 4, MINES: 2, FLAGS: 3, LIVE: 1 };
var gBoard;
var gTimer;
var gCell;
var gGame = { isOn: false, shownCount: 0, markedCount: gLevel.FLAGS, liveCount: gLevel.LIVE, secsPassed: 0, isGameOver: false };


// the Function who run all the game
function init() {
    gBoard = createBoard();
    generateRandomMines(gLevel.MINES);
    renderBoard(gBoard);
    console.log(gBoard)
    gGame.isOn = false;
    setProperties();

}

function showAllMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isMine) {
                renderCell({ i: i, j: j }, MINE);
            }
        }
    }
    return;
}

// the target is to open this function in cellClick to get the other cells open:
// i using another function to get the negs count around an then sent them to anothr matrix.

function expandShown(elCell, board, i, j) {
    var matrix = getMinesNegsCount(i, j, board);
    for (var i = 0; i < matrix.length; i++) {
        if (matrix[i] && elCell.innerText === '0') {
            renderCell({ i: matrix[i][0], j: matrix[i][1] }, setMinesNegsCount(i, j, board));
            // console.log('marix is:', matrix)
            gBoard[matrix[i][0]][matrix[i][1]].isShown = true;
        }
    }
}
// helped me to open the negs around empty cells with getting their idx;
function getMinesNegsCount(cellI, cellJ, mat) {
    var matrix = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if ((i === cellI && j === cellJ) || j < 0 || j >= mat[i].length) continue;
            if (!mat[i][j].isMine) {
                matrix[i + j] = [i, j];
            }
        }
    }
    return matrix;
}

// count the negs around!!!
function setMinesNegsCount(cellI, cellJ, mat) {
    var countMinesNegs = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if ((i === cellI && j === cellJ) || j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].isMine) countMinesNegs++
        }
    }
    return countMinesNegs;

}

function changeBoardSize(level) {

    if (level === 'easy') {
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
        gLevel.FLAGS = 3;
        gGame.markedCount = gLevel.FLAGS;
        gLevel.LIVE = 1;



    }
    if (level === 'medium') {
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
        gLevel.FLAGS = 6;
        gGame.markedCount = gLevel.FLAGS;
        gLevel.LIVE = 3;
    }
    if (level === 'hard') {
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
        gLevel.FLAGS = 12;
        gGame.markedCount = gLevel.FLAGS;
        gLevel.LIVE = 3;
    }
    init()
}

// function who check for game over;
function checkIfVictory() {
    var countMine = 0;
    var countShown = 0;
    var countMarked = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isShown) countShown++;
            if (gBoard[i][j].isMine) countMine++;
            if (gBoard[i][j].isMarked) countMarked++;
        }
    }
    if ((countMarked + countShown) === (gBoard.length * gBoard.length)) {
        // if (gBoard[i][j].isMarked === gBoard[i][j].isMine) {
        //     console.log('hello mine')
        // }


        return true;
    }
    return false;
}
// marked the cells with flags by using right stick in mouse...
function cellMarked(elCell, i, j) {
    window.oncontextmenu = function () {
        if (gGame.markedCount !== 0) {
            elCell.isMarked = true;
            elCell.innerText = FLAG;
            gBoard[i][j].isMarked = true;
            gGame.markedCount--;
            var elFlag = document.querySelector('.flag');
            elFlag.innerText = gGame.markedCount;
        } else {
            var flag = document.querySelector('.flag ')
            flag.innerText = 'No More Flags';
        }
        if (checkIfVictory()) {
            alert('you Win');
            restartGame();
        }


    }
}
// everythin happened hear - the most important function.
function cellClick(elCell, i, j) {
    if (gGame.isGameOver) return;
    var sec = 1;
    if (!gGame.isOn) {
        gGame.isOn = true;
        gTimer = setInterval(function () {
            var time = new Date(sec * 1000).toString().split(':');
            var currTime = time[1] + ':' + time[2].split(' ')[0];
            document.querySelector('.timer-display').innerHTML = currTime;
            sec++;
        }, 1000);
    }
    var modelCell = gBoard[i][j];
    var display = modelCell.isMine ? MINE : modelCell.minesAroundCount;
    renderCell({ i: i, j: j }, display);
    if (gBoard[i][j].isMine) {
        if (gGame.liveCount === 0) {
            showAllMines(gBoard);
            clearInterval(gTimer);
            var elRes = document.querySelector('.button4');
            elRes.innerText = UNHAPPY;
            gGame.isGameOver = true;
            return;
        } else {
            gGame.liveCount--;
            var elLive = document.querySelector('.live');
            elLive.innerText = gGame.liveCount;
        }

    } else {
        expandShown(elCell, gBoard, i, j);
    }
    gBoard[i][j].isShown = true;
    if (checkIfVictory()) {
        alert('you Win');
        restartGame();
    }

}

function setProperties() {
    var elRestart = document.querySelector('.button4');
    elRestart.innerText = HAPPY;
    var elBoard = document.querySelector('.table')
    elBoard.style.display = 'block';
    document.querySelector('.timer-display').innerHTML = '00:00';
    var elFlag = document.querySelector('p span');
    elFlag.innerText = gLevel.FLAGS;
    gGame.markedCount = gLevel.FLAGS;
    var elLive = document.querySelector('.live');
    elLive.innerText = gLevel.LIVE;
    gGame.liveCount = gLevel.LIVE;

}
function restartGame() {
    gGame.isOn = false;
    gGame.isGameOver = false;
    clearInterval(gTimer);
    init();

}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = EMPTY_CELL;
            strHTML += `<td class="cell-${i}-${j} cell" onclick="cellClick(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j})">
        ${currCell}</td>`
        }
        strHTML += '</tr>\n';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function createBoard() {
    var board = getMat(gLevel.SIZE);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j] = gCell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    var mineIdxi = getRandomInt(0, gLevel.SIZE);
    var mineIdxj = getRandomInt(0, gLevel.SIZE);
    var randIdxi = getRandomInt(0, gLevel.SIZE);
    var randIdxj = getRandomInt(0, gLevel.SIZE);

    board[mineIdxi][mineIdxj].isMine = true;
    board[randIdxi][randIdxj].isMine = true;

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(i, j, board);
        }
    }
    return board
}


function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

function generateRandomMines(mines) {
    for (var i = 1; i < mines; i++) {
        var emptyCells = getEmptyCells(gBoard);
        var randIdx = getRandomInt(0, emptyCells.length);
        var emptyPos = emptyCells[randIdx];
        gBoard[emptyPos.i][emptyPos.j].isMine = true
    }
}
function getEmptyCells(gBoard) {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            var position = {
                i: i,
                j: j
            }
            if (!cell.isMine) {
                emptyCells.push(position)
            }
        }
    }
    return emptyCells
}