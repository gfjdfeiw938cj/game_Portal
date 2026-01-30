import {setCurrentShape, showHint } from './hint'
import {getCurrentMode} from './mode-manager'


document.addEventListener('DOMContentLoaded', function() {
    // инициализация игры 
    setTimeout(initTangram, 100);
    
    function initTangram() {
        let pieces = document.querySelectorAll('.tangram-piece');
        const gameBoard = document.getElementById('game-board');
        
        if (!gameBoard || pieces.length === 0) {
            return;
        }
        
        // точка для преобразования координат из экранных в SVG 
        const svgPoint = gameBoard.createSVGPoint();
        let draggedPiece = null; // фигура, которую сейчас двигаем 
        let startX = 0, startY = 0; // начальные координаты курсора в координатах SVG 
        let initialTransform = null; // начальное преобразование для перетаскивания
        
        // назначаем обработчики событий для каждой фигуры 
        pieces.forEach(piece => {
            // начало перетаскивания левой кнопкой мыши
            piece.addEventListener('mousedown', (e) => {
                if (e.button === 0) {
                    e.preventDefault();
                    startDragging(e, piece);
                }
            });
            // поворот правым кликом мыши
            piece.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                rotatePiece(piece);
            });
            // сенсорный экран
            piece.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    e.preventDefault();
                    startDragging(e.touches[0], piece);
                }
            }, { passive: false });
        });
        
        function startDragging(e, piece) {
            draggedPiece = piece;
            initialTransform = piece.getAttribute('transform') || 'translate(0, 0)';
            // преобразование координат в svg 
            svgPoint.x = e.clientX;
            svgPoint.y = e.clientY;
            const pointInViewBox = svgPoint.matrixTransform(gameBoard.getScreenCTM().inverse());
            // фиксируем точку начала перетаскивания 
            startX = pointInViewBox.x;
            startY = pointInViewBox.y;
            // извлечь текущее смещение фигуры
            const match = initialTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            let currentX = 0, currentY = 0;
            if (match) {
                currentX = parseFloat(match[1]);
                currentY = parseFloat(match[2]);
            }
            // вычислить смешение мыши относительно фигуры 
            startX -= currentX;
            startY -= currentY;
            
            piece.classList.add('dragging');
            // обработчики событий перемещения и отпускания 
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDragging);
            document.addEventListener('touchmove', onTouchDrag, { passive: false });
            document.addEventListener('touchend', stopDragging);
        }
        
        function onDrag(e) {
            if (!draggedPiece) return;
            // преобразование текущих координат мыши в svg 
            svgPoint.x = e.clientX;
            svgPoint.y = e.clientY;
            const pointInViewBox = svgPoint.matrixTransform(gameBoard.getScreenCTM().inverse());
            // новая позиция со смещением
            let newX = pointInViewBox.x - startX;
            let newY = pointInViewBox.y - startY;
            // ограничение передвижения игровым полем
            const bbox = draggedPiece.getBBox();
            const bounds = {
                left: 0 - bbox.x,
                right: 200 - (bbox.x + bbox.width),
                top: 0 - bbox.y,
                bottom: 200 - (bbox.y + bbox.height)
            };
            
            newX = Math.max(bounds.left, Math.min(bounds.right, newX));
            newY = Math.max(bounds.top, Math.min(bounds.bottom, newY));
            // сохранение угла поворота 
            const transform = draggedPiece.getAttribute('transform');
            let rotatePart = '';
            const rotateMatch = transform.match(/(rotate\([^)]+\))/);
            if (rotateMatch) {
                rotatePart = ' ' + rotateMatch[1];
            }
            // применить преобразование
            draggedPiece.setAttribute('transform', `translate(${newX}, ${newY})${rotatePart}`);
        }
        // аналогично для сенсора 
        function onTouchDrag(e) {
            if (!draggedPiece || e.touches.length !== 1) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            svgPoint.x = touch.clientX;
            svgPoint.y = touch.clientY;
            const pointInViewBox = svgPoint.matrixTransform(gameBoard.getScreenCTM().inverse());
            
            let newX = pointInViewBox.x - startX;
            let newY = pointInViewBox.y - startY;
            
            const bbox = draggedPiece.getBBox();
            const bounds = {
                left: 0 - bbox.x,
                right: 200 - (bbox.x + bbox.width),
                top: 0 - bbox.y,
                bottom: 200 - (bbox.y + bbox.height)
            };
            
            newX = Math.max(bounds.left, Math.min(bounds.right, newX));
            newY = Math.max(bounds.top, Math.min(bounds.bottom, newY));
            
            const transform = draggedPiece.getAttribute('transform');
            let rotatePart = '';
            const rotateMatch = transform.match(/(rotate\([^)]+\))/);
            if (rotateMatch) {
                rotatePart = ' ' + rotateMatch[1];
            }
            
            draggedPiece.setAttribute('transform', `translate(${newX}, ${newY})${rotatePart}`);
        }
        
        function rotatePiece(piece) {
            // поворот фигуры правым кликом 
            const transform = piece.getAttribute('transform') || 'translate(0, 0)';
            
            let translateX = 0, translateY = 0;
            let rotateAngle = 0;
            // извлечь текущее смещение и угол
            const translateMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            if (translateMatch) {
                translateX = parseFloat(translateMatch[1]);
                translateY = parseFloat(translateMatch[2]);
            }
            
            const rotateMatch = transform.match(/rotate\(([^,)]+)/);
            if (rotateMatch) {
                rotateAngle = parseFloat(rotateMatch[1]);
            }
            // увеличить угол на 45 по модулю 360
            const newAngle = (rotateAngle + 45) % 360;
            piece.setAttribute('transform', `translate(${translateX}, ${translateY}) rotate(${newAngle})`);
        }
        
        function stopDragging() {
            if (!draggedPiece) return;
            // снимаем класс dragging и удаляем обработчики
            draggedPiece.classList.remove('dragging');
            draggedPiece = null;
            
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDragging);
            document.removeEventListener('touchmove', onTouchDrag);
            document.removeEventListener('touchend', stopDragging);
        }
        
        // вернуть фигуры в дефолтное состояние
        function resetPieces() {
            const initialPositions = [
                { x: 10, y: 10 },
                { x: 70, y: 10 },
                { x: 10, y: 70 },
                { x: 100, y: 70 },
                { x: 140, y: 70 },
                { x: 10, y: 120 },
                { x: 70, y: 120 }
            ];
            
            pieces.forEach((piece, index) => {
                piece.setAttribute('transform', `translate(${initialPositions[index].x}, ${initialPositions[index].y})`);
            });
            
            // если в режиме игры - показать подсказку
            if (typeof getCurrentMode === 'function' && getCurrentMode() === 'game') {
                if (typeof showHint === 'function') {
                    showHint();
                }
            }
        }
        
        // обработчик кнопки сброса фигур
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetPieces);
        }
        // настроить выбор фигур 
        setupShapeSelector();
    }
    
    function setupShapeSelector() {
        // обработчик кнопок выбора фигур 
        const shapeButtons = document.querySelectorAll('.shape-btn');
        if (!shapeButtons.length) return;
        
        shapeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const shape = this.dataset.shape;
                // установить текущую фигуру, обновить кнопку
                if (typeof setCurrentShape === 'function') {
                    setCurrentShape(shape);
                    
                    shapeButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    // сброс фигуры в начальное значение 
                    const resetBtn = document.getElementById('reset-btn');
                    if (resetBtn) {
                        resetBtn.click();
                    }
                    
                    // в режиме игры показываем подсказку
                    if (typeof getCurrentMode === 'function' && getCurrentMode() === 'game') {
                        if (typeof showHint === 'function') {
                            showHint();
                        }
                    }
                }
            });
        });
        
        // активация кнопки по умолчанию
        if (shapeButtons[0]) {
            shapeButtons[0].classList.add('active');
        }
    }
});