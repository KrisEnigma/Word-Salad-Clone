import { LEVELS, LEVEL_ORDER } from './levels.js';
import { SelectionManager } from './selection.js';
import { AnimationManager } from './animations.js';

class GameState {
    constructor() {
        this.initializeThemeLoading()
            .then(() => {
                this.initializeElements();
                this.initializeState();
                this.initializeBoard();
                this.bindEvents();

                this.currentLevel = { ...LEVELS[LEVEL_ORDER[0]], id: LEVEL_ORDER[0] };
                this.updateAll(LEVEL_ORDER[0]);

                // Mostrar el contenido cuando todo esté listo
                this.showContent();
            })
            .catch(error => {
                console.error('Error en la inicialización:', error);
                // Fallback a tema dark y mostrar contenido
                document.documentElement.setAttribute('data-theme', 'dark');
                this.showContent();
            });
    }

    async initializeThemeLoading() {
        // Obtener tema guardado o usar dark como fallback
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        try {
            // Cargar temas en paralelo
            const [themeFiles] = await Promise.all([
                this.listThemeFiles(),
                this.preloadDefaultTheme() // Asegurar que el tema dark esté cargado
            ]);

            // Cargar resto de temas en segundo plano
            this.loadRemainingThemes(themeFiles);

            // Inicializar selector de temas
            await this.loadAvailableThemes();
            this.initializeThemeSelector();
        } catch (error) {
            console.error('Error loading themes:', error);
            throw error;
        }
    }

    async preloadDefaultTheme() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'styles/themes/basic.css';
        
        const loaded = new Promise((resolve, reject) => {
            link.onload = resolve;
            link.onerror = reject;
        });
        
