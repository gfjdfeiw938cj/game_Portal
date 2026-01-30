import {renderMap, removeCellBord} from '../rendering/bord'
// let renderMap 
// let removeCellBordFunc
import {globalGameSettings} from '../config'

// if (window.location.pathname.includes('/tagGame.html/')){
//   let { renderMap, removeCellBord } = await import('../rendering/bord');
//   renderMap = renderMap
//   removeCellBordFunc = removeCellBord
// }

let arrowDiags = document.querySelectorAll('.arrow-diag');

arrowDiags.forEach(arrowDiag => {
  arrowDiag.addEventListener('click', function(event) {
    event.stopPropagation()
    const history = JSON.parse(localStorage.getItem('map')) || [];

    if (event.target.classList[1] === 'left') {
      // Стрелка назад: уменьшаем индекс, если возможно
      if(globalGameSettings.localStorageCouter > 0) {
        globalGameSettings.localStorageCouter -= 1;
        globalGameSettings.couterGame = globalGameSettings.localStorageCouter;
        removeCellBord();
        renderMap(
          globalGameSettings.matrixRandomCells = LocalStorageGet(false, true),
          globalGameSettings.couterGame
        );
      }
    } else {
      // Стрелка вперёд: увеличиваем индекс, если возможно
      if (globalGameSettings.localStorageCouter < history.length - 1) {
        globalGameSettings.localStorageCouter += 1;
        globalGameSettings.couterGame = globalGameSettings.localStorageCouter;
        removeCellBord();
        renderMap(
          globalGameSettings.matrixRandomCells = LocalStorageGet(false, true),
          globalGameSettings.couterGame
        );
      }
    }
  });
});

export function LocalStorageSave() {
  const history = JSON.parse(localStorage.getItem('map')) || [];
  // const saveLastMove = JSON.parse(localStorage.getItem('dateLastMove')) || [];
  
  // Первое сохранение (история пуста)
  if (history.length === 0) {
    localStorage.setItem('map', JSON.stringify([globalGameSettings.matrixRandomCells]));
    globalGameSettings.localStorageCouter = 0;
    globalGameSettings.couterGame = 0;
    // Сохраняем данные об игре: для востановление игры после пререзагрузки браузера.
    LocalStorageSaveLastMove()
    return;
  }

  // Ветвление: новый ход после отката
  if (globalGameSettings.clearLocalStorage) {
    // Обрезаем историю до текущего индекса + добавляем новое состояние
    const newHistory = history.slice(0, globalGameSettings.localStorageCouter + 1);
    newHistory.push(globalGameSettings.matrixRandomCells);
    // localStorage.setItem('map', JSON.stringify([...[JSON.parse(localStorage.getItem('map'))[localStorageCouter]], matrixRandomCells]))
    // Записываем обрезанную историю
    localStorage.setItem('map', JSON.stringify(newHistory));

    // Обновляем индексы: они равны длине новой истории минус 1
    globalGameSettings.localStorageCouter = newHistory.length - 1;
    globalGameSettings.couterGame = globalGameSettings.localStorageCouter;
    
    // Сбрасываем флаг ветвления
    globalGameSettings.clearLocalStorage = false;
  // Сохраняем данные об игре: для востановление игры после пререзагрузки браузера.
    LocalStorageSaveLastMove()
    return;
  }

  // Обычный ход: добавляем новое состояние в конец
  history.push(globalGameSettings.matrixRandomCells);
  localStorage.setItem('map', JSON.stringify(history));

  // Обновляем индексы
  globalGameSettings.localStorageCouter = history.length - 1;
  globalGameSettings.couterGame = globalGameSettings.localStorageCouter;

  // Сохраняем данные об игре: для востановление игры после пререзагрузки браузера.
  LocalStorageSaveLastMove()
}

export function LocalStorageGet(startGame, arrowDiag) {
  const history = JSON.parse(localStorage.getItem('map')) || [];
  globalGameSettings.clearLocalStorage = true;
  if (startGame) {
    return history[0] || null;
  }

  if (arrowDiag) {
    return history[globalGameSettings.localStorageCouter] || null;
  } else {
    return history[history.length - 1] || null;
  }
}

// Запись в LocalStorage обьект с настройкаими игры для для востановление игры после пререзагрузки браузера.
function LocalStorageSaveLastMove(){
  localStorage.setItem('objDateLastMove', JSON.stringify(globalGameSettings));
}

// Пеередаем данные arr все ходов и его конфигурациионные настройки в modal
// для востановление игры после пререзагрузки браузера.
export function LocalStorageGetLastMove(){
  const history = JSON.parse(localStorage.getItem('map')) || [];
  return {
    gameSettingsStorage: JSON.parse(localStorage.getItem('objDateLastMove')) || {},
    map: history[history.length - 1] || null,
  }
}

// Запись Победной игры 
export function LocalStorageSaveVictoryGame(couterMove, arrTime, matrixWinning, matrixClassPattern, date) {
  const history = JSON.parse(localStorage.getItem('objVictoryGame')) || [];

  const objVictoryGame = {
    GameSettings: JSON.parse(localStorage.getItem('map')) || [],
    time: `${arrTime[1]}:${arrTime[0]}`,
    couterMove: couterMove,
    matrixWinning: matrixWinning,
    matrixClassPattern: matrixClassPattern,
    date: date
  }

  if(history.length === 0){
    localStorage.setItem('objVictoryGame', JSON.stringify([objVictoryGame]));    
    return
  }
  
  history.push(objVictoryGame);
  localStorage.setItem('objVictoryGame', JSON.stringify(history));

}

export function LocalStorageGetVictoryGame(){
  return JSON.parse(localStorage.getItem('objVictoryGame')) || []
}