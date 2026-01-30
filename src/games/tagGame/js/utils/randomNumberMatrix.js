import checkingSolvable from './checkingSolvable'
import {globalGameSettings} from '../config'

export function randomNumberMatrix(maxIndexArrMatrix, indEmptyСell, height, width) {
  globalGameSettings.currentNumber = 0; // Инкремент + ind, для матрицы (defaultedMatrix - массив с уникальными числами, прошедший проверку на решаемость позиций).   
  let numbers = new Set(); 
  while (numbers.size < maxIndexArrMatrix - 1) { // Крутим бесконечный цикл и заполняем Set random числами, пока её размер не будет равен размеру матрицы maxIndexArrMatrix.
    let randomNumber = Math.floor(Math.random() * (maxIndexArrMatrix - 1)) + 1; // Ген рандом числа в диапазоне начиная от 1 до maxIndexArrMatrix.
    numbers.add(randomNumber); // Добавляем в Set числа и проверяем на уникальность. Не уникальные значения убираем.
  }
  numbers = Array.from(numbers); // Конвертируем new Set в настроящий массив []
  let defaultedMatrix = checkingSolvable(numbers, indEmptyСell, height, width); //Проверяем массив уникальных случайных чисел на решаемость позиции. 1) Массив случайных чисел.2) индекс пустой cell 3) высота матрицы 4) ширина матрицы
  return Array.from({ length: height }, () => Array.from({ length: width }, () => defaultedMatrix[globalGameSettings.currentNumber++])); // Создаем новый двухмерный массив [[],[],[]]
}

 