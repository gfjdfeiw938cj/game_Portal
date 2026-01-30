import { calcHealthLevel, calcTileType } from './utils';

export default class GamePlay {
  constructor() {
    this.boardSize = 8;
    this.container = null;
    this.popup = null;
    this.boardEl = null; // Поле
    this.cells = []; // Элементы поля
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  bindPopup(popup) {
    if (!(popup instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.popup = popup;
  }

  /**
   * Draws boardEl with specific theme
   *
   * @param theme
   */
  drawUi(theme) {
    this.checkBinding();

    this.container.innerHTML = `
      <div class="controls">
        <button data-id="action-restart" class="btn">New Game</button>
        <button data-id="action-save" class="btn">Save Game</button>
        <button data-id="action-load" class="btn">Load Game</button>
        <button data-id="action-exit" class="btn">Exit</button>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"></div>
      </div>
    `;

    this.newGameEl = this.container.querySelector('[data-id=action-restart]');
    this.saveGameEl = this.container.querySelector('[data-id=action-save]');
    this.loadGameEl = this.container.querySelector('[data-id=action-load]');
    this.exitEl = this.container.querySelector('[data-id=action-exit]');
    this.popupCloseButton = this.popup.querySelector('.popup__button');

    this.newGameEl.addEventListener('click', (event) => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', (event) => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', (event) => this.onLoadGameClick(event));
    this.exitEl.addEventListener('click', () => window.location.href = "../../index.html");

    this.popupCloseButton.addEventListener('click', () => this.closePopup());

    this.boardEl = this.container.querySelector('[data-id=board]');

    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
      cellEl.addEventListener('mouseenter', (event) => this.onCellEnter(event)); //Привязываем события mouseenter при наведении курсора на элемент для всех 63 клеток карты 
      cellEl.addEventListener('mouseleave', (event) => this.onCellLeave(event)); //Привязываем события mouseleave при покидания курсора с элемент для всех 63 клеток карты 
      cellEl.addEventListener('click', (event) => this.onCellClick(event));
      this.boardEl.appendChild(cellEl);
    }
     
    this.cells = Array.from(this.boardEl.children);
  }

  /**
   * Draws positions (with chars) on boardEl
   *
   * @param positions array of PositionedCharacter objects
   */
  redrawPositions(positions) {
    for (const cell of this.cells) { // Добавляем к каждому дом элементу пустую строку <div class="cell map-tile map-tile-top-left">''</div>
      cell.innerHTML = '';
    }

    for (const position of positions) {
      const cellEl = this.boardEl.children[position.position]; //из обьета positions берем позицию игрока где он должен быть на карте и возрашаем элемент Dom 
      const charEl = document.createElement('div');
      charEl.classList.add('character', position.character.type); //Добавляем классы к эементу cellEl 'character' и имя класса игры 

      const healthEl = document.createElement('div');
      healthEl.classList.add('health-level');

      const healthIndicatorEl = document.createElement('div');
      healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(position.character.health)}`); // передаем свойсво здоровье в функцию calcHealthLevel() и возрашам индикатор здоровье у героя
      healthIndicatorEl.style.width = `${position.character.health}%`; //Добавляем в атрибут style свойсвто width в % отнош. состояние жизни героя 
      healthEl.appendChild(healthIndicatorEl); 

      charEl.appendChild(healthEl);
      cellEl.appendChild(charEl);
      //                                                       Создаем такую структуру 
      //<div class="cell map-tile map-tile-left">
      //   <div class="character bowman">
      //      <div class="health-level">
      //          <div class="health-level-indicator health-level-indicator-high" style="width: 100%;">
      //      </div>
      //   </div>
      //</div>
  
    }
  }

  // Добавляет функцию обработки события в массив. Функция для События "mouseenter" применяется для каждой из 63 ячеек игрового поля. 
  addCellEnterListener(callback) {
    this.cellEnterListeners.push(callback);
  }

 // Добавляет функцию обработки события в массив. Функция для События "mouseleave" применяется для каждой из 63 ячеек  игрового поля. 
  addCellLeaveListener(callback) {
    this.cellLeaveListeners.push(callback);
  }

 // Добавляет функцию обработки события в массив. Функция для События "сlick" применяется для каждой из 63 ячеек игрового поля.
  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

 // Добавляет функцию обработки события в массив. Функция для События "сlick" по кнопки NewGame
  addNewGameListener(callback) {
    this.newGameListeners.push(callback);
  }

 // Добавляет функцию обработки события в массив. Функция для События "сlick" по кнопки SaveGame
  addSaveGameListener(callback) {
    this.saveGameListeners.push(callback);
  }

 // Добавляет функцию обработки события в массив. Функция для События "сlick" по кнопки LoadGame
  addLoadGameListener(callback) {
    this.loadGameListeners.push(callback);
  }

  //Вынесенная функция для снегерированного События "mouseenter" при наведении курсора на элемент
  onCellEnter(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget); // Определяем номер ячейки грового поля
    this.cellEnterListeners.forEach((o) => o.call(null, index)); //Передаем номер ячейки грового поля в колбэк функцию
  }

 //Вынесенная функция для снегерированного События "mouseleave" при покидания курсора с элемента
  onCellLeave(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget); // Определяем номер ячейки грового поля
    this.cellLeaveListeners.forEach((o) => o.call(null, index)); // Передаем номер ячейки грового поля в колбэк функцию
  }

  //Вынесенная функция для снегерированного События "Click" на нажатия на элемент 
  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget); // Определяем номер ячейки грового поля
    this.cellClickListeners.forEach((o) => o.call(null, index)); // Передаем номер ячейки грового поля в колбэк функцию
  }

  //Вынесенная функция для снегерированного События "Click" при нажатие кнопки NewGame(начать новую игру)
  onNewGameClick(event) {
    event.preventDefault();
    this.newGameListeners.forEach((o) => o.call(null));
  }

  //Вынесенная функция для снегерированного События "Click" при нажатие кнопки SaveGame(сохранить игру)
  onSaveGameClick(event) {
    event.preventDefault();
    this.saveGameListeners.forEach((o) => o.call(null));
  }

  //Вынесенная функция для снегерированного События "Click" при нажатие кнопки LoadGame(загрузить игру)
  onLoadGameClick(event) {
    event.preventDefault();
    this.loadGameListeners.forEach((o) => o.call(null));
  }

  static showError(message) {
    alert(message);
  }

  static showMessage(message) {
    alert(message);
  }

  selectCell(index, color = 'yellow') { // Меняем подсветку на игр. поле
    this.deselectCell(index);
    this.cells[index].classList.add('selected', `selected-${color}`);
  }

  //Удаляем из выбранного элемента класс 'selected' котороый указывает подсвеченого игрока и поля для хода(желтого и зеленрого цвета) и проверяем есть ли в списке классов у каждого элемента в начале строки строка "selected" 
  deselectCell(index) {  
    const cell = this.cells[index];
    cell.classList.remove(...Array.from(cell.classList)
      .filter((o) => o.startsWith('selected')));
  }

 // Записываем в Атрибут title на message (message это сплывающее окно по наведению с информацией о персонаже "пример(🎖 1 ⚔ 25 🛡 25 ❤ 100)")
  showCellTooltip(message, index) {
    this.cells[index].title = message;
  }

  //Убираем сплывающие окно "пример(🎖 1 ⚔ 25 🛡 25 ❤ 100)". Атрибуте title задает всплывающую подсказку для элемента, которая будет появляться по наведению мышкой на элемент
  hideCellTooltip(index) {
    this.cells[index].title = '';
  }

  showDamage(index, damage) {
    return new Promise((resolve) => {
      const cell = this.cells[index];
      const damageEl = document.createElement('span');
      damageEl.textContent = damage;
      damageEl.classList.add('damage');
      cell.appendChild(damageEl);
      damageEl.addEventListener('animationend', () => {
        cell.removeChild(damageEl);
        resolve();
      });
    });
  }

  //Меня вид курсора мыши 
  setCursor(cursor) {
    this.boardEl.style.cursor = cursor;
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM'); // нет свойства this.container(Игровой процесс не привязан к DOM)
    }
  }

  // Закрывает Popup
  closePopup() {
    this.popup.classList.add('popup_hidden');
  }

  // Показывает Popup
  showPopup(message) {
    const title = this.popup.querySelector('.popup__title');
    title.textContent = message;
    this.popup.classList.remove('popup_hidden');
  }
}
