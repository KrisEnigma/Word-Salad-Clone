import { LEVELS, LEVEL_ORDER } from './levelData.js';

let currentLevelId = LEVEL_ORDER[0];

function generateBoard(wordPaths) {
    const board = Array(4).fill().map(() => Array(4).fill(''));
    const files = 'abcd';
    const ranks = '1234';

    Object.entries(wordPaths).forEach(([word, paths]) => {
        paths.forEach((coord, index) => {
            const file = coord[0];
            const rank = coord[1];
            const y = files.indexOf(file);
            const x = ranks.indexOf(rank);
            
            if (board[y][x] === '') {
                board[y][x] = word[index];
            } else if (board[y][x] !== word[index]) {
                throw new Error(`Conflicto de letras en ${coord}: "${board[y][x]}" vs "${word[index]}"`);
            }
        });
    });

    const emptySpaces = [];
    board.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === '') {
                emptySpaces.push(`${files[x]}${ranks[y]}`);
            }
        });
    });

    if (emptySpaces.length > 0) {
        throw new Error(`Nivel inválido: Espacios sin usar en ${emptySpaces.join(', ')}`);
    }

    return board;
}

export function getCurrentLevel() {
    const level = LEVELS[currentLevelId];
    level.words = Object.keys(level.wordPaths);
    level.board = generateBoard(level.wordPaths);
    return level;
}

export function nextLevel() {
    const currentIndex = LEVEL_ORDER.indexOf(currentLevelId);
    if (currentIndex < LEVEL_ORDER.length - 1) {
        currentLevelId = LEVEL_ORDER[currentIndex + 1];
        return true;
    }
    return false;
}

export function getLevelNumber() {
    return LEVEL_ORDER.indexOf(currentLevelId) + 1;
}
