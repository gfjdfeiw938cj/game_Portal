//                                        tangram-pieces.js — создание фигур
// вспомогательная функция для создания svg-элементов 
function createSvgElement(tagName, attributes = {}) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value)
    }
    return element;
};
// создание 1 большого треугольника
function createBigTriangle1(id, x, y) {
    return createSvgElement('polygon', {
        id: id,
        class: 'tangram-piece big-triangle',
        points: `0,0 50,0 0,50`,
        fill: '#2F4F2F', 
        stroke: '#283A28',
        'stroke-width': '1',
        'stroke-linejoin': 'round',
        'data-shape': 'big-triangle',
        'transform': `translate(${x}, ${y})`,
    });
}
// создание 2 большого треугольника
function createBigTriangle2(id, x, y) {
    return createSvgElement('polygon', {
        id: id,
        class: 'tangram-piece big-triangle',
        points: `0,0 0,50 50,0`,
        fill: '#556B2F', 
        stroke: '#445522',
        'stroke-width': '1',
        'stroke-linejoin': 'round',
        'data-shape': 'big-triangle',
        'transform': `translate(${x}, ${y})`,
    });
}
// создание среднего треугольника
function createMediumTriangle(id, x, y) {
    return createSvgElement('polygon', {
        id: id,
        class: 'tangram-piece medium-triangle',
        points: `0,0 35.355,0 0,35.355`,
        fill: '#6B8E23',
        stroke: '#5A7720',
        'stroke-width': '1',
        'stroke-linejoin': 'round',
        'data-shape': 'medium-triangle',
        'transform': `translate(${x}, ${y})`,
    });
}
// создание 1 малого треугольника
function createSmallTriangle1(id, x, y) {
    return createSvgElement('polygon', {
        id: id,
        class: 'tangram-piece small-triangle',
        points: `0,0 25,0 0,25`,
        fill: '#808000', 
        stroke: '#6A6A00',
        'stroke-width': '1',
        'stroke-linejoin': 'round',
        'data-shape': 'small-triangle',
        'transform': `translate(${x}, ${y})`,
    });
}
// создание 2 малого треугольника
function createSmallTriangle2(id, x, y) {
    return createSvgElement('polygon', {
        id: id,
        class: 'tangram-piece small-triangle',
        points: `0,0 0,25 25,0`,
        fill: '#9ACD32',
        stroke: '#82B029',
        'stroke-width': '1',
        'stroke-linejoin': 'round',
        'data-shape': 'small-triangle',
        'transform': `translate(${x}, ${y})`,
    });
}
// создание квадрата
function createSquare(id, x, y) {
    return createSvgElement('polygon', {
        id: id,
        class: 'tangram-piece square',
        points: `0,0 25,0 25,25 0,25`,
        fill: '#8A9A5B',
        stroke: '#78854A',
        'stroke-width': '1',
        'stroke-linejoin': 'round',
        'data-shape': 'square',
        'transform': `translate(${x}, ${y})`,
    });
}
// создание параллелограмма
function createParallelogram(id, x, y) {
    const base = 35.355;
    const height = 17.6775;
    const offset = 17.6775;
    
    return createSvgElement('polygon', {
        id: id,
        class: 'tangram-piece parallelogram',
        points: `0,0 0,${base} ${height},${base+offset} ${height},${offset}`,
        fill: '#B8C4A3',
        stroke: '#A0AD8E',
        'stroke-width': '1',
        'stroke-linejoin': 'round',
        'data-shape': 'parallelogram',
        'transform': `translate(${x}, ${y})`,
    });
}
// инициализация создания всех фигур на игровом поле 
document.addEventListener('DOMContentLoaded', function() {
    const gameBoard = document.getElementById('game-board');
    // массив с начальным положением фигур
    const pieces = [
        { type: 'bigTriangle1', pos: { x: 10, y: 10 } },
        { type: 'bigTriangle2', pos: { x: 70, y: 10 } },
        { type: 'mediumTriangle', pos: { x: 10, y: 70 } },
        { type: 'smallTriangle1', pos: { x: 100, y: 70 } },
        { type: 'smallTriangle2', pos: { x: 140, y: 70 } },
        { type: 'square', pos: { x: 10, y: 120 } },
        { type: 'parallelogram', pos: { x: 70, y: 120 } }
    ];
    // добавить каждую фигуру на поле
    pieces.forEach((piece, index) => {
        let element;
        
        switch(piece.type) {
            case 'bigTriangle1':
                element = createBigTriangle1(`piece-${index}`, piece.pos.x, piece.pos.y);
                break;
            case 'bigTriangle2':
                element = createBigTriangle2(`piece-${index}`, piece.pos.x, piece.pos.y);
                break;
            case 'mediumTriangle':
                element = createMediumTriangle(`piece-${index}`, piece.pos.x, piece.pos.y);
                break;
            case 'smallTriangle1':
                element = createSmallTriangle1(`piece-${index}`, piece.pos.x, piece.pos.y);
                break;
            case 'smallTriangle2':
                element = createSmallTriangle2(`piece-${index}`, piece.pos.x, piece.pos.y);
                break;
            case 'square':
                element = createSquare(`piece-${index}`, piece.pos.x, piece.pos.y);
                break;
            case 'parallelogram':
                element = createParallelogram(`piece-${index}`, piece.pos.x, piece.pos.y);
                break;
        }
        
        if (element) {
            gameBoard.appendChild(element);
        }
    });
});