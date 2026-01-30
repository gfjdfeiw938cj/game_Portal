

// данные для Квадрат 
const squareHint = {
  "name": "square",
  "pieces": [
    {
      "type": "big-triangle",
      "transform": "translate(98.79999732971191, 100.40000534057617) rotate(135)",
      "x": 98.8,
      "y": 100.4,
      "angle": 135,
      "points": "0,0 50,0 0,50",
      "fill": "#2F4F2F",
      "stroke": "#283A28"
    },
    {
      "type": "big-triangle",
      "transform": "translate(99.60000610351562, 99.60000610351562) rotate(225)",
      "x": 99.6,
      "y": 99.6,
      "angle": 225,
      "points": "0,0 0,50 50,0",
      "fill": "#556B2F",
      "stroke": "#445522"
    },
    {
      "type": "medium-triangle",
      "transform": "translate(135.84499740600586, 136.80000686645508) rotate(180)",
      "x": 135.84,
      "y": 136.8,
      "angle": 180,
      "points": "0,0 35.355,0 0,35.355",
      "fill": "#6B8E23",
      "stroke": "#5A7720"
    },
    {
      "type": "small-triangle",
      "transform": "translate(99.20000457763672, 101.59998321533203) rotate(45)",
      "x": 99.2,
      "y": 101.6,
      "angle": 45,
      "points": "0,0 25,0 0,25",
      "fill": "#808000",
      "stroke": "#6A6A00"
    },
    {
      "type": "small-triangle",
      "transform": "translate(118, 83.20000457763672) rotate(315)",
      "x": 118,
      "y": 83.2,
      "angle": 315,
      "points": "0,0 0,25 25,0",
      "fill": "#9ACD32",
      "stroke": "#82B029"
    },
    {
      "type": "square",
      "transform": "translate(117.59999465942383, 83.19999694824219) rotate(45)",
      "x": 117.6,
      "y": 83.2,
      "angle": 45,
      "points": "0,0 25,0 25,25 0,25",
      "fill": "#8A9A5B",
      "stroke": "#78854A"
    },
    {
      "type": "parallelogram",
      "transform": "translate(116.40000534057617, 119.59999084472656) rotate(90)",
      "x": 116.4,
      "y": 119.6,
      "angle": 90,
      "points": "0,0 0,35.355 17.6775,53.0325 17.6775,17.6775",
      "fill": "#B8C4A3",
      "stroke": "#A0AD8E"
    }
  ]
};

// данные для Лисы
const foxHint = {
  "name": "fox",
  "pieces": [
    {
      "type": "big-triangle",
      "transform": "translate(74.40000534057617, 150) rotate(270)",
      "x": 74.4,
      "y": 150,
      "angle": 270,
      "points": "0,0 50,0 0,50",
      "fill": "#2F4F2F",
      "stroke": "#283A28"
    },
    {
      "type": "big-triangle",
      "transform": "translate(75.20000839233398, 99.99999237060547) rotate(315)",
      "x": 75.2,
      "y": 100,
      "angle": 315,
      "points": "0,0 0,50 50,0",
      "fill": "#556B2F",
      "stroke": "#445522"
    },
    {
      "type": "medium-triangle",
      "transform": "translate(136.2450065612793, 83.59999752044678) rotate(135)",
      "x": 136.25,
      "y": 83.6,
      "angle": 135,
      "points": "0,0 35.355,0 0,35.355",
      "fill": "#6B8E23",
      "stroke": "#5A7720"
    },
    {
      "type": "small-triangle",
      "transform": "translate(130.59999084472656, 38.400001525878906) rotate(315)",
      "x": 130.6,
      "y": 38.4,
      "angle": 315,
      "points": "0,0 25,0 0,25",
      "fill": "#808000",
      "stroke": "#6A6A00"
    },
    {
      "type": "small-triangle",
      "transform": "translate(128.8000030517578, 39.20000076293945) rotate(135)",
      "x": 128.8,
      "y": 39.2,
      "angle": 135,
      "points": "0,0 0,25 25,0",
      "fill": "#9ACD32",
      "stroke": "#82B029"
    },
    {
      "type": "square",
      "transform": "translate(129.2000093460083, 39.60000228881836) rotate(45)",
      "x": 129.2,
      "y": 39.6,
      "angle": 45,
      "points": "0,0 25,0 25,25 0,25",
      "fill": "#8A9A5B",
      "stroke": "#78854A"
    },
    {
      "type": "parallelogram",
      "transform": "translate(135.9224910736084, 84.4000015258789) rotate(45)",
      "x": 135.92,
      "y": 84.4,
      "angle": 45,
      "points": "0,0 0,35.355 17.6775,53.0325 17.6775,17.6775",
      "fill": "#B8C4A3",
      "stroke": "#A0AD8E"
    }
  ]
};

// объект со всеми заготовленными фигурами 
const allHints = {
  square: squareHint,
  fox: foxHint
};

let currentShape = 'square';

// возврат подсказки для текущей фигуры 
export function getCurrentHint() {
    return allHints[currentShape];
}

// установить текущую фигуру 
export function setCurrentShape(shapeName) {
    if (allHints[shapeName]) {
        currentShape = shapeName;
        return true;
    }
    return false;
}

// показать подсказку на игровом поле 
export function showHint() {
    const hintData = getCurrentHint();
    if (!hintData) return;
    
    const gameBoard = document.getElementById('game-board');
    // очистка 
    const oldHint = document.getElementById('tangram-hint');
    if (oldHint) oldHint.remove();
    
    const targetShape = document.getElementById('target-shape');
    if (targetShape) targetShape.remove();
    
    const targetOutline = document.getElementById('target-outline');
    if (targetOutline) targetOutline.remove();
    
    // создать группу для подсказки
    const hintGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    hintGroup.id = 'tangram-hint';
    hintGroup.setAttribute('class', 'tangram-hint');
    
    // отрисовка полупрозрачных контуров для каждой детали
    hintData.pieces.forEach((pieceData) => {
        const piece = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        piece.setAttribute('points', pieceData.points);
        piece.setAttribute('transform', pieceData.transform);
        piece.setAttribute('fill', pieceData.fill);
        piece.setAttribute('stroke', pieceData.stroke);
        piece.setAttribute('stroke-width', '1');
        piece.setAttribute('stroke-dasharray', '2,2');
        piece.setAttribute('opacity', '0.25');
        piece.setAttribute('pointer-events', 'none');
        
        hintGroup.appendChild(piece);
    });
    
    gameBoard.appendChild(hintGroup);
}

// скрыть подсказку
export function hideHint() {
    const hint = document.getElementById('tangram-hint');
    if (hint) hint.remove();
}