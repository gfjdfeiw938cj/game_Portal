import {renderBoard, showWinner} from "./ui";

let activePlayer;
let matrixSize;
let matrix;
let symbolFontSize; 
let playersArr = ['x', 'o'];

export function startGame(size, firstPlayer) {
    matrixSize = size;
    activePlayer = firstPlayer;
    
    matrix = createMatrix(matrixSize);
    renderBoard(matrix);
    
    // Вычисляем размер шрифта для символов игроков
    const fieldParams = document.querySelector('.field');
    if (fieldParams) {
        symbolFontSize = Math.floor(fieldParams.clientWidth * 0.8);
    }
}

function createMatrix(size) {
    return Array(size).fill().map(() => Array(size).fill(""));
}

export function click(row, column) {
    // Записываем символ текущего игрока в выбранную ячейку
    matrix[row][column] = playersArr[activePlayer];
    
    // Перерисовываем игровое поле
    renderBoard(matrix);
    
    // Обновляем размер шрифта для всех занятых ячеек
    const busyFields = document.querySelectorAll('.field.busy');
    busyFields.forEach(field => {
        field.style.fontSize = `${symbolFontSize}px`;
    });
    
    // Проверяем, есть ли победитель
    if (hasWinner(matrix, activePlayer)) {
        showWinner(activePlayer);
    } else {
        // Передаём ход следующему игроку (0 ↔ 1)
        activePlayer = activePlayer ^ 1;
    }
}

function hasWinner(matrix, player) {
    const sign = playersArr[player]; // Символ игрока ('x' или 'o')
    const size = matrix.length;     // Размер поля
    
    // Проверка строк: все ячейки в строке равны символу игрока
    for (let row = 0; row < size; row++) {
        if (matrix[row].every(cell => cell === sign)) {
            return true;
        }
    }
    
    // Проверка столбцов: все ячейки в столбце равны символу игрока
    for (let col = 0; col < size; col++) {
        if (matrix.every(row => row[col] === sign)) {
            return true;
        }
    }
    
    // Проверка главной диагонали (слева сверху направо вниз)
    if (matrix.every((row, i) => row[i] === sign)) {
        return true;
    }
    
    // Проверка побочной диагонали (справа сверху налево вниз)
    if (matrix.every((row, i) => row[size - 1 - i] === sign)) {
        return true;
    }
    
    // Если ни одно условие победы не выполнено
    return false;
}
