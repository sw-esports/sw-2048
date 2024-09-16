var board;
var score = 0;
var rows = 4;
var columns = 4;
var previousBoard; // To store the previous state of the board for undo

window.onload = function() {
    setGame();
}

function setGame() {
    board = Array(rows).fill().map(() => Array(columns).fill(0)); // Initialize board
    createTiles(); // Create tile elements
    generateTile();
    generateTile();
    updateBoard(); // Update UI with initial board state
}

function createTiles() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            tile.className = 'tile'; // Ensure the tile has the 'tile' class
            document.querySelector(".grid").appendChild(tile); // Add tile to the grid
        }
    }
}

function saveState() {
    previousBoard = board.map(row => row.slice()); // Save a copy of the current board state
}

function restoreState() {
    board = previousBoard.map(row => row.slice()); // Restore the saved board state
    updateBoard(); // Update UI with restored board state
}

function hasEmptyTile() {
    return board.some(row => row.includes(0)); // Check if any row contains 0
}

function generateTile() {
    if (!hasEmptyTile()) return;

    let emptyTiles = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) emptyTiles.push([r, c]);
        }
    }

    let [r, c] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[r][c] = 2;
    updateTile(r, c, 2); // Update UI with the new tile
}

function updateTile(r, c, num) {
    let tile = document.getElementById(`${r}-${c}`);
    if (tile) { // Ensure the tile element exists
        tile.innerText = num > 0 ? num : '';
        tile.className = `tile x${num}`; // Apply appropriate class based on number
    }
}

function updateBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            updateTile(r, c, board[r][c]); // Update each tile
        }
    }
    document.getElementById("score").innerText = score; // Update score display
}

function slide(direction) {
    saveState(); // Save the current state before making a move
    let moved = false;

    if (direction === 'left' || direction === 'right') {
        for (let r = 0; r < rows; r++) {
            let row = board[r];
            if (direction === 'right') row.reverse();
            row = slideRow(row);
            if (direction === 'right') row.reverse();
            if (direction === 'right' || direction === 'left') {
                board[r] = row;
                moved = true;
            }
        }
    } else {
        for (let c = 0; c < columns; c++) {
            let col = board.map(row => row[c]);
            if (direction === 'down') col.reverse();
            col = slideRow(col);
            if (direction === 'down') col.reverse();
            for (let r = 0; r < rows; r++) {
                board[r][c] = col[r];
            }
            moved = true;
        }
    }

    if (moved) {
        generateTile(); // Add a new tile if any tiles were moved
        updateBoard(); // Update UI
    }

    if (checkGameOver()) {
        displayGameOver(); // Show game over if no moves left
    }
}

function slideRow(row) {
    row = row.filter(num => num !== 0); // Remove zeroes
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row.splice(i + 1, 1); // Remove the merged tile
            row.push(0); // Add zero to the end
        }
    }
    row = row.filter(num => num !== 0); // Remove zeroes again
    while (row.length < columns) row.push(0); // Fill the row with zeroes to match column length
    return row;
}

function checkGameOver() {
    // Check if there are any empty tiles or possible merges
    if (hasEmptyTile()) return false;

    // Check horizontal merges
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 1; c++) {
            if (board[r][c] === board[r][c + 1]) return false;
        }
    }

    // Check vertical merges
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 1; r++) {
            if (board[r][c] === board[r + 1][c]) return false;
        }
    }

    return true; // No moves left
}

function displayGameOver() {
    let gameOverMessage = document.createElement("div");
    gameOverMessage.id = "game-over";
    gameOverMessage.classList.add("game-over");
    gameOverMessage.innerText = `Game Over! Final Score: ${score}`;
    document.body.appendChild(gameOverMessage);
}

document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft") slide('left');
    if (e.code === "ArrowRight") slide('right');
    if (e.code === "ArrowUp") slide('up');
    if (e.code === "ArrowDown") slide('down');
    if (e.code === "KeyZ" && e.ctrlKey) restoreState(); // Undo functionality with Ctrl+Z
});
