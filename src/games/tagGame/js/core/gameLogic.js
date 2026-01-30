 import {globalGameSettings} from '../config'
 import {victoryNotificationWindow} from '../rendering/modal'
 import {incrementTime} from '../core/timer'
 import {randomNumberMatrix} from '../utils/randomNumberMatrix'
 import {LocalStorageSave} from '../core/storage'
 import {renderMap} from '../rendering/bord'

// Стартовая функция
export function startGame(matrixSizeHigth, matrixSizeWidth) {
  if(globalGameSettings.timerId) clearTimeout(globalGameSettings.timerId);
  globalGameSettings.matrixRandomCells = createMatrix(matrixSizeHigth, matrixSizeWidth);
  LocalStorageSave();
  globalGameSettings.timerId = setInterval(incrementTime, 1000);
  renderMap(globalGameSettings.matrixRandomCells, 0);
}

// Создаем несколько матриц
function createMatrix(height, width) {
  // let arr = [[1,2,3],[4,5,''],[7,8, 6]]
  const maxIndexArrMatrix = height * width; // Размер матрицы
  const emptyCellIndex = Math.floor(Math.random() * maxIndexArrMatrix);// Случайно выбираем место для пустой cell 
 // Шаблон расположения cell на игровом поле. Грид свойства gridTemplateAreas определяет шаблон макета сетки. Пример [""AAA AAA AAA""]
 // let i = 1; // Первое число последовательного числового ряда выигрышной матрицы.
  globalGameSettings.currentNumber = 1;
  globalGameSettings.matrixWinning = Array.from({ length: height }, () => Array.from({ length: width }, () => globalGameSettings.currentNumber === maxIndexArrMatrix ? '': globalGameSettings.currentNumber++)); // [[1,2,3],[4,5,6],[7,8,'']]
  globalGameSettings.matrixRandomCells = randomNumberMatrix(maxIndexArrMatrix, emptyCellIndex, height, width); // Передаем аргументы 1) Размер матрицы 2) Index пустой cell 3) Переменую для записи 4)Высоту 5)Ширину
  // globalGameSettings.matrixRandomCells = arr
  globalGameSettings.matrixClassPattern = globalGameSettings.matrixWinning.map( el => `"${el.map( el => el = 'A').join(" ")}"`).join(''); // Формируем шаблон для грид
  return globalGameSettings.matrixRandomCells;
}

// Двигаем cell по горизонтали или по вертикали. 
// Возвращаем boolean: выбрано ли число по горизонтальной или вертикальной линии от пустой cell.
export function logic({x, y}) {
  x = Number(x); 
  y = Number(y);

  let arrHorizontal = globalGameSettings.matrixRandomCells[y]; 
  let arrVertical = globalGameSettings.matrixRandomCells.map(el => el[x]);
  let newLine
  // Определяем на какой оси находиться пустая клетка. И двигаем выбранную Cell в направление пустой клетки. 
  if(arrHorizontal.includes("")){ // Горизонтальная ось
    let indEmptyСell = arrHorizontal.indexOf('');
    if(indEmptyСell > x){
      newLine = arrHorizontal.copyWithin(indEmptyСell - (indEmptyСell - x - 1), x, indEmptyСell).toSpliced(x, 1, '');
    } else {
      newLine = arrHorizontal.copyWithin(indEmptyСell, indEmptyСell + 1, x + 1).toSpliced(x, 1, '');
    }           
    globalGameSettings.matrixRandomCells[y] = newLine          
    determinantGameConditions(); 
    return false;
  }else if(arrVertical.includes("")){// Вертикальная ось
    let indEmptyСell = arrVertical.indexOf('');
    if(indEmptyСell > y){
      newLine = arrVertical.copyWithin(indEmptyСell - (indEmptyСell - y - 1), y, indEmptyСell).toSpliced(y, 1, '');
    } else {
      newLine = arrVertical.copyWithin(indEmptyСell, indEmptyСell + 1, y + 1 ).toSpliced(y, 1, '');
    }
    globalGameSettings.matrixRandomCells.forEach((el, ind) =>  el[x] = newLine[ind]); 
    determinantGameConditions();                        
    return false;
  }else{
    return true;
  }
}
// Сравниваем актуальную матрицу с выигрышной матрицей. 
// Если она победная, то показываем модальное окно. 
function determinantGameConditions() {
  if(globalGameSettings.matrixRandomCells.toString() === globalGameSettings.matrixWinning.toString()){
    clearTimeout(globalGameSettings.timerId);
    victoryNotificationWindow();
  }
}
