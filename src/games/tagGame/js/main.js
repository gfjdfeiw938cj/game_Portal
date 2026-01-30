import {startGame} from './core/gameLogic'
import{unfinishedGameNotificationWindow} from './rendering/modal'
import{RecordedGame} from './recordGame/previewWinningGame'
import {toggleUIVisibility} from './rendering/modal'
const port = import.meta.env.VITE_PORT || 3000;

const menuContainer = document.querySelector('.menu-container');
const customMap = document.querySelector('.custom-map-btm')
const lvlMenu = document.querySelector('.level-menu')
const buttonsMenu = document.querySelectorAll('.level-btn');

// Обнуляем localStorage
if(window.performance) {
  const urlParams = new URLSearchParams(window.location.search);
  const indexMapRecordGame = urlParams.get('indMap');
  // Смотрим запись победной игры
  if(indexMapRecordGame){
    toggleUIVisibility()
    localStorage.removeItem('objDateLastMove')
    RecordedGame(indexMapRecordGame)
  }
   // Показываем модальное окно для востановление игры после пререзагрузки браузера.
  if(localStorage.getItem('objDateLastMove') !== null){
    unfinishedGameNotificationWindow()
  }
};

buttonsMenu.forEach(button => {
  button.addEventListener('click', (event) => {
    event.stopPropagation()
    const text = button.textContent;
      const match = text.match(/Карта (\d+)x(\d+)/);
      if (match) {
        const matrixSizeHigth = parseInt(match[1], 10);
        const matrixSizeWidth = parseInt(match[2], 10);
          argumentsParameters(matrixSizeHigth, matrixSizeWidth);
        }
    });
});

//                  Создание меню(форма) для выбора размера карты
customMap.addEventListener('click', () => {

  const title = document.querySelector('.game-title')
  title.textContent = 'Свой размер карты'
  // Создаём контейнер формы
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';
  
  // Создаём форму
  const form = document.createElement('form');
  form.id = 'myForm';
  form.setAttribute('aria-labelledby', 'customSizeLabel');
  
  // Группа для поля "Длина (строк)"
  const lengthGroup = document.createElement('div');
  lengthGroup.className = 'input-group';
  
  const lengthLabel = document.createElement('label');
  lengthLabel.htmlFor = 'length-Matrix';
  lengthLabel.textContent = 'Длина (строк):';
  
  const lengthInput = document.createElement('input');
  lengthInput.className = 'panel-Matrix';
  lengthInput.id = 'length-Matrix';
  lengthInput.name = 'sizeMatrix';
  lengthInput.type = 'number';
  lengthInput.min = '2';
  lengthInput.max = '10';
  lengthInput.placeholder = 'от 3 до 10';
  lengthInput.required = true;
  
  lengthGroup.append(lengthLabel, lengthInput);
  
  // Группа для поля "Ширина (столбцов)"
  const widthGroup = document.createElement('div');
  widthGroup.className = 'input-group';
  
  const widthLabel = document.createElement('label');
  widthLabel.htmlFor = 'width-Matrix';
  widthLabel.textContent = 'Ширина (столбцов):';
  
  const widthInput = document.createElement('input');
  widthInput.className = 'panel-Matrix';
  widthInput.id = 'width-Matrix';
  widthInput.name = 'sizeMatrix';
  widthInput.type = 'number';
  widthInput.min = '2';
  widthInput.max = '10';
  widthInput.placeholder = 'от 3 до 10';
  widthInput.required = true;
  
  widthGroup.append(widthLabel, widthInput);
  
  // Группа кнопок
  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'button-group';
  
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'buttonSubmit';
  submitButton.id = 'Sab';
  submitButton.textContent = 'Играть';
  
  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'level-btn';
  backButton.textContent = 'назад в меню';
  backButton.addEventListener('click', () => {
    const currentPath = window.location.pathname;
    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    window.location.href = basePath + 'tagGame.html';
      // window.location.href = `../pages/tagGame.html`;
  }, { once: true });
  
  buttonGroup.append(submitButton, backButton);
  
  // Сборка формы
  form.append(lengthGroup, widthGroup, buttonGroup);
  formContainer.append(form);
  
  // Добавляем в DOM
  lvlMenu.innerHTML = '';
  lvlMenu.append(formContainer);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let [matrixSizeHigth, matrixSizeWidth] = await getData(e.target);
    argumentsParameters(matrixSizeHigth, matrixSizeWidth);
  });
})

async function getData(form) {
  let formData = new FormData(form);
  let arr_parametrs_panel = formData.getAll('sizeMatrix').map(el => Number(el)); 
  return arr_parametrs_panel
}


// Функция для плавного входа в игру после меню.
function argumentsParameters(matrixSizeHigth, matrixSizeWidth){
  menuContainer.addEventListener('transitionend', (event) => {
    event.stopPropagation()
    toggleUIVisibility()
    startGame(matrixSizeHigth, matrixSizeWidth) // Старт игры
  }, { once: true }); //Параметр (once: true) - обработчик сработает только один раз и автоматически удалится




























}
      //                 Делаем не видимым ссылку Назад в меню
  // <div class="icon-Menu">
  //   <a href="../mainMenu.html" class="back-link">← Назад в меню</a>
  // </div>

  //                          Делаем видимым игровое поле
  // <div class="div_container">
  //   <div class="container_сountdown_progress">
  //     <div class="couterGame"></div>
  //     <div class="time_display" id="display">00:00</div>
  //   </div>
  //   <div class="container"></div>
  //   <div class="panel">
  //     <div class="arrow-diag left"></div>
  //     <button id="resetNew" class="reset">Играть заного</button>
  //     <button id="resetNewMap" class="reset">Новая карта</button>
  //     <div class="arrow-diag right"></div>
  //   </div>
  // </div>

   //                         Делаем не видимым игровое меню
  //  <div class="menu-container">
  //   <div class="panel-container">
  //     <h1 class="game-title">Выберите уровень</h1>
  //     <div class="level-menu">
  //       <button type="button" class="level-btn" onclick="argumentsParameters(3, 3)">Карта 3x3</button>
  //       <button type="button" class="level-btn" onclick="argumentsParameters(4, 4)">Карта 4x4</button>
  //       <button type="button" class="level-btn" onclick="argumentsParameters(5, 4)">Карта 5x4</button>
  //       <button type="button" class="level-btn" onclick="argumentsParameters(5, 5)">Карта 5x5</button>
  //       <a href="../mainMenu.html" class="back-link">Назад в меню</a>
  //     </div>
  //   </div>
  // </div>