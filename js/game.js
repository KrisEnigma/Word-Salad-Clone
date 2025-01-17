import { LEVELS, LEVEL_ORDER } from './levels.js';
import { SelectionManager } from './selection.js';
import { AnimationManager } from './animations.js';
import { ThemeSelector } from './themeSelector.js';

class GameState {
    constructor() {
        this.themeSelector = new ThemeSelector();
        
        // Inicializar carga en dos fases
        this.initPhase1()
            .then(() => this.initPhase2())
            .catch(error => {
                console.error('Error during initialization:', error);
                this.showContent();
            });

        // Agregar listener para cambios de tema
        window.addEventListener('themechange', (e) => {
            console.log('Evento themechange recibido:', e.detail);
            this.handleThemeChange(e.detail.theme);
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

    // Nuevo método para manejar cambios de tema
    handleThemeChange(themeName) {
        console.log('handleThemeChange:', themeName);
        
        const recalculateAll = () => {
            console.log('Recalculando después del cambio de tema');
            this.fitTitle();
            this.updateWordList();
        };

        // Primera pasada inmediata
        requestAnimationFrame(() => {
            console.log('Primera pasada de recálculo');
            recalculateAll();
        });

        // Segunda pasada después de cargar fuentes
        document.fonts.ready.then(() => {
            console.log('Fuentes cargadas, segunda pasada');
            requestAnimationFrame(() => {
                recalculateAll();
                
                // Tercera pasada después de un delay
                setTimeout(() => {
                    console.log('Recálculo final');
                    this.fitTitle();
                }, 150);
            });
        });
    }

    showContent() {
        const body = document.body;
        const overlay = document.querySelector('.js-loading-overlay');
        
        // Asegurar que las transiciones funcionen
        requestAnimationFrame(() => {
            // Primero mostrar el contenido del body
            body.style.opacity = '1';
            body.classList.remove('js-loading');
            
            if (overlay) {
                // Ocultar el overlay
                overlay.classList.add('hidden');
                
                // Remover el overlay después de la transición
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

        // Agregar el ajuste automático del título
        const title = this.titleElement;
        
        // Mover la función fitTitle fuera para poder reutilizarla
        this.fitTitle = () => {
            const title = this.titleElement;
            const container = title.parentElement;
            
            const adjustTitle = () => {
                // Reset completo de estilos
                title.style = '';
                
                // Forzar reflow
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

            // Secuencia de ajustes para asegurar el cálculo correcto
            const performAdjustments = async () => {
                // Primer intento inmediato
                adjustTitle();

                // Esperar a que las fuentes estén cargadas
                await document.fonts.ready;
                
                // Segunda pasada después de cargar fuentes
                requestAnimationFrame(() => {
                    adjustTitle();
                    
                    // Tercera pasada después de un breve delay
                    setTimeout(() => {
                        adjustTitle();
                        
                        // Última pasada para asegurar
                        requestAnimationFrame(() => {
                            adjustTitle();
                        });
                    }, 100);
                });
            };

            performAdjustments();
        };

        // Observar cambios en el contenido del título
        new MutationObserver(() => {
            this.fitTitle();
        }).observe(title, {
            childList: true,
            characterData: true,
            subtree: true
        });

        // Ajustar en cambios de tamaño
        window.addEventListener('resize', () => {
            requestAnimationFrame(() => this.fitTitle());
        });
        
        // Ajuste inicial con retardo para asegurar carga
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
        // Limpiar cualquier letra animada que quede en el body
        document.querySelectorAll('.animated-letter').forEach(el => el.remove());
        this.currentLevel = { ...LEVELS[levelId], id: levelId };
        [this.foundWords, this.usedLetters].forEach(set => set.clear());
        this.resetSelection();
        this.updateAll(levelId);
    }

    updateAll(levelId) {
        if (!this.currentLevel) return; // Agregar esta verificación
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

            // Agregar una M extra al final para asegurar espacio suficiente
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
            // Verificar victoria y detener timer ANTES de todo
            if (this.foundWords.size === Object.keys(this.currentLevel.data).length) {
                this.pauseTimer();
                // Actualizar el tiempo final inmediatamente
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

    onLevelComplete() {
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
            // No resetear ni cerrar nada si el click está relacionado con el modal de victoria
            if (event.target.closest('#victory-modal')) return;

            // No resetear si el click está relacionado con el menú o modales
            if (event.target.closest('.modal-overlay') || 
                event.target.closest('.menu') || 
                event.target.closest('.modal-content')) {
                return;
            }

            // Solo resetear si el click fue fuera del tablero y no en elementos de UI
            if (!event.target.closest('.board')) {
                this.selectionManager.reset();
                this.handleModalClose(event);
            }
        });

        // Modificar el ResizeObserver para recalcular los anchos
        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(() => {
                AnimationManager.cleanupAnimations();
                // Volver a calcular los anchos cuando cambia el tamaño
                this.updateWordList();
            });
        });

        resizeObserver.observe(document.documentElement);

        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', () => {
                if (modal.classList.contains('active') && modal.id !== 'victory-modal') {
                    modal.classList.remove('active');
                    if (modal === document.getElementById('modal')) {
                        this.resumeTimer();
                    }
                }
            });
        });
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
        // El modal y confeti se activan en onLevelComplete
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

    bindModalEvents() {
        const modalHandlers = {
            menu: document.querySelector('.menu'),
            modal: document.getElementById('modal'),
            victoryModal: document.getElementById('victory-modal')
        };

        // Remover duplicados y asegurar consistencia en la lógica de cierre
        const closeModal = (modal) => {
            // No cerrar si es el modal de victoria
            if (modal?.id === 'victory-modal') return;
            
            modal?.classList.remove('active');
            if (modal === modalHandlers.modal) {
                this.resumeTimer();
            }
        };

        // Eliminar los listeners redundantes y mantener solo uno por modal
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            if (modal.id === 'victory-modal') return;

            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    closeModal(modal);
                }
            });
        });

        // Actualizar el manejo de botones para usar closeModal
        document.querySelectorAll('.back-button, #modal .menu-options button').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const modal = button.closest('.modal-overlay');
                closeModal(modal);
            });
        });

        // ...resto del código de bindModalEvents sin cambios...
        const handleButton = (buttonId) => {
            const buttonHandlers = {
                'reset-game': () => {
                    this.resetTimer();
                    this.loadLevel(this.currentLevel.id);
                    closeModal(modalHandlers.modal);
                },
                'restart-level': () => {
                    this.resetTimer();
                    this.loadLevel(this.currentLevel.id);
                    closeModal(modalHandlers.victoryModal);
                },
                'next-level': () => {
                    const nextIndex = LEVEL_ORDER.indexOf(this.currentLevel.id) + 1;
                    if (nextIndex < LEVEL_ORDER.length) {
                        this.resetTimer();
                        this.loadLevel(LEVEL_ORDER[nextIndex]);
                        closeModal(modalHandlers.victoryModal);
                    }
                }
            };

            buttonHandlers[buttonId]?.();
        };

        ['reset-game', 'restart-level', 'next-level'].forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => {  // Eliminar el parámetro event ya que no se usa
                    handleButton(buttonId);
                });
            }
        });

        modalHandlers.menu.addEventListener('click', event => {  // Cambiar e por event
            event.stopPropagation();
            const isOpening = !modalHandlers.modal.classList.contains('active');
            if (isOpening) {
                modalHandlers.modal.classList.add('active');
                this.pauseTimer();
            } else {
                modalHandlers.modal.classList.remove('active');
                this.resumeTimer();
            }
        });

        modalHandlers.modal.addEventListener('click', event => {  // Cambiar e por event
            if (event.target === modalHandlers.modal) {
                closeModal(modalHandlers.modal);
            }
        });

        document.querySelectorAll('.modal-content').forEach(content => {
            content.addEventListener('click', event => event.stopPropagation());  // Renombrar e a event
        });

        document.querySelectorAll('.modal-overlay').forEach(modal => {
            if (modal.id === 'victory-modal') return; // Skip victory modal
            
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    closeModal(modal);
                }
            });
        });

        document.addEventListener('keydown', e => {
            if (e.key.toLowerCase() === 'c') {
                AnimationManager.confetti.start();
            }
            if (e.key.toLowerCase() === 'v') {
                this.onLevelComplete();
            }
        });

        // Asegurarse de que el evento de cierre se aplique a todos los modales
        document.querySelectorAll('.back-button, #modal .menu-options button').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevenir que el click se propague
                // Cerrar el modal más cercano
                const modal = button.closest('.modal-overlay');
                modal.classList.remove('active');
                this.resumeTimer();
            });
        });

        // Manejar el cierre al hacer clic fuera del modal
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    this.resumeTimer();
                }
            });
        });
    }

    handleModalClose() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            if (modal.id === 'victory-modal') return;
            if (modal.classList.contains('active')) {
                modal.classList.remove('active');
                if (modal === document.getElementById('modal')) {
                    this.resumeTimer();
                }
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', () => new GameState());