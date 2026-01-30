import { LocalStorageGetVictoryGame } from '../core/storage';
import { renderMap, removeCellBord, renderPanelBtnRecordGame} from '../rendering/bord';
import { globalGameSettings } from '../config';

const showIndicatorblink = document.querySelector('.container-blink-none');
const textMessageBlink = document.querySelector('.blink-playingGame')

let activeIntervals = [];

export async function RecordedGame(indexRecordGame, currentStep = 0, delayMs = 1000) {
  const arrRecordGame = LocalStorageGetVictoryGame();

  if (!arrRecordGame || !arrRecordGame[indexRecordGame]) {
    console.error('Запись не найдена:', indexRecordGame);
    return;
  }
  // Инициализация глобальных настроек (как в вашем коде)
  globalGameSettings.matrixWinning = arrRecordGame[indexRecordGame].matrixWinning
  globalGameSettings.matrixClassPattern = arrRecordGame[indexRecordGame].matrixClassPattern

  // Подключаем Сообщение о воспроизведение игры.
  showIndicatorblink.classList.add('container-blink-block')

  const steps = arrRecordGame[indexRecordGame].GameSettings;

  for (let i = currentStep; i < steps.length; i++) {
    if(globalGameSettings.pause) {
      textMessageBlink.textContent = 'Пауза';
      renderPanelBtnRecordGame(indexRecordGame, i)
      return; 
    }
    textMessageBlink.textContent = 'Идёт воспроизведение записи игры!';
    removeCellBord();
    renderPanelBtnRecordGame(indexRecordGame, i)
    renderMap(steps[i], i);
    await new Promise(resolve => {
      const timeoutId = setTimeout(() => {
        resolve();
      }, delayMs);
      activeIntervals.push(timeoutId); // сохраняем ID для возможной отмены
    });
    stopRecordedGame()
  }
  window.location.href = `./recordGame`;
}

function stopRecordedGame() {
  console.log(activeIntervals)
  activeIntervals.forEach(timeoutId => clearTimeout(timeoutId));
  activeIntervals = [];
}

// import { LocalStorageGetVictoryGame } from '../core/storage';
// import { renderMap, removeCellBord, renderPanelBtnRecordGame } from '../rendering/bord';
// import { globalGameSettings } from '../config';

// const port = import.meta.env.VITE_PORT;

// const showIndicatorblink = document.querySelector('.container-blink-none');
// const textMessageBlink = document.querySelector('.blink-playingGame')
// let activeTimeouts = []; // переименовали для ясности

// /**
//  * Воспроизводит записанную игру шаг за шагом.
//  * @param {number} indexRecordGame — индекс записи в хранилище.
//  * @param {number} currentStep — с какого шага начать (по умолчанию 0).
//  * @param {number} delayMs — задержка между шагами в мс (по умолчанию 1000).
//  * @returns {Promise<boolean>} — true, если воспроизведение завершено; false, если прервано.
//  */
// export async function RecordedGame(indexRecordGame, currentStep = 0, delayMs = 1000) {
//   const arrRecordGame = LocalStorageGetVictoryGame();

//   if (!arrRecordGame || !arrRecordGame[indexRecordGame]) {
//     console.error('Запись не найдена:', indexRecordGame);
//     return false;
//   }

//   // Инициализация глобальных настроек
//   globalGameSettings.matrixWinning = arrRecordGame[indexRecordGame].matrixWinning;
//   globalGameSettings.matrixClassPattern = arrRecordGame[indexRecordGame].matrixClassPattern;

//   // Показываем индикатор воспроизведения
//   showIndicatorblink.classList.add('container-blink-block');

//   // Очистка предыдущих таймаутов
//   clearActiveTimeouts();

//   const steps = arrRecordGame[indexRecordGame].GameSettings;

//   try {
//     for (let i = currentStep; i < steps.length; i++) {
//       // Проверка на паузу
//       if (globalGameSettings.pause) {
//         renderPanelBtnRecordGame(indexRecordGame, i);
//         textMessageBlink.textContent = 'Пауза'
//         return; // сигнализируем о паузе
//       }
//       textMessageBlink.textContent = 'Идёт воспроизведение записи игры!'
//       removeCellBord();
//       renderPanelBtnRecordGame(indexRecordGame, i);
//       renderMap(steps[i], i);

//       // Ждём перед следующим шагом
//       await new Promise(resolve => {
//         const timeoutId = setTimeout(() => {
//           resolve();
//         }, delayMs);
//         activeTimeouts.push(timeoutId); // сохраняем ID для возможной отмены
//       });
//       clearActiveTimeouts()
//     }
//     // Успешное завершение воспроизведения
//     window.location.href = `http://localhost:${port}/src/games/tagGame/pages/recordGame.html`
//     return ;
//   } catch (error) {
//     console.error('Ошибка при воспроизведении:', error);
//     return;
//   } finally {
//     // Всегда очищаем таймауты и индикатор
//     clearActiveTimeouts();
//   }
// }

/**
 * Останавливает текущее воспроизведение.
 */
// export function stopRecordedGame() {
//   clearActiveTimeouts();
//   console.log('Воспроизведение остановлено принудительно');
// }

// /**
//  * Очищает все активные таймауты.
//  */
// function clearActiveTimeouts() {
//   activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
//   activeTimeouts = [];
// }
