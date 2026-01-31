// mode-manager.js — переключение режимов;
import {hideHint} from './hint'
import {initDebugTools} from './debug-tools'

// текущий режим: игра или создание 
let currentMode = 'game'; 

// элементы режима игры 
const gameModeElements = document.querySelectorAll('.game-mode-elements, .shape-selector');
// элементы режима создания
const creationModeElements = document.querySelectorAll('.game-instructions.creation-mode');

function initModeManager() {
    const modeToggleBtn = document.getElementById('mode-toggle');
    if (!modeToggleBtn) return;
    // установил режим игры 
    setMode('game');
    // обработчик переключения режима 
    modeToggleBtn.addEventListener('click', toggleMode);
}

// переключение режимов
function toggleMode() {
    if (currentMode === 'game') {
        setMode('creation');
    } else {
        setMode('game');
    }
}

function setMode(mode) {
    currentMode = mode;
    const modeToggleBtn = document.getElementById('mode-toggle');
    // замена текста кнопки согласно режиму
    if (modeToggleBtn) {
        if (mode === 'creation') {
            modeToggleBtn.textContent = 'Режим игры';
            showDebugTools();
        } else {
            modeToggleBtn.textContent = 'Режим создания';
            hideDebugTools();
        }
    }
    // сокрытие кнопок согласно режиму
    if (mode === 'creation') {
        gameModeElements.forEach(el => el.classList.add('hidden'));
        creationModeElements.forEach(el => el.classList.remove('hidden'));
        disableSolutionCheck();
        
        if (typeof hideHint === 'function') {
            hideHint();
        }
    } else {
        gameModeElements.forEach(el => el.classList.remove('hidden'));
        creationModeElements.forEach(el => el.classList.add('hidden'));
        enableSolutionCheck();
    }
}

// показать инструменты отладки
function showDebugTools() {
    let debugContainer = document.getElementById('debug-container');
    
    if (!debugContainer && typeof initDebugTools === 'function') {
        initDebugTools();
    } else if (debugContainer) {
        debugContainer.style.display = 'block';
        
        const overlay = document.getElementById('debug-overlay');
        if (overlay) {
            overlay.style.display = 'block';
        }
    }
}

// скрыть инструменты отладки 
function hideDebugTools() {
    const debugContainer = document.getElementById('debug-container');
    if (debugContainer) {
        debugContainer.style.display = 'none';
    }
    
    const overlay = document.getElementById('debug-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// спрятать кнопку проверки решения
function disableSolutionCheck() {
    const checkBtn = document.getElementById('check-btn');
    if (checkBtn) {
        checkBtn.disabled = true;
        checkBtn.style.opacity = '0.5';
        checkBtn.style.cursor = 'not-allowed';
    }
}

// показать кнопку проверки решения
function enableSolutionCheck() {
    const checkBtn = document.getElementById('check-btn');
    if (checkBtn) {
        checkBtn.disabled = false;
        checkBtn.style.opacity = '1';
        checkBtn.style.cursor = 'pointer';
    }
}

// текущий режим
export function getCurrentMode() {
    return currentMode;
}

// инициализация после загрузки DOM 
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initModeManager, 100);
});