import {getCurrentHint} from './hint'

// жесткость критериев проверки решения 
const TOLERANCE = {
    POSITION: 8, // допустимая погрешность позици по каждой стороне - 8 пикселей 
    ROTATION: 5 // допустимая погрешность угла поворота детали (да, мы поворачиваем только на 45 градусов)
};

// константы типов фигур 
const PIECE_TYPES = {
    BIG_TRIANGLE: 'big-triangle',
    MEDIUM_TRIANGLE: 'medium-triangle',
    SMALL_TRIANGLE: 'small-triangle',
    SQUARE: 'square',
    PARALLELOGRAM: 'parallelogram'
};
// группы фигур одного размера 
const INTERCHANGEABLE_GROUPS = [
    [PIECE_TYPES.BIG_TRIANGLE, PIECE_TYPES.BIG_TRIANGLE],
    [PIECE_TYPES.SMALL_TRIANGLE, PIECE_TYPES.SMALL_TRIANGLE]
];

// смотрим текущие позици фигур 
function getCurrentPieces() {
    const pieces = document.querySelectorAll('.tangram-piece');
    const result = [];
    
    pieces.forEach((piece) => {
        const transform = piece.getAttribute('transform') || 'translate(0,0)';
        
        let x = 0, y = 0, angle = 0;
        
        // смещение
        const translateMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        if (translateMatch) {
            x = parseFloat(translateMatch[1]);
            y = parseFloat(translateMatch[2]);
        }
        
        // угол 
        const rotateMatch = transform.match(/rotate\(([^,)]+)/);
        if (rotateMatch) {
            angle = parseFloat(rotateMatch[1]);
        }
        
        angle = ((angle % 360) + 360) % 360;
        
        result.push({
            element: piece,
            type: piece.dataset.shape,
            x: Math.round(x * 100) / 100,
            y: Math.round(y * 100) / 100,
            angle: Math.round(angle * 100) / 100,
            id: piece.id
        });
    });
    
    return result;
}

// нормализовать угол 
function normalizeAngle(angle) {
    return ((angle % 360) + 360) % 360;
}

// проверка нормализованных углов с погрешностью
function anglesMatch(angle1, angle2) {
    const normalized1 = normalizeAngle(angle1);
    const normalized2 = normalizeAngle(angle2);
    
    const rounded1 = Math.round(normalized1 / 45) * 45;
    const rounded2 = Math.round(normalized2 / 45) * 45;
    
    return Math.abs(rounded1 - rounded2) < 0.01;
}

// проверка позиций с учетом погрешности
function positionsMatch(x1, y1, x2, y2, tolerance = TOLERANCE.POSITION) {
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);
    return dx <= tolerance && dy <= tolerance;
}

// проверка фигур на взаимозаменяемость
function arePiecesInterchangeable(type1, type2) {
    for (const group of INTERCHANGEABLE_GROUPS) {
        if (group.includes(type1) && group.includes(type2)) {
            return true;
        }
    }
    return false;
}

// основная функция проверки решений 
function checkSolution(targetSolution) {
    if (!targetSolution || !targetSolution.pieces) {
        return false;
    }
    
    const currentPieces = getCurrentPieces();
    const targetPieces = [...targetSolution.pieces];
    
    // снять старую разметку 
    document.querySelectorAll('.tangram-piece').forEach(piece => {
        piece.classList.remove('correct', 'incorrect');
    });
    
    let matchedPieces = [];
    let allMatched = true;
    
    // проверка каждой фигуры
    for (const target of targetPieces) {
        let matched = false;
        
        // для каждой фигуры проверяем ее тип, координаты и угол, если совпала - добавляем в корректные и удаляем из текущей проверки 
        for (let i = 0; i < currentPieces.length; i++) {
            const current = currentPieces[i];
            
            const typeMatches = current.type === target.type || 
                               arePiecesInterchangeable(current.type, target.type);
            
            if (!typeMatches) continue;
            
            const positionOk = positionsMatch(current.x, current.y, target.x, target.y);
            const angleOk = anglesMatch(current.angle, target.angle);
            
            if (positionOk && angleOk) {
                current.element.classList.add('correct');
                matchedPieces.push({
                    target: target,
                    current: current,
                    perfect: true
                });
                
                currentPieces.splice(i, 1);
                matched = true;
                break;
            }
        }
        
        if (!matched) {
            allMatched = false;
        }
    }
    // если остались несовпавшие фигуры - решение не полное 
    if (currentPieces.length > 0) {
        allMatched = false;
    }
    
    return {
        success: allMatched,
        matched: matchedPieces.length,
        total: targetPieces.length
    };
}

// проверка решения для текущей фигуры 
function checkCurrentSolution() {
    if (typeof getCurrentHint !== 'function') {
        return false;
    }
    
    const hintData = getCurrentHint();
    if (!hintData) {
        return false;
    }
    
    return checkSolution(hintData);
}

// настройка обработчика кнопки проверки решения
function setupSolutionChecker() {
    const checkBtn = document.getElementById('check-btn');
    if (!checkBtn) return;
    
    checkBtn.addEventListener('click', function() {
        const result = checkCurrentSolution();
        // удалить старое сообщение
        const message = document.getElementById('check-message');
        if (message) message.remove();
        // вывести новое сообщение
        const msg = document.createElement('div');
        msg.id = 'check-message';
        
        if (result.success) {
            msg.textContent = 'Фигура собрана!';
            msg.className = 'success';
        } else {
            msg.textContent = `Совпало фигур: ${result.matched}/${result.total}`;
            msg.className = 'info';
        }
        
        document.body.appendChild(msg);
        
        // скрыть сообщение через 3 секунды
        setTimeout(() => {
            if (msg.parentNode) {
                msg.remove();
            }
        }, 3000);
    });
}

// инициализация после загрузки DOM 
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setupSolutionChecker, 1000);
});