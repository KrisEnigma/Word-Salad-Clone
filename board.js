import { handleClick, areAdjacent, selectCell, checkWord, resetSelection, undoLastSelection, vibrate, gameState } from './gameLogic.js';
import { getCurrentLevel } from './levels.js';

export const boardElement = document.getElementById('board');
export const hintsElement = document.getElementById('hints');

let isDragging = false;
let dragPointerId = null;
let pointerCoords = { startX: 0, startY: 0 };
const DRAG_THRESHOLD = 10;

const files = 'abcd';
const ranks = '1234';

let currentCell = null;
let boardNeedsReset = true;

function handlePointerMove(e, initialCell) {
    if (e.pointerId !== dragPointerId) return;

    const elementUnderPointer = document.elementFromPoint(e.clientX, e.clientY);
    if (!boardElement.contains(elementUnderPointer)) return;

    const deltaX = e.clientX - pointerCoords.startX;
    const deltaY = e.clientY - pointerCoords.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (!isDragging && distance > DRAG_THRESHOLD) {
        isDragging = true;
        currentCell = currentCell || initialCell;
    }

    if (isDragging) {
        const targetCell = document.elementFromPoint(e.clientX, e.clientY)?.closest('#board div');
        if (targetCell?.parentElement === boardElement && targetCell !== currentCell) {
            // Si el arrastre vuelve a la letra anterior, deshacer la última selección
            if (targetCell === gameState.selectedCells[gameState.selectedCells.length - 2]) {
                undoLastSelection();
                currentCell = targetCell;
                vibrate(10);
            } else if (!targetCell.classList.contains('disabled') && 
                      !targetCell.classList.contains('selected') && 
                      areAdjacent(currentCell, targetCell)) {
                selectCell(targetCell);
                currentCell = targetCell;
                checkWord();
                vibrate(10); // Vibración corta para cada letra seleccionada
            }
        }
    }
}

function createCell(letter, x, y) {
    const cell = document.createElement('div');
    cell.textContent = letter;
    const coord = files[y] + ranks[x];
    cell.dataset.coord = coord;
    cell.dataset.x = x;
    cell.dataset.y = y;

    cell.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation(); 
    
        if (cell.classList.contains('disabled')) {
            resetSelection();
            isDragging = false;
            currentCell = null;
            return;
        }

        if (!gameState.canSelect) return;

        isDragging = false;
        dragPointerId = e.pointerId;
        pointerCoords = { startX: e.clientX, startY: e.clientY };
        
        handleClick(cell);
        currentCell = cell;

        const cleanup = () => {
            document.removeEventListener('pointermove', moveHandler);
            document.removeEventListener('pointerup', upHandler);
            document.removeEventListener('pointercancel', upHandler);
            isDragging = false;
            dragPointerId = null;
        };

        const moveHandler = (moveEvent) => handlePointerMove(moveEvent, cell);
        const upHandler = cleanup;

        document.addEventListener('pointermove', moveHandler);
        document.addEventListener('pointerup', upHandler);
    });

    return cell;
}

export function createBoard() {
    if (!boardNeedsReset) return;
    
    const board = getCurrentLevel().board;
    boardElement.innerHTML = '';
    
    board.forEach((row, y) => {
        row.forEach((letter, x) => {
            boardElement.appendChild(createCell(letter, x, y));
        });
    });

    boardNeedsReset = false;
    
    // Agregar listener al board para deseleccionar cuando se clickea el fondo
    boardElement.addEventListener('pointerdown', (e) => {
        if (e.target === boardElement) {
            resetSelection();
            isDragging = false;
            currentCell = null;
        }
    });
    
    boardElement.addEventListener('pointerleave', () => {
        if (isDragging) isDragging = false;
    });
}

document.addEventListener('boardShouldReset', () => {
    boardNeedsReset = true;
});