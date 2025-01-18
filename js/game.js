import { LEVELS, LEVEL_ORDER } from './levels.js';
import { SelectionManager } from './selection.js';
import { AnimationManager } from './animations.js';
import { ThemeSelector } from './themeSelector.js';

class GameState {
    constructor() {
        this.themeSelector = new ThemeSelector();
        
        this.initPhase1()
            .then(() => this.initPhase2())
            .catch(error => {
                console.error('Error during initialization:', error);
                this.showContent();
            });

        window.addEventListener('themechange', () => {
            this.handleThemeChange();
        });
    }

    async initPhase1() {
        await this.themeSelector.loadThemesData();
        this.themeSelector.applyInitialTheme();
        
        this.initializeElements();
        this.initializeState();
        this.initializeBoard();
        this.bindEvents();
    }

    async initPhase2() {
        this.currentLevel = { ...LEVELS[LEVEL_ORDER[0]], id: LEVEL_ORDER[0] };
        this.updateAll(LEVEL_ORDER[0]);
        await this.themeSelector.initialize();
        this.showContent();
    }

    setTheme(themeName) {
        console.log('setTheme llamado:', themeName);
        return this.themeSelector.setTheme(themeName);
    }

    handleThemeChange() {
        const recalculateUI = () => {
            this.fitTitle();
            this.updateWordList();
        };

        requestAnimationFrame(() => {
            recalculateUI();
            document.fonts.ready.then(() => {
                recalculateUI();
                setTimeout(this.fitTitle.bind(this), 150);
            });
        });
    }

    showContent() {
        const body = document.body;
        const overlay = document.querySelector('.js-loading-overlay');
        
        requestAnimationFrame(() => {
            body.style.opacity = '1';
            body.classList.remove('js-loading');
            
            if (overlay) {
                overlay.classList.add('hidden');
                
                overlay.addEventListener('transitionend', () => {
                    overlay.remove();
                }, { once: true });
            }
        });
    }

    initializeElements() {
        this.board = document.querySelector('.board');
        this.wordList = document.querySelector('.word-list');
        this.titleElement = document.querySelector('.title');
        this.levelNumberElement = document.querySelector('.level-number');
        this.timer = {
            element: document.querySelector('.timer'),
            startTime: 0,
            elapsed: 0,
            interval: null,
            isPaused: false
        };

        const title = this.titleElement;
        
        this.fitTitle = () => {
            const title = this.titleElement;
            const container = title.parentElement;
            
            const adjustTitle = () => {
                title.style = '';
                
                void title.offsetWidth;
                
                const availableWidth = container.clientWidth - 
                    (parseFloat(getComputedStyle(container).paddingLeft) + 
                    parseFloat(getComputedStyle(container).paddingRight)) - 20;
                
                const titleWidth = title.scrollWidth;
                const currentFontSize = parseFloat(getComputedStyle(title).fontSize);
                
                if (titleWidth > availableWidth) {
                    const scale = availableWidth / titleWidth;
                    const minFontSize = parseFloat(getComputedStyle(document.documentElement)
                        .getPropertyValue('--title-min-font'));
                    const newSize = Math.max(minFontSize, currentFontSize * scale);
                    title.style.fontSize = `${newSize}px`;
                }
            };

            const performAdjustments = async () => {
                adjustTitle();
                await document.fonts.ready;
                requestAnimationFrame(() => {
                    adjustTitle();
                    setTimeout(() => {
                        adjustTitle();
                        requestAnimationFrame(() => {
                            adjustTitle();
                        });
                    }, 100);
                });
            };

            performAdjustments();
        };

        new MutationObserver(() => {
            this.fitTitle();
        }).observe(title, {
            childList: true,
            characterData: true,
            subtree: true
        });

        window.addEventListener('resize', () => {
            requestAnimationFrame(() => this.fitTitle());
        });
        
        setTimeout(() => this.fitTitle(), 0);
    }

    initializeState() {
        this.currentLevel = null;
        this.foundWords = new Set();
        this.usedLetters = new Set();
        this.availableThemes = new Map();
        this.themeDisplayNames = new Map();
        this.categoryOrder = [];

        this.selectionManager = new SelectionManager(
            this.board,
            null,
            (selection) => this.onSelectionUpdate(selection)
        );
    }

    onSelectionUpdate(selection) {
        if (this.checkWord(selection)) {
            AnimationManager.resetSelectionWithDelay(this.selectionManager);
        }
    }

