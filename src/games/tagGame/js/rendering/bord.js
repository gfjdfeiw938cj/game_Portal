import {logic} from '../core/gameLogic'
import {globalGameSettings} from '../config'
import {LocalStorageSave} from '../core/storage'
import {RecordedGame} from '../recordGame/previewWinningGame'

let containerBord = document.querySelector('.container');
let couterGameElemen = document.querySelector('.couter-Game');
let panelBtn = document.querySelector('.panel')

containerBord.addEventListener('click', function (event){
  event.stopPropagation()
  if(globalGameSettings.pause) return; 
  if(event.target.innerHTML === '' || logic(event.target.dataset)) return
  LocalStorageSave()
  removeCellBord()
  renderMap(globalGameSettings.matrixRandomCells, globalGameSettings.couterGame)
});

// Отрисовываем карту 
export function renderMap(matrixArr, couter){
  containerBord.style.gridTemplateAreas = globalGameSettings.matrixClassPattern
  matrixArr.forEach((el, indСoordinate_Y) => {
    el.forEach((number, indСoordinate_X) => {
      let div = document.createElement('div');
      let arrAtributsValue = [
        ["data-x", `${indСoordinate_X}`],
        ["data-y", `${indСoordinate_Y}`], 
        ["class", `${number === '' ? 'blackEmptyCage':`box-${indСoordinate_Y}`}`], 
        ['data-emptyСell', `${number === globalGameSettings.matrixWinning[indСoordinate_Y][indСoordinate_X] ? false: true}`]
      ]
      arrAtributsValue.forEach( el => div.setAttribute(el[0], el[1]))
        // div.setAttribute("class", "box-1");
      div.innerHTML = number;
      containerBord.append(div)
    })
  })
  let cell = document.querySelectorAll('.box-0')[0];
  if(globalGameSettings.fontSizeCell === '0px'){
    globalGameSettings.fontSizeCell = `${Math.floor(cell.clientWidth * 0.5)}px`
  } 
  containerBord.style.fontSize = globalGameSettings.fontSizeCell
  couterGameElemen.innerHTML = `Xодов: ${couter}`
}
// Отрисовываем кнопки 
export function renderPanelBtnRecordGame(indexRecordGame, currentStep){
  panelBtn.innerHTML = '';

  [['Остановить воспроизведение', 'btn-stop-recording', function() {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(/\/[^/]+\/[^/]+$/, '') + '/recordGame.html';
    window.location.href = newPath;
  }],
  ['Приостановить воспроизведение', 'btn-pause-recording', function() {
    if(!globalGameSettings.pause){
      globalGameSettings.pause = !globalGameSettings.pause;
      RecordedGame(indexRecordGame, currentStep)
    }else{
      globalGameSettings.pause = !globalGameSettings.pause;
      RecordedGame(indexRecordGame, currentStep)
    }
  }]]
  .forEach((el) => {
    const btn = document.createElement('button');
    btn.className = el[1]; // Правильно задаём класс
    btn.addEventListener('click', el[2]); // Привязываем обработчик к кнопке
    btn.textContent = el[0]; // Используем textContent вместо innerHTML (безопаснее)
    panelBtn.appendChild(btn); // Добавляем кнопку в контейнер
  });
  // const btn = document.createElement('button');
  // btn.innerHTML = 'Отановить запись'
  // panelBtn.append(btn)
}

//  <!-- <div class="box-1"> 2 </div>
//   <div class="box-1"> 1 </div>
//   <div class="box-1"> 3 </div>
//   <div class="box-1"> 4 </div>
//   <div class="box-2"> 5 </div>
//   <div class="box-2 ziro"></div>
//   <div class="box-2"> 6 </div>
//   <div class="box-2"> 7 </div>
//   <div class="box-3"> 8 </div>
//   <div class="box-3"> 9 </div>
//   <div class="box-3"> 10 </div>
//   <div class="box-3"> 11 </div>
//   <div class="box-4"> 12 </div>
//   <div class="box-4"> 13 </div>
//   <div class="box-4"> 14 </div>
//   <div class="box-4"> 15 </div> -->

// Удаляем всю карту.
export function removeCellBord() {
  containerBord.innerHTML = '';
  // Второй вариант
  // while (containerBord.firstChild) {
  //   containerBord.firstChild.remove();
  // }
}










