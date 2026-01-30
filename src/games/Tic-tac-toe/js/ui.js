import {startGame, click} from "./logic";

// Элементы интерфейса
const mainMenu = document.getElementById('main-menu');
const settingsPanel = document.getElementById('settings-panel');
const gameControls = document.getElementById('game-controls');
const boardEl = document.getElementById('board');
const modalEl = document.getElementById('modal');

// Кнопки
const startGameBtn = document.getElementById('start-game-btn');
const exitBtn = document.getElementById('exit-btn')
const backToMenuBtn = document.getElementById('back-to-menu');
const toMenuBtn = document.getElementById('to-menu');
const resetButtons = document.getElementsByClassName('reset');

// Форма настроек
const gameSettingsForm = document.getElementById('game-settings-form');
const boardSizeInput = document.getElementById('board-size');
const firstPlayerSelect = document.getElementById('first-player');

// Обработчики событий
startGameBtn.addEventListener('click', () => {
    mainMenu.classList.add('hidden');
    settingsPanel.classList.remove('hidden');
});

exitBtn.addEventListener('click', () => {
  window.location.href = "../../index.html"
});

backToMenuBtn.addEventListener('click', () => {
    settingsPanel.classList.add('hidden');
    mainMenu.classList.remove('hidden');
});

toMenuBtn.addEventListener('click', () => {
    resetGame();
    mainMenu.classList.remove('hidden');
    gameControls.classList.add('hidden');
    boardEl.classList.add('hidden');
});

gameSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const boardSize = parseInt(boardSizeInput.value);
    const firstPlayer = parseInt(firstPlayerSelect.value);
    
    startGame(boardSize, firstPlayer);
    
    settingsPanel.classList.add('hidden');
    boardEl.classList.remove('hidden');
    gameControls.classList.remove('hidden');
});

for (let btn of resetButtons) {
    btn.addEventListener('click', () => {
        // Скрываем модальное окно, если оно открыто
        if (!modalEl.classList.contains('hidden')) {
            modalEl.classList.add('hidden');
        }
        
        // Перезапускаем игру с текущими настройками
        resetGame();
        startGame(
            parseInt(boardSizeInput.value), 
            parseInt(firstPlayerSelect.value)
        );
        
        // Явно показываем панель управления и игровое поле
        boardEl.classList.remove('hidden');
        gameControls.classList.remove('hidden');
    });
}

boardEl.addEventListener('click', (event) => {
    const targetClasses = event.target.classList;
    const targetData = event.target.dataset;
    
    if (targetClasses.contains('field') && !targetClasses.contains('busy')) {
        click(targetData.row, targetData.col);
    }
});

// Функции управления состоянием
function resetGame() {
    boardEl.innerHTML = '';
    modalEl.classList.add('hidden');
    gameControls.classList.add('hidden');
    boardEl.classList.add('hidden');
}

export function showWinner(winner) {
    const header = modalEl.getElementsByTagName('h2')[0];
    header.textContent = `🍾 Победил игрок №${winner + 1}! 🍾`;
    modalEl.classList.remove('hidden');
}

export function renderBoard(board) {
    const fields = [];
    for (let [i, row] of board.entries()) {
        for (let [j, value] of row.entries()) {
            fields.push(`
                <div class="field ${value ? 'busy' : 'free'}"
                     data-row="${i}"
                     data-col="${j}"
                     style="grid-row:${i + 1};grid-column:${j + 1};"
                >
                    ${value || ''}
                </div>
            `);
        }
    }
    boardEl.innerHTML = fields.join('');
}