    initializeBoard() {
        const fragment = document.createDocumentFragment();
        for (let i = 1; i <= 16; i++) {
            const row = String.fromCharCode(96 + Math.ceil(i / 4));
            const col = ((i - 1) % 4) + 1;
            const position = `${row}${col}`;

            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `tile-${position}`;
            cell.innerHTML = `
                <div class="hitbox" data-position="${position}"></div>
                <div class="mark" id="mark-${position}"></div>
                <div class="text" id="letter-${position}"></div>
            `;
            fragment.appendChild(cell);
        }
        this.board.appendChild(fragment);
    }

    updateBoard() {
        if (!this.currentLevel) return;

        const grid = Array(4).fill().map(() => Array(4).fill(''));
        const positions = Array(16).fill().map((unused, i) => {
            const row = String.fromCharCode(96 + Math.ceil((i + 1) / 4));
            const col = (i % 4) + 1;
            return `${row}${col}`;
        });

        positions.forEach(pos =>
            document.getElementById(`tile-${pos}`).classList.remove('found-temp', 'unused')
        );

        Object.entries(this.currentLevel.data).forEach(([word, path]) => {
            word.replace(/\s+/g, '').split('').forEach((letter, i) => {
                const pos = path.slice(i * 2, i * 2 + 2);
                if (pos.length === 2) {
                    const row = pos.charCodeAt(0) - 97;
                    const col = parseInt(pos[1]) - 1;
                    if (row >= 0 && row < 4 && col >= 0 && col < 4 && !grid[row][col]) {
                        grid[row][col] = letter;
                    }
                }
            });
        });

        positions.forEach((pos, i) => {
            document.getElementById(`letter-${pos}`).textContent =
                grid[Math.floor(i / 4)][i % 4];
        });
    }

    resetSelection() {
        this.selectionManager.reset();
    }

    loadLevel(levelId) {
        AnimationManager.stopConfetti();
        this.resetControls();
        document.querySelectorAll('.animated-letter').forEach(el => el.remove());
        this.currentLevel = { ...LEVELS[levelId], id: levelId };
        [this.foundWords, this.usedLetters].forEach(set => set.clear());
        this.resetSelection();
        this.updateAll(levelId);
    }

    updateAll(levelId) {
        if (!this.currentLevel) return;
        this.updateBoard();
        this.updateTitle();
        this.updateWordList();
        this.updateUnusedLetters();
        this.updateLevelNumber(levelId);
        this.resetTimer();
        this.startTimer();
    }

    updateTitle() {
        if (this.titleElement && this.currentLevel) {
            this.titleElement.textContent = this.currentLevel.name;
        }
    }

    updateWordList() {
        if (!this.wordList) return;

        this.wordList.innerHTML = '';
        const fragment = document.createDocumentFragment();
        const words = Object.keys(this.currentLevel.data).sort((a, b) => a.localeCompare(b));

        const measureElement = document.createElement('div');
        measureElement.className = 'word word-measure';
        measureElement.style.cssText = `
            position: absolute;
            visibility: hidden;
            height: auto;
            width: auto;
            white-space: nowrap;
        `;
        document.body.appendChild(measureElement);

        words.forEach((word, index) => {
            const el = document.createElement('div');
            el.className = 'word';
            el.setAttribute('data-index', index);

            const isFound = this.foundWords.has(word);
            const span = document.createElement('span');

            measureElement.textContent = word + 'M';
            el.style.setProperty('--word-content-width', `${measureElement.offsetWidth}px`);

            if (isFound) {
                el.classList.add('found');
                span.textContent = word;
            } else {
                const lengths = word.split(' ').map(part => part.length);
                span.innerHTML = `<span class="word-length">${lengths.join(', ')}</span>`;
            }

            el.appendChild(span);
            fragment.appendChild(el);
        });

        document.body.removeChild(measureElement);
        this.wordList.appendChild(fragment);
    }

