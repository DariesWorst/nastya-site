let board = Array(9).fill(null);
let current = "X";
let mode = "2p";

function startGame(m) {
    mode = m;

    document.getElementById("menu").classList.remove("active");
    document.getElementById("game").classList.add("active");

    document.getElementById("modeTitle").innerText =
        m === "bot" ? "Игра с ботом 🤖" : "2 игрока 👥";

    resetBoard();
}

function backMenu() {
    document.getElementById("game").classList.remove("active");
    document.getElementById("menu").classList.add("active");
}

function resetGame() {
    resetBoard();
}

function resetBoard() {
    board = Array(9).fill(null);
    current = "X";
    draw();
}

function draw() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";

    board.forEach((cell, i) => {
        const div = document.createElement("div");
        div.classList.add("cell");

        if (cell === "X") div.classList.add("x");
        if (cell === "O") div.classList.add("o");

        div.innerText = cell || "";
        div.onclick = () => move(i);

        boardDiv.appendChild(div);
    });
}

function move(i) {
    if (board[i]) return;

    board[i] = current;
    draw();

    if (checkWin(current)) {
        setTimeout(() => alert(current + " победил 🎉"), 100);
        return;
    }

    current = current === "X" ? "O" : "X";

    if (mode === "bot" && current === "O") {
        setTimeout(botMove, 300);
    }
}

/* 🤖 УМНЫЙ БОТ */
function botMove() {
    let move = findBestMove();

    board[move] = "O";
    draw();

    if (checkWin("O")) {
        setTimeout(() => alert("Бот победил 🤖"), 100);
        return;
    }

    current = "X";
}

function findBestMove() {

    // выиграть
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = "O";
            if (checkWin("O")) {
                board[i] = null;
                return i;
            }
            board[i] = null;
        }
    }

    // блок игрока
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = "X";
            if (checkWin("X")) {
                board[i] = null;
                return i;
            }
            board[i] = null;
        }
    }

    // центр
    if (!board[4]) return 4;

    // углы
    let corners = [0,2,6,8].filter(i => !board[i]);
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

    // всё остальное
    let empty = board.map((v,i)=>v===null?i:null).filter(v=>v!==null);
    return empty[Math.floor(Math.random() * empty.length)];
}

function checkWin(p) {
    const win = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    return win.some(c => c.every(i => board[i] === p));
}

draw();
