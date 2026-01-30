export default function checkingSolvable(arrNumber, indEmptyСell, heightMatrix, widthMatrix) { // arrNumber = массив случ. чисел, indEmptyСell = пустая клетка
    let twoNumbersInversion // Хранит массив с пару инверсий чисел 
   // Считает количество инверсий. Получаем число инверсий.
    function countInversions(arr){
      if(arr.length <= 1) return 0; // Если массив пустой 
        
      const mid = Math.floor(arr.length / 2); // Получаем число из середины arr
      const left = arr.slice(0, mid); // Получаем массив всех чисел что слева от середины.
      const right = arr.slice(mid); // Получаем массив всех чисел что справа от середины. 
      // Суммируем при помощи рекурсии 
      let inversions = countInversions(left) + countInversions(right);
        
      let i = 0, j = 0, k = 0;
      while(i < left.length && j < right.length){ 
        if(left[i] <= right[j]) { // Если левый массив меньше правого, то нет инверсия 
          arr[k++] = left[i++]; 
        }else{ // // Если левый массив больше правого, то есть инверсии, получаем их.
          arr[k++] = right[j++]; 
          // Создаем первую пару чисел, создающую инверсию (для коррекции)
          if(!twoNumbersInversion && right.length > 1 && left.length > 1){
            twoNumbersInversion = [right[0], left[1]];
          } 

          inversions += left.length - i; //// Все оставшиеся элементы в массиве в left > right[j] — каждая такая пара даёт инверсию
        }
      }
      // Записываем в arr оставшиеся элементы из left (если есть)
      while(i < left.length) arr[k++] = left[i++];
       // Записываем в arr элементы из right (если есть)
      while(j < right.length) arr[k++] = right[j++];
        
      return inversions; // Возвращаем общее число инверсий
    }
    // Создаём копию массива, чтобы не изменять исходный, и считаем инверсии
    const inversions = countInversions(arrNumber.slice());
      // Случай 1: ширина поля нечётная 
    if (widthMatrix % 2 === 1){
      if(inversions % 2 === 0){
        arrNumber.splice(indEmptyСell, 0, '');
        return arrNumber;
      } else { // Исправляем нечётное число инверсий:
       // меняем местами пару чисел чтобы сделать 
        arrNumber[arrNumber.indexOf(twoNumbersInversion[1])] = twoNumbersInversion[0];
        arrNumber[arrNumber.lastIndexOf(twoNumbersInversion[0])] = twoNumbersInversion[1];
        arrNumber.splice(indEmptyСell, 0, ''); // Вставляем пустую клетку и возвращаем исправленный массив
        return arrNumber;
      }
    // Случай 2: ширина поля чётная 
    }else{
      const heightEmptyСell = heightMatrix - Math.floor(indEmptyСell / widthMatrix) // Высота пустой клетки. Отсчет идет начиная с 1 и с низу в верх 
      const inversionsEven = inversions % 2 === 0;
      const zeroRowOdd = heightEmptyСell % 2 === 1;
      
        if(inversionsEven === zeroRowOdd){
          arrNumber.splice(indEmptyСell, 0, '');
          return arrNumber;
        }else if(zeroRowOdd === false){ //нечетная строка
          if(arrNumber.length - heightEmptyСell === 0) arrNumber.splice(indEmptyСell + widthMatrix, 0, '');
          else arrNumber.splice(indEmptyСell - widthMatrix, 0, '');
            return arrNumber;
        }else { //четная строка
          if(heightEmptyСell === 1) arrNumber.splice(indEmptyСell - widthMatrix, 0, '');
          arrNumber.splice(indEmptyСell + widthMatrix, 0, '');
          return arrNumber;
        } 
    }
}