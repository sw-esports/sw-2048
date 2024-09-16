var board; // 2D array representing the game board
var score = 0; // Variable to keep track of the player's score
var rows = 4; // Number of rows in the board
var columns = 4; // Number of columns in the board

// Function that initializes the game when the window loads
window.onload = function() {
    setGame(); // Set up the initial game state
}

// Function to set up the initial game state
function setGame() {
    // Initialize the board with zeros (empty tiles)
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // Create a tile for each cell in the board
    for (let r = 0; r < rows; r++) { // Loop through each row
        for (let c = 0; c < columns; c++) { // Loop through each column
            // Create a new div element for the tile
            let tile = document.createElement("div");
            // Set the tile's ID to correspond with its position
            tile.id = r.toString() + "-" + c.toString();
            // Get the number at this position in the board
            let num = board[r][c];
            // Update the tile's display based on the number
            updateTile(tile, num);
            // Append the tile to the grid container in the HTML
            document.querySelector(".grid").append(tile);
        }
    }
    // Generate two initial tiles with numbers (usually 2)
    generateTile();
    generateTile();
}

// Function to check if there are any empty tiles on the board
function hasEmptyTile() {
    for (let r = 0; r < rows; r++) { // Loop through each row
        for (let c = 0; c < columns; c++) { // Loop through each column
            if (board[r][c] == 0) { // Check if the tile is empty (value is 0)
                return true; // There is an empty tile
            }
        }
    }
    return false; // No empty tiles found
}

// Function to randomly place a new tile with a value of 2 on the board
function generateTile() {
    if (!hasEmptyTile()) { // If no empty tiles are left
        return; // No need to generate a new tile
    }
    let found = false; // Flag to indicate if a tile has been placed
    while (!found) { // Keep trying until we find an empty spot
        let r = Math.floor(Math.random() * rows); // Random row index
        let c = Math.floor(Math.random() * columns); // Random column index
        if (board[r][c] == 0) { // Check if the tile at this position is empty
            board[r][c] = 2; // Place a new tile with value 2
            // Get the tile element by its ID
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            // Update the tile's display
            tile.innerHTML = "2";
            tile.classList.add("x2"); // Add a class to style the tile
            found = true; // Tile has been placed
        }
    }
}

// Function to update a tile's display
function updateTile(tile, num) {
    tile.innerText = ""; // Clear the tile's text
    tile.classList.value = ""; // Remove all classes from the tile
    tile.classList.add("tile"); // Add the base class for styling
    if (num > 0) { // If the tile has a number greater than 0
        tile.innerText = num; // Set the tile's text to the number
        if (num <= 4096) { // For numbers up to 4096
            tile.classList.add("x" + num.toString()); // Add a class to style the tile
        } else { // For numbers greater than 4096
            tile.classList.add("x8192"); // Add a class to style the tile
        }
    }
}

// Event listener for keyboard input
document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft") { // If the left arrow key is pressed
        slideLeft(); // Slide tiles to the left
        generateTile(); // Generate a new tile
    } else if (e.code === "ArrowRight") { // If the right arrow key is pressed
        slideRight(); // Slide tiles to the right
        generateTile(); // Generate a new tile
    } else if (e.code === "ArrowUp") { // If the up arrow key is pressed
        slideUp(); // Slide tiles up
        generateTile(); // Generate a new tile
    } else if (e.code === "ArrowDown") { // If the down arrow key is pressed
        slideDown(); // Slide tiles down
        generateTile(); // Generate a new tile
    }
    document.getElementById("score").innerHTML = score; // Update the score display
    if (checkGameOver()) { // Check if the game is over
        displayGameOver(); // Display the game over message
    }
});

// Function to slide tiles to the left
function slideLeft() {
    for (let r = 0; r < rows; r++) { // Loop through each row
        let row = board[r]; // Get the current row
        row = slide(row); // Slide the row
        board[r] = row; // Update the board with the new row
        for (let c = 0; c < columns; c++) { // Loop through each column
            // Get the tile element by its ID
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            // Get the number at this position in the board
            let num = board[r][c];
            // Update the tile's display
            updateTile(tile, num);
        }
    }
}

