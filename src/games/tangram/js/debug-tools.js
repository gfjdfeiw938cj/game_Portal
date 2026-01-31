// debug-tools.js — инструменты отладки.
let overlay = null; // SVG-группа для отладки (сетка)
let debugContainer = null; // Контейнер с инструментами создания фигур

export function initDebugTools() {
    // ждем загрузку поля и фигур 
    const pieces = document.querySelectorAll('.tangram-piece');
    const gameBoard = document.getElementById('game-board');
    
    // если поле не загрузилось, повторяем попытку через 500мс
    if (!gameBoard || pieces.length === 0) {
        setTimeout(initDebugTools, 500);
        return;
    }
    
    // создать сетку и кнопки 
    createOverlay();
    createDebugButtons();
}

function createOverlay() {
    const gameBoard = document.getElementById('game-board');
    
    // сброс старой сетки
    const oldOverlay = document.getElementById('debug-overlay');
    if (oldOverlay) oldOverlay.remove();
    
    //новая группа для сетки 
    overlay = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    overlay.id = 'debug-overlay';
    // параметры сетки 
    const gridSize = 25;
    const gridColor = 'rgba(200, 200, 200, 0.15)';
    // отрисовка вертикальных линий
    for (let x = 0; x <= 200; x += gridSize) {
        const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        vLine.setAttribute('x1', x.toString());
        vLine.setAttribute('y1', '0');
        vLine.setAttribute('x2', x.toString());
        vLine.setAttribute('y2', '200');
        vLine.setAttribute('stroke', gridColor);
        vLine.setAttribute('stroke-width', '0.5');
        overlay.appendChild(vLine);
    }
    // отрисовка горизонтальных линий
    for (let y = 0; y <= 200; y += gridSize) {
        const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        hLine.setAttribute('x1', '0');
        hLine.setAttribute('y1', y.toString());
        hLine.setAttribute('x2', '200');
        hLine.setAttribute('y2', y.toString());
        hLine.setAttribute('stroke', gridColor);
        hLine.setAttribute('stroke-width', '0.5');
        overlay.appendChild(hLine);
    }
    
    // очистка контура целой фигуры и цветной подсказки
    const targetOutline = document.getElementById('target-outline');
    if (targetOutline) targetOutline.remove();
    
    const targetShape = document.getElementById('target-shape');
    if (targetShape) targetShape.remove();
    
    // вставка сетки под фигуру
    gameBoard.insertBefore(overlay, gameBoard.firstChild);
}

function captureSilhouette() {
    // сбор координат и имя для новой фигуры
    const pieces = document.querySelectorAll('.tangram-piece');
    const name = prompt('Введите название фигуры:', 'new_shape');
    
    if (!name) return null;
    
    const silhouette = {
        name: name,
        pieces: []
    };
    
    pieces.forEach((piece) => {
        const transform = piece.getAttribute('transform') || 'translate(0,0)';
        
        let x = 0, y = 0, angle = 0;
        // извлечение координат 
        const translateMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        if (translateMatch) {
            x = parseFloat(translateMatch[1]);
            y = parseFloat(translateMatch[2]);
        }
        // извлечение углов поворота
        const rotateMatch = transform.match(/rotate\(([^,)]+)/);
        if (rotateMatch) {
            angle = parseFloat(rotateMatch[1]);
        }
        
        // сохранение данных фигур с округлением в 2 знака 
        silhouette.pieces.push({
            type: piece.dataset.shape,
            transform: transform,
            x: Math.round(x * 100) / 100,
            y: Math.round(y * 100) / 100,
            angle: Math.round(angle * 100) / 100,
            points: piece.getAttribute('points'),
            fill: piece.getAttribute('fill'),
            stroke: piece.getAttribute('stroke')
        });
    });
    
    return silhouette;
}

function copySilhouetteToClipboard() {
    // добавление данных в буфер 
    const silhouette = captureSilhouette();
    
    if (!silhouette) {
        return;
    }
    // конвертация в JSON 
    const text = JSON.stringify(silhouette, null, 2);
    
    // создание временной textarea для копирования 
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    
    textarea.focus();
    textarea.select();
    
    try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
    } catch (err) {
        document.body.removeChild(textarea);
    }
}

function createDebugButtons() {
    // если окно с инструментами уже есть, показываем
    if (debugContainer) {
        debugContainer.style.display = 'block';
        return;
    }
    
    // создать контейнер для инструментов создания 
    debugContainer = document.createElement('div');
    debugContainer.id = 'debug-container';
    debugContainer.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: white;
        padding: 12px;
        border-radius: 4px;
        border: 1px solid #ccc;
        z-index: 10000;
        font-family: monospace;
        font-size: 12px;
        min-width: 180px;
    `;
    
    debugContainer.innerHTML = `
        <div style="margin-bottom: 8px; font-weight: bold; font-size: 14px; padding-bottom: 5px;">
            Инструмент создания фигур
        </div>
        <button id="debug-silhouette-btn" style="margin: 3px; padding: 6px 10px; background: #4a6fa5; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">
            Сохранить силуэт
        </button>
        <div style="margin-top: 8px; font-size: 10px; color: #666; padding-top: 5px;">
            • Расставьте фигуры<br>
            • Нажмите "Сохранить силуэт"<br>
            • Введите название<br>
            • Нажмите "ОК", чтобы добавить данные в буфер обмена
        </div>
    `;
    
    document.body.appendChild(debugContainer);
    
    const silhouetteBtn = document.getElementById('debug-silhouette-btn');
    
    if (silhouetteBtn) {
        silhouetteBtn.addEventListener('click', copySilhouetteToClipboard);
    }
}