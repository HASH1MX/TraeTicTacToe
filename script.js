document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('[data-cell]');
    const status = document.getElementById('status');
    const restartButton = document.getElementById('restartButton');
    const scoreX = document.getElementById('score-x');
    const scoreO = document.getElementById('score-o');
    const scoreTies = document.getElementById('score-ties');
    let currentPlayer = 'X';
    let gameActive = true;
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let scores = {
        X: 0,
        O: 0,
        ties: 0
    };
    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    function handleClick(index) {
        const cell = cells[index];
        if (gameState[index] !== '' || !gameActive) return;

        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        if (checkWinner()) {
            gameActive = false;
            status.textContent = `Player ${currentPlayer} wins!`;
            scores[currentPlayer]++;
            updateScoreboard();
            return;
        }

        if (checkDraw()) {
            gameActive = false;
            status.textContent = 'Game ended in a draw!';
            scores.ties++;
            updateScoreboard();
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
    };

    function checkWinner() {
        return winningConditions.some((condition, index) => {
            const hasWon = condition.every(index => {
                return gameState[index] === currentPlayer;
            });
            if (hasWon) {
                drawWinningLine(index, condition);
            }
            return hasWon;
        });
    };

    const checkDraw = () => {
        return gameState.every(cell => cell !== '');
    };

    function restartGame() {
        currentPlayer = 'X';
        gameActive = true;
        gameState = ['', '', '', '', '', '', '', '', ''];
        status.textContent = `Player ${currentPlayer}'s turn`;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
        const existingLine = document.querySelector('.winning-line');
        if (existingLine) {
            existingLine.remove();
        }
    };

    function drawWinningLine(index, condition) {
        const existingLine = document.querySelector('.winning-line');
        if (existingLine) {
            existingLine.remove();
        }

        const line = document.createElement('div');
        line.classList.add('winning-line');

        board.style.position = 'relative';
        const cell1 = cells[condition[0]];
        const cell2 = cells[condition[2]];
        const cell1Rect = cell1.getBoundingClientRect();
        const cell2Rect = cell2.getBoundingClientRect();
        const boardRect = board.getBoundingClientRect();

        const startX = cell1Rect.left - boardRect.left + cell1Rect.width / 2;
        const startY = cell1Rect.top - boardRect.top + cell1Rect.height / 2;
        const endX = cell2Rect.left - boardRect.left + cell2Rect.width / 2;
        const endY = cell2Rect.top - boardRect.top + cell2Rect.height / 2;

        const length = Math.sqrt(
            Math.pow(endX - startX, 2) +
            Math.pow(endY - startY, 2)
        );

        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

        line.style.position = 'absolute';
        line.style.width = `${length}px`;
        line.style.left = `${startX}px`;
        line.style.top = `${startY}px`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.transformOrigin = '0 50%';
        line.style.zIndex = '10';
        line.style.pointerEvents = 'none';
        line.style.height = '3px';




        board.appendChild(line);
    }

    function updateScoreboard() {
        scoreX.textContent = scores.X;
        scoreO.textContent = scores.O;
        scoreTies.textContent = scores.ties;
    }

    cells.forEach((cell, index) => cell.addEventListener('click', () => handleClick(index)));
    restartButton.addEventListener('click', restartGame);
});