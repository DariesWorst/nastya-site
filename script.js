let board = Array(9).fill(null);
let current = "X";
let mode = "2p";

/* 🎉 CONFETTI */
function fireConfetti() {
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 6,
            spread: 70,
            origin: { y: 0.6 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

/* 🎮 START */
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

/* 🎨 DRAW */
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

/* 🎮 MOVE */
function move(i) {
    if (board[i]) return;

    board[i] = current;
    draw();

    if (checkWin(current)) {
        fireConfetti();
        setTimeout(() => alert(current + " победил 🎉"), 100);
        return;
    }

    current = current === "X" ? "O" : "X";

    if (mode === "bot" && current === "O") {
        setTimeout(botMove, 300);
    }
}

/* 🤖 SMART BOT */
function botMove() {
    let move = findBestMove();

    board[move] = "O";
    draw();

    if (checkWin("O")) {
        fireConfetti();
        setTimeout(() => alert("Бот победил 🤖"), 100);
        return;
    }

    current = "X";
}

/* 🧠 AI */
function findBestMove() {

    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = "O";
            if (checkWin("O")) { board[i] = null; return i; }
            board[i] = null;
        }
    }

    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = "X";
            if (checkWin("X")) { board[i] = null; return i; }
            board[i] = null;
        }
    }

    if (!board[4]) return 4;

    let corners = [0,2,6,8].filter(i => !board[i]);
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

    let empty = board.map((v,i)=>v===null?i:null).filter(v=>v!==null);
    return empty[Math.floor(Math.random() * empty.length)];
}

/* 🏆 WIN */
function checkWin(p) {
    const win = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    return win.some(c => c.every(i => board[i] === p));
}

draw();
