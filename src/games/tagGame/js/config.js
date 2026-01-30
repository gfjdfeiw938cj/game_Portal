export const globalGameSettings = {
  pause: false,
  matrixRandomCells: [], // Используется как шаблон для отрисовки карты c рандомно расставленными Cell на ней. 
  matrixClassPattern: [], // Создаём для грид шаблон для разных рамеров карты grid-template-areas:[""A A A","A A A","A A A""] 
  matrixWinning: [], // Выигрышная матрица. Используется для сравнения.
  localStorageCouter: 0, // Индекс текущего состояния в localStorage
  seconds: 0,
  minutes: 0,
  timerId: '', // Индификатор PID для остановки таймера
  fontSizeCell: '0px',
  clearLocalStorage: false, // Флаг ветвления: изменяем сотояние когда переключаемся со стрелок на поле. Для обрезания состояний ходов.
  currentNumber: 1, // Счётчик ходов

  startSettings(){
    this.pause = false,
    this.matrixRandomCells = [],
    this.matrixClassPattern = [],
    this.matrixWinning = [],
    this.localStorageCouter = 0,
    this.seconds = 0,
    this.minutes = 0,
    this.timerId = '',
    this.fontSizeCell = '0px',
    this.clearLocalStorage = false,
    this.currentNumber = 1
  },

  restoreInitialSettings(matrixWinning, matrixClassPattern, timerId, fontSizeCell){
    this.pause = false,
    this.matrixRandomCells = [],
    this.matrixClassPattern = matrixClassPattern,
    this.matrixWinning = matrixWinning,
    this.localStorageCouter = 0,
    this.seconds = 0,
    this.minutes = 0,
    this.timerId = timerId,
    this.fontSizeCell = fontSizeCell,
    this.clearLocalStorage = false,
    this.currentNumber = 1
  },
  
  writeStorageSettings(GameSettings){
    this.pause = GameSettings.pause,
    this.matrixRandomCells = GameSettings.matrixRandomCells,
    this.matrixClassPattern = GameSettings.matrixClassPattern,
    this.matrixWinning = GameSettings.matrixWinning,
    this.localStorageCouter = GameSettings.localStorageCouter,
    this.seconds = GameSettings.seconds,
    this.minutes = GameSettings.minutes,
    this.timerId = GameSettings.timerId,
    this.fontSizeCell = GameSettings.fontSizeCell,
    this.clearLocalStorage = GameSettings.clearLocalStorage,
    this.currentNumber = GameSettings.currentNumber
  }
};

// let matrixRandomCells; // Сгенерированная рендомно игровая матрица. Двух мерный массив. Используеться как шаблон для отрисовки в renderMap()
// let couterGame = 0; // Счётчик ходов
// let localStorageCouter = 0; // Индекс текущего состояния в localStorage
// let seconds = 0; // Счётчик секунд
// let minutes = 0; // Счётчик минут
// let arrWinningMatrix; // Выигрышная матрица. Используется для сравнения. Двухмерный массив из возрастающих последовательных чисел. Пример для 3x3 [[1,2,3],[4,5,6],[7,8,'']]
// let timerId; // Индификатор PID для остановки таймера
// let clearLocalStorage = false; // Флаг ветвления: изменяем сотояние когда переключаемся со стрелок на поле. Для обрезания состояний ходов.
// import { AppConfig } from '../config';
