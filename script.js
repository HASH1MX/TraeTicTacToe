document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('[data-cell]');
    const status = document.getElementById('status');
    const restartButton = document.getElementById('restartButton');
    const scoreX = document.getElementById('score-x');
    const scoreO = document.getElementById('score-o');
    const scoreTies = document.getElementById('score-ties');
    const playerXName = document.getElementById('player-x-name');
    const playerOName = document.getElementById('player-o-name');
    const playerNameModal = document.getElementById('playerNameModal');
    const startGameButton = document.getElementById('startGameButton');
    const player1NameInput = document.getElementById('player1Name');
    const player2NameInput = document.getElementById('player2Name');
    const healthX = document.getElementById('health-x');
    const healthO = document.getElementById('health-o');
    const healthXText = document.getElementById('health-x-text');
    const healthOText = document.getElementById('health-o-text');
    let currentPlayer = 'X';
    let gameActive = true;
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let scores = {
        X: 0,
        O: 0,
        ties: 0
    };
    let health = {
        X: 10,
        O: 10
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
            const winnerName = currentPlayer === 'X' ? player1Name : player2Name;
            status.textContent = `${winnerName} wins!`;
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
        updateStatus();
    };

    function updateHealthBars() {
        healthX.style.width = `${(health.X / 10) * 100}%`;
        healthO.style.width = `${(health.O / 10) * 100}%`;
        healthXText.textContent = `${health.X} HP`;
        healthOText.textContent = `${health.O} HP`;
    }

    function checkWinner() {
        return winningConditions.some((condition, index) => {
            const hasWon = condition.every(index => {
                return gameState[index] === currentPlayer;
            });
            if (hasWon) {
                const line = document.createElement('div');
                line.className = 'winning-line';
                const board = document.getElementById('board');
                const cells = document.querySelectorAll('.cell');
                const startCell = cells[condition[0]].getBoundingClientRect();
                const endCell = cells[condition[2]].getBoundingClientRect();
                const boardRect = board.getBoundingClientRect();
                
                const startX = startCell.left + (startCell.width / 2) - boardRect.left;
                const startY = startCell.top + (startCell.height / 2) - boardRect.top;
                const endX = endCell.left + (endCell.width / 2) - boardRect.left;
                const endY = endCell.top + (endCell.height / 2) - boardRect.top;
                
                line.style.position = 'absolute';
                line.style.zIndex = '1';
                
                const length = Math.sqrt(
                    Math.pow(endX - startX, 2) +
                    Math.pow(endY - startY, 2)
                );
                
                const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
                
                line.style.width = `${length}px`;
                line.style.left = `${startX}px`;
                line.style.top = `${startY}px`;
                line.style.transformOrigin = 'left';
                line.style.transform = `rotate(${angle}deg)`;
                
                board.appendChild(line);

                // Reduce opponent's health
                const opponent = currentPlayer === 'X' ? 'O' : 'X';
                health[opponent]--;
                updateHealthBars();

                // Check if opponent's health reached 0
                if (health[opponent] === 0) {
                    const winnerName = currentPlayer === 'X' ? player1Name : player2Name;
                    status.textContent = `Game Over - ${winnerName} Wins!`;
                    gameActive = false;
                    return true;
                }
            }
            return hasWon;
        });
    };

    const checkDraw = () => {
        return gameState.every(cell => cell !== '');
    };

    let player1Name = '';
    let player2Name = '';

    function updateStatus() {
        const currentPlayerName = currentPlayer === 'X' ? player1Name : player2Name;
        status.textContent = `${currentPlayerName}'s turn`;
    }

    function nextRound() {
        currentPlayer = 'X';
        gameActive = true;
        gameState = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
        const existingLine = document.querySelector('.winning-line');
        if (existingLine) {
            existingLine.remove();
        }
        updateStatus();
    }

    function restartGame() {
        currentPlayer = 'X';
        gameActive = true;
        gameState = ['', '', '', '', '', '', '', '', ''];
        health = {
            X: 10,
            O: 10
        };
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
        const existingLine = document.querySelector('.winning-line');
        if (existingLine) {
            existingLine.remove();
        }
        updateHealthBars();
        updateStatus();
    }

    startGameButton.addEventListener('click', () => {
        const p1Name = player1NameInput.value.trim();
        const p2Name = player2NameInput.value.trim();
        
        if (p1Name && p2Name) {
            player1Name = p1Name;
            player2Name = p2Name;
            playerNameModal.style.display = 'none';
            playerXName.textContent = player1Name;
            playerOName.textContent = player2Name;
            updateStatus();
        }
    });

    cells.forEach((cell, index) => cell.addEventListener('click', () => handleClick(index)));
    restartButton.addEventListener('click', restartGame);
    nextRoundButton.addEventListener('click', nextRound);
});