    checkWord(selection) {
        if (!selection?.length) return false;

        const currentPath = selection.join('');
        for (const [word, path] of Object.entries(this.currentLevel.data)) {
            if (path === currentPath && !this.foundWords.has(word)) {
                const wordIndex = Object.keys(this.currentLevel.data)
                    .sort((a, b) => a.localeCompare(b))
                    .indexOf(word);
                const wordElement = this.wordList.querySelector(`[data-index="${wordIndex}"]`);

                if (wordElement?.classList.contains('found')) {
                    return false;
                }

                this.foundWords.add(word);
                if (wordElement) {
                    wordElement.classList.add('found', 'found-initial');

                    wordElement.addEventListener('animationend', () => {
                        wordElement.classList.remove('found-initial');
                    }, { once: true });
                }

                this.animateFound(selection);
                this.resetControls();
                return true;
            }
        }
        return false;
    }

    async animateFound(selection) {
        const currentPath = selection.join('');
        const foundWord = Object.entries(this.currentLevel.data)
            .find(([, path]) => path === currentPath)?.[0];

        if (foundWord) {
            if (this.foundWords.size === Object.keys(this.currentLevel.data).length) {
                this.pauseTimer();
                document.getElementById('final-time').textContent = this.timer.element.textContent;
            }

            const wordIndex = Object.keys(this.currentLevel.data)
                .sort((a, b) => a.localeCompare(b))
                .indexOf(foundWord);
            const wordElement = this.wordList.querySelector(`[data-index="${wordIndex}"]`);

            if (!wordElement) return;

            await AnimationManager.animateWordFound(selection, wordElement, foundWord);
            this.updateUnusedLetters();
            
            if (this.foundWords.size === Object.keys(this.currentLevel.data).length) {
                this.onLevelComplete();
            }
        }
    }

    updateUnusedLetters() {
        this.usedLetters.clear();

        Object.entries(this.currentLevel.data).forEach(([word, path]) => {
            if (!this.foundWords.has(word)) {
                for (let i = 0; i < path.length; i += 2) {
                    const pos = path.slice(i, i + 2);
                    if (pos.length === 2) this.usedLetters.add(pos);
                }
            }
        });

        const unusedPositions = [];
        for (let i = 1; i <= 16; i++) {
            const row = String.fromCharCode(96 + Math.ceil(i / 4));
            const col = ((i - 1) % 4) + 1;
            const pos = `${row}${col}`;
            const cell = document.getElementById(`tile-${pos}`);

            if (!this.usedLetters.has(pos)) {
                unusedPositions.push(pos);
                cell.querySelector('.hitbox')?.remove();
            } else {
                AnimationManager.updateCellStates([cell], { remove: ['unused'] });
                if (!cell.querySelector('.hitbox')) {
                    const newHitbox = document.createElement('div');
                    newHitbox.className = 'hitbox';
                    newHitbox.dataset.position = pos;
                    cell.insertBefore(newHitbox, cell.firstChild);
                }
            }
        }

        if (unusedPositions.length) {
            AnimationManager.animateUnusedCells(unusedPositions);
        }
    }

    async onLevelComplete() {
        AnimationManager.animateVictory(() => this.showVictoryModal());
    }

    bindEvents() {
        const pointerEvents = {
            touchstart: 'handlePointerDown',
            touchmove: 'handleTouchMove',
            touchend: 'handlePointerUp',
            touchcancel: 'handlePointerUp',
            mousedown: 'handlePointerDown',
            mousemove: 'handlePointerMove',
            mouseup: 'handlePointerUp',
            mouseleave: 'handlePointerOut',
            mouseenter: 'handlePointerEnter'
        };

        Object.entries(pointerEvents).forEach(([event, handler]) => {
            this.board.addEventListener(event, e =>
                this.selectionManager[handler].call(this.selectionManager, e),
                { passive: false }
            );
        });

        this.bindModalEvents();
        window.addEventListener('resize', () => this.selectionManager.drawLine());

        document.addEventListener('click', event => {
            const target = event.target;
            if (target.closest('#victory-modal') || 
                target.closest('.modal-content') || 
                target.closest('.menu')) return;

            if (!target.closest('.board')) {
                this.selectionManager.reset();
                if (target.closest('.modal-overlay')) {
                    this.handleModalClose();
                }
            }
        });

        new ResizeObserver(() => {
            requestAnimationFrame(() => {
                AnimationManager.cleanupAnimations();
                this.updateWordList();
            });
        }).observe(document.documentElement);
    }