        document.head.appendChild(link);
        await loaded;
    }

    loadRemainingThemes(themeFiles) {
        themeFiles.forEach(file => {
            if (file !== 'basic.css') {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = `styles/themes/${file}`;
                document.head.appendChild(link);
            }
        });
    }

    showContent() {
        requestAnimationFrame(() => {
            document.body.classList.remove('js-loading');
            const overlay = document.querySelector('.js-loading-overlay');
            if (overlay) {
                overlay.classList.add('hidden');
                setTimeout(() => overlay.remove(), 300);
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

    async loadThemeStylesheets() {
        try {
            const cssFiles = await this.listThemeFiles();
            if (!cssFiles?.length) {
                throw new Error('No se encontraron archivos de tema');
            }

            cssFiles.forEach(cssFile => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = `styles/themes/${cssFile}`;
                document.head.appendChild(link);
            });
        } catch (error) {
            console.error('Error loading theme stylesheets:', error);
            throw error;
        }
    }

    async listThemeFiles() {
        try {
            // Primero intentar obtener la lista desde themes.json
            const response = await fetch('styles/themes/themes.json');
            if (!response.ok) throw new Error('No se pudo obtener la lista de temas');

            const data = await response.json();
            return data.themes;
        } catch (error) {
            console.error('Error listing theme files:', error);
            // Fallback a lista predefinida
            return ['basic.css', 'retro-games.css', 'modern-games.css'];
        }
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

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.board') && !e.target.closest('.modal-content')) {
                this.selectionManager.reset();
                this.handleModalClose(e);
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

    async loadAvailableThemes() {
        try {
            const themes = new Map();
            this.themeDisplayNames = new Map();
            this.categoryOrder = [];

            const cssFiles = await this.listThemeFiles();
            if (!cssFiles?.length) {
                throw new Error('No se encontraron archivos de tema');
            }

            // Procesar cada archivo de tema
            for (const cssFile of cssFiles) {
                const cssContent = await (await fetch(`styles/themes/${cssFile}`)).text();
                this.processThemeFile(cssContent, themes);
            }

            this.availableThemes = themes;
            return themes;
        } catch (error) {
            console.error('Error loading themes:', error);
            throw error;
        }
    }

    processThemeFile(cssContent, themes) {
        const categoryMatch = cssContent.match(/\/\* Category:\s*([^*]+?)\s*\*\//);
        const category = categoryMatch ? categoryMatch[1].trim() : 'Sin Categoría';

        if (!this.categoryOrder.includes(category)) {
            this.categoryOrder.push(category);
        }

        const themeSet = new Set();
        const themeMatches = [...cssContent.matchAll(/\/\* Theme:\s*([^*]+?)\s*\*\//g)];

        themeMatches.forEach(match => {
            const originalName = match[1].trim();
            const normalizedName = originalName.toLowerCase()
                .replace(/\s+/g, '')
                .replace(/-/g, '');

            this.themeDisplayNames.set(normalizedName, originalName);
            themeSet.add(normalizedName);
        });

        if (themeSet.size > 0) {
            themes.set(category, themes.has(category)
                ? new Set([...themes.get(category), ...themeSet])
                : themeSet
            );
        }
    }

    initializeThemeSelector() {
        const themeGrid = document.querySelector('.theme-grid');
        if (!themeGrid) return;

        let html = '';

        this.categoryOrder.forEach(category => {
            const themes = this.availableThemes.get(category);
            if (themes?.size > 0) {
                html += `<div class="theme-category">${category}</div>`;
                Array.from(themes).sort().forEach(theme => {
                    const isActive = document.documentElement.getAttribute('data-theme') === theme;
                    html += `
                        <button class="theme-option${isActive ? ' active' : ''}" 
                                data-theme="${theme}">
                            ${this.formatThemeName(theme)}
                        </button>
                    `;
                });
            }
        });

        themeGrid.innerHTML = html;

        themeGrid.addEventListener('click', e => {
            const themeButton = e.target.closest('.theme-option');
            if (!themeButton) return;

            const newTheme = themeButton.dataset.theme;
            this.setTheme(newTheme);

            themeGrid.querySelectorAll('.theme-option').forEach(btn =>
                btn.classList.toggle('active', btn.dataset.theme === newTheme)
            );
        });

        document.getElementById('theme-button')?.addEventListener('click', () => {
            document.getElementById('modal').classList.remove('active');
            document.getElementById('theme-modal').classList.add('active');
        });

        document.querySelector('.back-button')?.addEventListener('click', () => {
            document.getElementById('theme-modal').classList.remove('active');
            document.getElementById('modal').classList.add('active');
        });
    }

    formatThemeName(name) {
        return this.themeDisplayNames.get(name.toLowerCase()) ||
            name.split(/[-_\s.]/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
    }

    setTheme(themeName, isRetry = false) {
        if (isRetry && themeName === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            // Recalcular después de aplicar el tema por defecto
            requestAnimationFrame(() => this.updateWordList());
            return;
        }

        let found = false;
        for (const [, themes] of this.availableThemes) {
            if (themes.has(themeName)) {
                found = true;
                break;
            }
        }

        if (found) {
            requestAnimationFrame(() => {
                document.documentElement.setAttribute('data-theme', themeName);
                localStorage.setItem('theme', themeName);
                // Esperar a que se apliquen los estilos del nuevo tema
                // y luego recalcular los anchos
                requestAnimationFrame(() => this.updateWordList());
            });
        } else {
            this.setTheme('dark', true);
        }
    }

    bindModalEvents() {
        const modalHandlers = {
            menu: document.querySelector('.menu'),
            modal: document.getElementById('modal'),
            victoryModal: document.getElementById('victory-modal')
        };

        const closeModal = (modal) => {
            modal.classList.remove('active');
            if (modal === modalHandlers.modal) {
                this.resumeTimer();
            }
        };

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
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleButton(buttonId);
                });
            }
        });

        modalHandlers.menu.addEventListener('click', e => {
            e.stopPropagation();
            const isOpening = !modalHandlers.modal.classList.contains('active');
            if (isOpening) {
                modalHandlers.modal.classList.add('active');
                this.pauseTimer();
            }
        });

        modalHandlers.modal.addEventListener('click', e => {
            if (e.target === modalHandlers.modal) {
                closeModal(modalHandlers.modal);
            }
        });

        document.querySelectorAll('.modal-content').forEach(content => {
            content.addEventListener('click', e => e.stopPropagation());
        });

        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal && modal.id !== 'victory-modal') {
                    modal.classList.remove('active');
                    if (modal === modalHandlers.modal) {
                        this.resumeTimer();
                    } else if (modal.id === 'theme-modal') {
                        modalHandlers.modal.classList.add('active');
                    }
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
    }

    handleModalClose(e) {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            if (modal.classList.contains('active') && modal.id !== 'victory-modal') {
                modal.classList.remove('active');
                if (modal === document.getElementById('modal')) {
                    this.resumeTimer();
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new GameState());
