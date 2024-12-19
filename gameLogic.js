import { updateHints, showVictory, createHints } from './ui.js';
import { createBoard } from './board.js';
import { getCurrentLevel } from './levels.js';

// Exportar gameState para que sea accesible
export const gameState = {
    selectedCells: [],
    selectedLetters: [],
    foundWords: [],
    lastClickedCell: null,
    canSelect: true,
    startTime: null,
    timerInterval: null
};

export function getWords() {
    return getCurrentLevel().words;
}

export function getSortedWords() {
    return [...getWords()].sort();
}

// Hacer la función vibrate exportable
export function vibrate(pattern) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

export function handleClick(cell) {
    if (!gameState.canSelect) return;

    // Si hacemos click en la última letra seleccionada, la deseleccionamos
    if (cell === gameState.lastClickedCell) {
        undoLastSelection();
        vibrate(10);
        return;
    }

    if (gameState.selectedCells.length === 0) {
        selectFirstCell(cell);
        vibrate(20); // Vibración corta al empezar selección
    } else if (!cell.classList.contains('selected') && areAdjacent(gameState.lastClickedCell, cell)) {
        selectAdditionalCell(cell);
        vibrate(10); // Vibración muy suave al continuar selección
    } else if (!cell.classList.contains('selected')) {
        resetAndSelectCell(cell);
        vibrate([20, 50, 20]); // Patrón de vibración al reiniciar selección
    }
}

// Añadir nueva función para deshacer última selección
export function undoLastSelection() {
    if (gameState.selectedCells.length > 0) {
        const lastCell = gameState.selectedCells.pop();
        lastCell.classList.remove('selected');
        gameState.selectedLetters.pop();
        gameState.lastClickedCell = gameState.selectedCells[gameState.selectedCells.length - 1] || null;
    }
}

function selectFirstCell(cell) {
    selectCell(cell);
    gameState.lastClickedCell = cell;
}

function selectAdditionalCell(cell) {
    selectCell(cell);
    gameState.lastClickedCell = cell;
    checkWord();
}

function resetAndSelectCell(cell) {
    if (!cell.classList.contains('disabled')) {
        resetSelection();
        selectFirstCell(cell);
    }
}

export function selectCell(cell) {
    if (!cell.classList.contains('selected')) {
        cell.classList.add('selected');
        gameState.selectedCells.push(cell);
        gameState.selectedLetters.push({ cell });
        gameState.lastClickedCell = cell;
    }
}

export function areAdjacent(cell1, cell2) {
    if (!cell1 || !cell2) return false;

    const x1 = parseInt(cell1.dataset.x);
    const y1 = parseInt(cell1.dataset.y);
    const x2 = parseInt(cell2.dataset.x);
    const y2 = parseInt(cell2.dataset.y);

    const xDiff = Math.abs(x1 - x2);
    const yDiff = Math.abs(y1 - y2);

    return (xDiff <= 1) && (yDiff <= 1) && !(xDiff === 0 && yDiff === 0);
}

export function checkWord() {
    const selectedWord = gameState.selectedLetters.map(({ cell }) => cell.textContent).join('');
    const currentWords = getWords();

    if (currentWords.includes(selectedWord) && !gameState.foundWords.includes(selectedWord)) {
        handleFoundWord(selectedWord);
    }
}

function handleFoundWord(word) {
    gameState.foundWords.push(word);
    updateHints(word);
    animateFoundWord();
    vibrate([50, 30, 50, 30, 50]);

    // Asegurar que la comprobación de victoria sea correcta
    const totalWords = getWords().length;
    const foundWords = gameState.foundWords.length;

    if (foundWords === totalWords) {
        gameState.canSelect = false; // Prevenir más selecciones
        clearInterval(gameState.timerInterval);

        // Dar tiempo para que termine la animación de la última palabra
        setTimeout(() => {
            vibrate([100, 50, 100, 50, 200]);
            showVictory();
        }, 800); // Aumentado a 800ms para asegurar que las animaciones terminen
    }

    resetSelection();
}

function isCoordUsedInRemainingWords(coord) {
    const { wordPaths } = getCurrentLevel();
    const remainingWords = getWords().filter(word => !gameState.foundWords.includes(word));

    for (const word of remainingWords) {
        if (wordPaths[word].includes(coord)) return true;
    }

    return false;
}

function animateFoundWord() {
    const foundLetters = gameState.selectedLetters;

    foundLetters.forEach(({ cell }) => {
        cell.classList.add('word-found');
        const coord = cell.dataset.coord;

        if (!isCoordUsedInRemainingWords(coord)) {
            requestAnimationFrame(() => {
                cell.classList.add('animate');

                cell.addEventListener('animationend', function handleFlash(e) {
                    if (e.animationName === 'found-flash') {
                        cell.classList.remove('animate');
                        cell.classList.add('to-disable');

                        requestAnimationFrame(() => {
                            cell.classList.add('animate');
                            cell.addEventListener('animationend', function handleDisappear(e) {
                                if (e.animationName === 'disappear') {
                                    cell.classList.remove('word-found', 'to-disable', 'animate');
                                    cell.classList.add('disabled');
                                    cell.style.pointerEvents = 'all';
                                    cell.addEventListener('pointerdown', () => {
                                        console.log('Disabled cell clicked');
                                        resetSelection();
                                    }, { capture: true });
                                }
                            }, { once: true });
                        });
                    }
                }, { once: true });
            });
        } else {
            // Para letras que solo brillan
            requestAnimationFrame(() => {
                cell.classList.add('animate');
                cell.addEventListener('animationend', () => {
                    cell.classList.remove('word-found', 'animate');
                }, { once: true });
            });
        }
    });
}

export function resetSelection() {
    gameState.selectedCells.forEach(cell => cell.classList.remove('selected'));
    gameState.selectedCells = [];
    gameState.selectedLetters = [];
    gameState.lastClickedCell = null;
}

export function resetGame() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }

    Object.assign(gameState, {
        foundWords: [],
        selectedCells: [],
        selectedLetters: [],
        lastClickedCell: null,
        canSelect: true,
        startTime: null,
        timerInterval: null
    });

    if (document.dispatchEvent(new Event('boardShouldReset'))) {
        createBoard();
    }

    createHints(getSortedWords());
    startTimer();
}

export function startTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }

    const timerElement = document.getElementById('timer');
    gameState.startTime = Date.now();
    timerElement.textContent = '00:00';

    gameState.timerInterval = setInterval(() => {
        updateTimer();
    }, 1000);

    updateTimer();
}

function updateTimer() {
    const timerElement = document.getElementById('timer');
    const elapsed = Date.now() - gameState.startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    timerElement.textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}