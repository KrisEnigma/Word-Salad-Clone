import { LEVELS, LEVEL_ORDER } from './levels.js';
import { SelectionManager } from './selection.js';
import { AnimationManager } from './animations.js';
import { ThemeSelector } from './themeSelector.js';
import { Timer } from './timer.js';
import { Config } from './config.js';

class GameState {
    constructor() {
        this.themeSelector = new ThemeSelector();
        this.initialize().catch(error => {
            console.error('Error crítico durante inicialización:', error);
            // Mostrar un mensaje de error al usuario
            this.handleInitializationError(error);
        });
    }

    handleInitializationError(error) {
        const overlay = document.querySelector('.js-loading-overlay');
        if (overlay) {
            const loader = overlay.querySelector('.loader');
            if (loader) loader.style.display = 'none';

            const errorMessage = document.createElement('div');
            errorMessage.style.cssText = 'color: white; text-align: center; padding: 20px;';
            errorMessage.innerHTML = `
                <p>Error al cargar el juego</p>
                <small style="color: #ff6b6b;">${error.message || 'Error desconocido'}</small>
                <button onclick="location.reload()" style="
                    margin-top: 15px;
                    padding: 8px 16px;
                    border: none;
                    background: #4a4a4a;
                    color: white;
                    border-radius: 4px;
                ">Reintentar</button>
            `;
            overlay.appendChild(errorMessage);
        }
    }

    async initialize() {
        console.log('🎮 Iniciando GameState...');
        try {
            console.log('📝 Inicializando Config...');
            await Config.init();

            console.log('🎨 Iniciando fase 1...');
            await this.initPhase1();

            console.log('🎯 Iniciando fase 2...');
            await this.initPhase2();

            console.log('✅ Inicialización completada');
        } catch (error) {
            console.error('❌ Error durante inicialización:', error);
            throw error;
        }
    }

    async initPhase1() {
        // Cargar el tema primero
        await this.themeSelector.loadThemesData();
        await this.themeSelector.applyInitialTheme();

        // Importante: Cargar primero el último nivel guardado
        const lastLevelId = await Config.getLastLevel();
        console.log('🎮 Cargando nivel:', lastLevelId);

        // Inicializar elementos y estado
        this.initializeElements();
        this.initializeState();
        this.initializeBoard();
        this.bindEvents();

        // Asegurar que el nivel actual se establece correctamente
        this.currentLevel = { ...LEVELS[lastLevelId], id: lastLevelId };
    }