// Function to slide tiles to the right
function slideRight() {
    for (let r = 0; r < rows; r++) { // Loop through each row
        let row = board[r]; // Get the current row
        row.reverse(); // Reverse the row to reuse slideLeft logic
        row = slide(row); // Slide the reversed row
        row.reverse(); // Reverse the row back to its original order
        board[r] = row; // Update the board with the new row
        for (let c = 0; c < columns; c++) { // Loop through each column
            // Get the tile element by its ID
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            // Get the number at this position in the board
            let num = board[r][c];
            // Update the tile's display
            updateTile(tile, num);
        }
    }
}

// Function to slide tiles up
function slideUp() {
    for (let c = 0; c < columns; c++) { // Loop through each column
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]]; // Get the current column
        row = slide(row); // Slide the column
        for (let r = 0; r < rows; r++) { // Loop through each row
            board[r][c] = row[r]; // Update the board with the new column
            // Get the tile element by its ID
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            // Get the number at this position in the board
            let num = board[r][c];
            // Update the tile's display
            updateTile(tile, num);
        }
    }
}

// Function to slide tiles down
function slideDown() {
    for (let c = 0; c < columns; c++) { // Loop through each column
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]]; // Get the current column
        row.reverse(); // Reverse the row to reuse slideUp logic
        row = slide(row); // Slide the reversed row
        row.reverse(); // Reverse the row back to its original order
        for (let r = 0; r < rows; r++) { // Loop through each row
            board[r][c] = row[r]; // Update the board with the new column
            // Get the tile element by its ID
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            // Get the number at this position in the board
            let num = board[r][c];
            // Update the tile's display
            updateTile(tile, num);
        }
    }
}

// Function to slide a row (or column) in the game
function slide(row) {
    row = filterZero(row); // Remove zeros from the row
    for (let i = 0; i < row.length - 1; i++) { // Loop through each tile in the row
        if (row[i] == row[i + 1]) { // If two adjacent tiles have the same number
            row[i] *= 2; // Double the value of the first tile
            row[i + 1] = 0; // Set the second tile to zero
            score += row[i]; // Add the value to the score
        }
    }
    row = filterZero(row); // Remove zeros from the row again
    while (row.length < columns) { // Fill the row with zeros if necessary
        row.push(0);
    }
    return row; // Return the updated row
}

// Function to remove zeros from a row
function filterZero(row) {
    return row.filter(num => num != 0); // Filter out all zeros
}

// Function to check if the game is over
function checkGameOver() {
    // Check if there are any empty tiles
    if (hasEmptyTile()) {
        return false; // Game is not over if there are empty tiles
    }

    // Check for possible horizontal merges
    for (let r = 0; r < rows; r++) { // Loop through each row
        for (let c = 0; c < columns - 1; c++) { // Loop through each column (except the last one)
            if (board[r][c] == board[r][c + 1]) { // If two adjacent tiles have the same number
                return false; // There are moves left
            }
        }
    }

    // Check for possible vertical merges
    for (let c = 0; c < columns; c++) { // Loop through each column
        for (let r = 0; r < rows - 1; r++) { // Loop through each row (except the last one)
            if (board[r][c] == board[r + 1][c]) { // If two adjacent tiles have the same number
                return false; // There are moves left
            }
        }
    }

    return true; // No moves left
}

// Function to display the "Game Over" message
function displayGameOver() {
    let gameOverMessage = document.createElement("div"); // Create a new div element
    gameOverMessage.id = "game-over"; // Set the ID of the div
    gameOverMessage.classList.add("game-over"); // Add a class for styling
    gameOverMessage.innerText = `Game Over! Final Score: ${score}`; // Set the text of the div
    document.body.appendChild(gameOverMessage); // Append the div to the body
}
