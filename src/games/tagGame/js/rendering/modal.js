import {globalGameSettings} from '../config'
import {removeCellBord, renderMap} from '../rendering/bord'
import {LocalStorageGet, LocalStorageGetLastMove, LocalStorageSaveVictoryGame} from '../core/storage'
import {updateDisplay, incrementTime} from '../core/timer'
const port = import.meta.env.VITE_PORT || 3000;

let modal = document.querySelector('.hidden'); 
let modalWindow = modal.children[0]
let startGameNewBtn = document.querySelector('#reset-New');
let startGameNewMapBtn = document.querySelector('#reset-New-Map');
let iconMenu = document.querySelector('.icon-Menu');
let divContainer = document.querySelector('.div-container');
let menuContainer = document.querySelector('.menu-container');

startGameNewMapBtn.addEventListener('click', function(event) {
  event.stopPropagation()
  eventAppearanceWindowLevel(false, false)
});

startGameNewBtn.addEventListener('click', function(event) {
  event.stopPropagation()
  eventAppearanceWindowLevel(false, true)
});

iconMenu.addEventListener('click',function(event) {
  event.stopPropagation()
  clearStorage(true)
});

// Функция обрабатывающая сразу две кнопки: 
// "Начать заного" - Не обнуляем localStorage с записями ходов. Храним их для 
// "Новая игра" 
function eventAppearanceWindowLevel(hideWindow, startGame) {
  document.getElementById('display').textContent = 'Время: 00:00'; 
  globalGameSettings.seconds = 0;
  globalGameSettings.minutes = 0;
  removeCellBord();  // Очистка игрового поля
  // Управление видимостью модального окна
  if (hideWindow) modal.classList.add('hidden');
  if (startGame) {
    // Запуск новой игры с начальным состоянием из хранилища
    let {gameSettingsStorage} = LocalStorageGetLastMove();
    globalGameSettings.restoreInitialSettings(
      gameSettingsStorage.matrixWinning,
      gameSettingsStorage.matrixClassPattern,
      gameSettingsStorage.timerId,
      gameSettingsStorage.fontSizeCell
    )
    globalGameSettings.matrixRandomCells = LocalStorageGet(true, false);
    renderMap(globalGameSettings.matrixRandomCells, 0);
    clearStorage(false)
  } else {
    // Возврат в меню
    clearTimeout(globalGameSettings.timerId);
    globalGameSettings.fontSizeCell = '0px'
    clearStorage(true);
    toggleUIVisibility()
    const currentPath = window.location.pathname;
    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    window.location.href = basePath + 'tagGame.html';
  }
};

// Модальное окно с сообщением о победе.
export function victoryNotificationWindow(){
  const now = new Date();
  let victoryTitle = modalWindow.children[0]
  let modalButtons = modalWindow.children[1]
  let arrTime = updateDisplay();
  LocalStorageSaveVictoryGame( globalGameSettings.localStorageCouter,
                               arrTime,
                               globalGameSettings.matrixWinning,
                               globalGameSettings.matrixClassPattern,
                               now.toLocaleString('ru-RU')
  );

  victoryTitle.innerHTML = `<h2>Победа!</h2>
                            <div class="modal-content">
                            <div>Всего ходов: <strong>${globalGameSettings.localStorageCouter}</strong></div>
                            <div>За время: <strong>${arrTime[1]}:${arrTime[0]}</strong></div>`;
  modalButtons.innerHTML = `<button class="reset-Victory">Играть еще</button>`;

  modalButtons.children[0].addEventListener('click', function(event) {
    event.stopPropagation();
    eventAppearanceWindowLevel(true, false, 'icon-hidden');
  });
  
  modal.classList.remove('hidden');
  clearStorage(false)
};
// Модальное окно о незаконченной игре после перезагрузки браузера.
export function unfinishedGameNotificationWindow() {
  let victoryTitle = modalWindow.children[0]
  let modalButtons = modalWindow.children[1]

  //document.getElementById('display').textContent = 'Время: 00:00'; 
  modal.classList.remove('hidden');

  victoryTitle.innerHTML = `
    <h2 class="modal-title">Вы не закончили игру</h2>
    <p class="modal-text">Хотите начать заново или продолжить?</p>
  `
  modalButtons.innerHTML = `
    <button id="сontinue-Game" class="reset">Продолжить</button>
    <button id="start-Game" class="reset">Назад в меню</button>
  `
  Array.from(modalButtons.children).forEach(Button => {
    Button.addEventListener('click', function(event){
      event.stopPropagation()
      // Продолжить игру
      if(event.target.id === "сontinue-Game"){ 
        let{map, gameSettingsStorage} = LocalStorageGetLastMove();
        globalGameSettings.writeStorageSettings(gameSettingsStorage)
        globalGameSettings.timerId = setInterval(incrementTime, 1000);
        modal.classList.add('hidden'); 
        toggleUIVisibility()
        removeCellBord(); 
        renderMap(map, gameSettingsStorage.localStorageCouter)
        // Новая игра
      }else{
        globalGameSettings.startSettings()
        clearStorage(true)
        const currentPath = window.location.pathname;
        const newPath = currentPath.replace(/\/[^/]+\/[^/]+$/, '') + '/mainMenu.html';
        window.location.href = newPath;
      }  
    })
  }) 
}
// Удаляем только записи ходов 
function clearStorage(BooleanDellMap) {
  if(BooleanDellMap){
    localStorage.removeItem('map');
    localStorage.removeItem('objDateLastMove');
  }else{
    localStorage.removeItem('objDateLastMove');
  }
}

export function toggleUIVisibility(){
  menuContainer.classList.toggle('menu-hidden') // Делаем не видимым игровое меню и .display = 'none' .opacity = 0; // устанавливает уровень прозрачности элемента равному 0.           
  divContainer.classList.toggle('div-container-visible')// Делаем не видимым игровое поле .display = 'flex'
  iconMenu.classList.toggle('icon-hidden') // Делаем видимы иконку выхода в главного меню.
  // if(BooleanVisibleUI) {
  //   menuContainer.classList.remove('menu-hidden') // Делаем видимым игровое меню и .display = 'none' .opacity = 0; // устанавливает уровень прозрачности элемента равному 0.           
  //   divContainer.classList.remove('div-container-visible')// Делаем видимым игровое поле .display = 'flex'
  //   iconMenu.classList.remove('icon-hidden') // Делаем не видимым иконку для выхода в главное веню
  // }else{
  //   menuContainer.classList.add('menu-hidden') // Делаем не видимым игровое меню и .display = 'none' .opacity = 0; // устанавливает уровень прозрачности элемента равному 0.           
  //   divContainer.classList.add('div-container-visible')// Делаем не видимым игровое поле .display = 'flex'
  //   iconMenu.classList.add('icon-hidden') // Делаем видимы иконку выхода в главного меню.
  // }
}

// // как в vite ванила js при запуске div(сервер) можно перейти на другую страницу не используя html



