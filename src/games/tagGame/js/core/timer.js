let timer = document.getElementById('display');
import {globalGameSettings} from '../config'
// Функция обновления времени
export function updateDisplay() {
  let formattedSeconds = globalGameSettings.seconds.toString().padStart(2, '0');
  let formattedMinutes = globalGameSettings.minutes.toString().padStart(2, '0');
  timer.textContent = `Время: ${formattedMinutes}:${formattedSeconds}`;
  return [formattedSeconds, formattedMinutes]
};

// Функция увеличения времени на 1 секунду
export function incrementTime() {
  if(globalGameSettings.pause) return;
    globalGameSettings.seconds++;
  if(globalGameSettings.seconds >= 60) {
    globalGameSettings.seconds = 0;
    globalGameSettings.minutes++;
  }
  updateDisplay();
};