    bindModalEvents() {
        const modalHandlers = {
            menu: document.querySelector('.menu'),
            modal: document.getElementById('modal'),
            themeModal: document.getElementById('theme-modal'),
            victoryModal: document.getElementById('victory-modal')
        };

        const isAnyModalActive = () => 
            Object.values(modalHandlers)
                .some(modal => modal?.classList.contains('active'));

        const closeModal = (modal) => {
            if (modal?.id === 'victory-modal') return;
            
            modal?.classList.remove('active');
            if (!isAnyModalActive()) {
                this.resumeTimer();
            }
        };

        const modalNavigation = {
            'menu': () => {
                modalHandlers.modal.classList.add('active');
                this.pauseTimer();
            },
            'theme-button': () => {
                modalHandlers.modal.classList.remove('active');
                modalHandlers.themeModal.classList.add('active');
            },
            'back-button': () => {
                modalHandlers.themeModal.classList.remove('active');
                modalHandlers.modal.classList.add('active');
            }
        };

        Object.entries(modalNavigation).forEach(([id, handler]) => {
            document.querySelector(id === 'menu' ? '.menu' : `#${id}`)
                ?.addEventListener('click', (event) => {
                    event.stopPropagation();
                    handler();
                });
        });

        const buttonHandlers = {
            'reset-game': () => {
                this.resetTimer();
                this.loadLevel(this.currentLevel.id);
                closeModal(modalHandlers.modal);
            },
            'restart-level': () => {
                this.resetTimer();
                this.loadLevel(this.currentLevel.id);
                modalHandlers.victoryModal.classList.remove('active');
            },
            'next-level': () => {
                const nextIndex = LEVEL_ORDER.indexOf(this.currentLevel.id) + 1;
                if (nextIndex < LEVEL_ORDER.length) {
                    this.resetTimer();
                    this.loadLevel(LEVEL_ORDER[nextIndex]);
                    modalHandlers.victoryModal.classList.remove('active');
                }
            }
        };

        Object.entries(buttonHandlers).forEach(([id, handler]) => {
            document.getElementById(id)?.addEventListener('click', handler);
        });

        modalHandlers.victoryModal?.addEventListener('click', event => {
            if (event.target === modalHandlers.victoryModal) {
                event.stopPropagation();
            }
        });

        document.querySelectorAll('.modal-overlay').forEach(modal => {
            if (modal.id === 'victory-modal') return;
            
            modal.addEventListener('click', event => {
                if (event.target === modal) {
                    closeModal(modal);
                }
            });
        });
    }

    handleModalClose() {
        const activeModal = document.querySelector('.modal-overlay.active:not(#victory-modal)');
        if (activeModal) {
            activeModal.classList.remove('active');
            if (!document.querySelector('.modal-overlay.active')) {
                this.resumeTimer();
            }
        }
    }

    startTimer() {
        this.timer.startTime = Date.now() - this.timer.elapsed;
        this.timer.isPaused = false;
        if (this.timer.interval) {
            clearInterval(this.timer.interval);
        }
        this.timer.interval = setInterval(() => {
            if (!this.timer.isPaused) {
                this.timer.elapsed = Date.now() - this.timer.startTime;
                this.updateTimerDisplay();
            }
        }, 100);
    }

    pauseTimer() {
        if (!this.timer.isPaused) {
            this.timer.isPaused = true;
            this.timer.elapsed = Date.now() - this.timer.startTime;
        }
    }

    resumeTimer() {
        if (this.timer.isPaused) {
            this.timer.isPaused = false;
            this.timer.startTime = Date.now() - this.timer.elapsed;
        }
    }

    resetTimer() {
        if (this.timer.interval) {
            clearInterval(this.timer.interval);
        }
        this.timer.elapsed = 0;
        this.timer.isPaused = false;
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const seconds = Math.floor(this.timer.elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const displaySeconds = String(seconds % 60).padStart(2, '0');
        const displayMinutes = String(minutes).padStart(2, '0');
        this.timer.element.textContent = `${displayMinutes}:${displaySeconds}`;
    }

    showVictoryModal() {
        this.pauseTimer();
        document.getElementById('final-time').textContent = this.timer.element.textContent;
        document.getElementById('victory-modal').classList.add('active');
    }

    updateLevelNumber(levelId) {
        if (this.levelNumberElement) {
            const levelNumber = LEVEL_ORDER.indexOf(levelId) + 1;
            this.levelNumberElement.textContent = `#${levelNumber}`;
        }
    }

    resetControls() {
        this.selectionManager.resetControls();
    }
}
document.addEventListener('DOMContentLoaded', () => new GameState());