    async initPhase2() {
        // Verificar que tenemos un nivel válido
        if (!this.currentLevel || !LEVELS[this.currentLevel.id]) {
            console.warn('⚠️ Nivel no válido, usando fallback');
            const fallbackId = LEVEL_ORDER[0];
            this.currentLevel = { ...LEVELS[fallbackId], id: fallbackId };
        }

        // Actualizar la UI con el nivel actual
        console.log('🎯 Actualizando nivel:', this.currentLevel.id);
        this.updateAll(this.currentLevel.id);

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
        const timerElement = document.querySelector('.timer');
        this.timer = new Timer(timerElement);

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

    async loadLevel(levelId) {
        console.log('📥 Cargando nivel:', levelId);

        // Verificar si el nivel está desbloqueado
        if (!(await Config.isLevelUnlocked(levelId))) {
            console.warn('🔒 Intento de acceder a nivel bloqueado:', levelId);
            return;
        }

        // Limpiar estado anterior
        AnimationManager.stopConfetti();
        this.resetControls();
        document.querySelectorAll('.animated-letter').forEach(el => el.remove());

        // Actualizar estado actual
        this.currentLevel = { ...LEVELS[levelId], id: levelId };
        [this.foundWords, this.usedLetters].forEach(set => set.clear());
        this.resetSelection();

        // Actualizar UI
        this.updateAll(levelId);

        // Guardar el nivel actual como último nivel jugado
        await Config.set(Config.KEYS.LAST_LEVEL, levelId);
        console.log('✅ Nivel cargado:', levelId);
    }

    updateAll(levelId) {
        if (!this.currentLevel || !this.currentLevel.data) {
            console.error('No hay nivel válido para actualizar');
            return;
        }
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
        if (!this.wordList || !this.currentLevel?.data) return;

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
                span.innerHTML = `<span class="word-length">${lengths.join(' + ')}</span>`;
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
        const currentIndex = LEVEL_ORDER.indexOf(this.currentLevel.id);
        const isLastLevel = currentIndex === LEVEL_ORDER.length - 1;

        // Preparar el botón antes de cualquier animación
        const nextLevelButton = document.getElementById('next-level');
        if (nextLevelButton) {
            if (isLastLevel) {
                nextLevelButton.textContent = 'Reiniciar Juego';
                nextLevelButton.onclick = async () => {
                    await Config.set(Config.KEYS.LAST_LEVEL, LEVEL_ORDER[0]);
                    await Config.set(Config.KEYS.HIGHEST_LEVEL, '0');
                    location.reload();
                };
            } else {
                const nextLevelId = LEVEL_ORDER[currentIndex + 1];
                nextLevelButton.textContent = 'Siguiente Nivel';
                nextLevelButton.onclick = () => this.loadLevel(nextLevelId);
                nextLevelButton.disabled = true; // Empezar deshabilitado
            }
        }

        if (!isLastLevel) {
            const nextLevelId = LEVEL_ORDER[currentIndex + 1];
            console.log('🎯 Desbloqueando siguiente nivel:', nextLevelId);

            try {
                const unlocked = await Config.unlockLevel(nextLevelId);
                if (unlocked) {
                    console.log('✅ Nivel desbloqueado:', nextLevelId);
                    if (nextLevelButton) {
                        nextLevelButton.disabled = false;
                    }
                } else {
                    console.warn('⚠️ No se pudo desbloquear el nivel:', nextLevelId);
                }
            } catch (error) {
                console.error('❌ Error al desbloquear nivel:', error);
            }
        }

        await AnimationManager.animateVictory(() => {
            this.showVictoryModal();
        });
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
            'next-level': async () => {
                const currentIndex = LEVEL_ORDER.indexOf(this.currentLevel.id);
                const nextIndex = currentIndex + 1;

                if (nextIndex < LEVEL_ORDER.length) {
                    const nextLevelId = LEVEL_ORDER[nextIndex];
                    console.log('🎮 Intentando cargar nivel:', nextLevelId);

                    // Verificar explícitamente que el nivel está desbloqueado
                    if (await Config.isLevelUnlocked(nextLevelId)) {
                        console.log('✅ Cargando siguiente nivel:', nextLevelId);
                        this.resetTimer();
                        await this.loadLevel(nextLevelId);
                        modalHandlers.victoryModal.classList.remove('active');
                    } else {
                        console.warn('🔒 Error: Nivel no desbloqueado:', nextLevelId);
                    }
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

        // Agregar manejo del botón de vibración
        const toggleHaptics = document.getElementById('toggle-haptics');
        if (toggleHaptics) {
            Config.isHapticsEnabled().then(enabled => {
                toggleHaptics.classList.toggle('active', enabled);
                this.updateHapticsIcon(enabled);
            });

            toggleHaptics.addEventListener('click', async () => {
                const newState = !(await Config.isHapticsEnabled());
                await Config.setHapticsEnabled(newState);
                toggleHaptics.classList.toggle('active', newState);
                this.updateHapticsIcon(newState);
            });
        }
    }

    updateHapticsIcon(enabled) {
        const icon = document.querySelector('#toggle-haptics .icon');
        if (icon) {
            icon.textContent = enabled ? '🔊' : '🔇';
        }
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
        this.timer.start();
    }

    pauseTimer() {
        this.timer.stop();
    }

    resumeTimer() {
        if (this.timer.pausedTime !== null) {
            this.timer.start();
        }
    }

    resetTimer() {
        this.timer.reset();
        this.timer.start();
    }

    updateTimerDisplay() {
        // El timer ya maneja su propia actualización
    }

    showVictoryModal() {
        this.pauseTimer();
        const finalTimeSpan = document.getElementById('final-time');
        const restartLevelButton = document.getElementById('restart-level');

        finalTimeSpan.textContent = this.timer.element.textContent;
        restartLevelButton.onclick = () => this.loadLevel(this.currentLevel.id);

        document.getElementById('victory-modal').classList.add('active');
    }

    updateLevelNumber(levelId) {
        const levelNumber = LEVEL_ORDER.indexOf(levelId) + 1;
        const levelNumberElement = document.querySelector('.level-number');
        if (levelNumberElement) {
            levelNumberElement.textContent = `#${levelNumber}`;
        }
    }

    resetControls() {
        if (this.selectionManager) {
            this.selectionManager.resetControls();
        }
    }
}

// Agregar detector global de errores
window.addEventListener('error', function (event) {
    console.error('Error global capturado:', event.error);
});

// Agregar detector de promesas no manejadas
window.addEventListener('unhandledrejection', function (event) {
    console.error('Promesa rechazada no manejada:', event.reason);
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM cargado, iniciando juego...');
    new GameState();
});