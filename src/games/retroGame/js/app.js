/**
 * Entry point of app: don't change this
 */
import GamePlay from './GamePlay';
import GameController from './GameController';
import GameStateService from './GameStateService';

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));
gamePlay.bindPopup(document.querySelector('#popup'));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService); // В качесве аргумента два класса 
gameCtrl.init();

// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <meta http-equiv="X-UA-Compatible" content="ie=edge" />
//     <title>Retro Game</title>
//   </head>
//   <body>
//     <div id="game-container"></div>
//     <div id="popup" class="popup popup_hidden">
//       <div class="popup__window">
//         <p class="popup__title"></p>
//         <button class="popup__button">Закрыть</button>
//       </div>
//     </div>
//   </body>
// </html>
