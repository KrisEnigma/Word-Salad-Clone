import { Capacitor } from "./vendor/capacitor-core.js";
import { L as LEVEL_ORDER, a as LEVELS } from './levels.js';
import { S as SelectionManager } from './selection.js';
import { A as AnimationManager } from './animations.js';
import { T as ThemeSelector } from './themeSelector.js';
import { S as Storage } from './storage.js';
import { N as NativeServices } from './nativeServices.js';
import { T as TitleFitter } from './titleFitter.js';

// Inicializar servicios nativos sin log
// NativeServices.initialize().catch(() => { });

class GameState {
    constructor() {
        this.themeSelector = new ThemeSelector();
        this._titleFitInProgress = false; // Nueva bandera para evitar ajustes simultáneos
    }

    async initialize() {
        try {
            // 1. Esperar a que el DOM esté realmente listo
            if (document.readyState !== 'complete') {
                await new Promise(resolve => {
                    window.addEventListener('load', resolve, { once: true });
                });
            }

            // 2. Detectar plataforma
            const isPlatformAndroid = Capacitor.getPlatform() === 'android';
            if (isPlatformAndroid) {
                document.documentElement.setAttribute('data-platform', 'android');
            }

            // 3. Inicializar servicios y storage (una sola vez)
            if (!NativeServices.isInitialized) {
                await NativeServices.initialize();
            }
            await Storage.initialize();

            // 4. Inicializar elementos del DOM primero
            this.initializeElements();
            this.initializeState();
            this.initializeBoard();
            
            // 5. Luego cargar el nivel
            const defaultLevel = LEVEL_ORDER[0];
            let levelToLoad;
            
            try {
                const savedLevel = await Storage.getCurrentLevel();
                levelToLoad = savedLevel && LEVELS[savedLevel] ? savedLevel : defaultLevel;
            } catch (error) {
                console.warn('Error cargando nivel guardado, usando default:', error);
                levelToLoad = defaultLevel;
            }

            // Verificar nivel
            if (!LEVELS[levelToLoad]) {
                console.error('Nivel inválido, usando primero:', levelToLoad);
                levelToLoad = defaultLevel;
            }

            // 6. Establecer nivel actual
            this.currentLevel = {
                ...LEVELS[levelToLoad],
                id: levelToLoad,
                name: LEVELS[levelToLoad].name
            };

            // 7. Log de verificación (simplificado)
            const elements = {
                title: !!this.titleElement,
                board: !!this.board,
                wordList: !!this.wordList,
                levelNumber: !!this.levelNumberElement,
                timer: !!this.timerElement
            };

            // Solo un log combinado
            console.log('Estado inicial:', {
                elementos: elements,
                nivel: {
                    id: this.currentLevel.id,
                    name: this.currentLevel.name,
                    hasData: !!this.currentLevel.data
                }
            });

            // 8. Configurar eventos y UI
            this.bindEvents();
            await this.themeSelector.initialize();
            
            // 9. Actualizar UI (sin ajustar título)
            await this.updateAllWithoutTitleFit(levelToLoad);
            
            // 10. Ajustar título y mostrar contenido (una sola vez)
            await this.showContent();

        } catch (error) {
            console.error('Error de inicialización:', error);
            this.handleInitializationError();
        }
    }

    // Nuevo método para manejar errores de inicialización
    handleInitializationError() {
        const defaultLevel = LEVEL_ORDER[0];
        console.log('Recuperando con nivel por defecto:', defaultLevel);
        
        this.currentLevel = {
            ...LEVELS[defaultLevel],
            id: defaultLevel,
            name: LEVELS[defaultLevel].name
        };
        
        // Asegurar UI básica
        this.initializeElements();
        this.initializeState();
        this.initializeBoard();
        this.updateAll(defaultLevel);
        this.showContent();
    }

    async onAppPause() {
        // Pausar el timer si está corriendo
        if (this.timer && !this.timer.isPaused) {
            this.pauseTimer();
            this._wasTimerRunning = true;
        }

        // Solo guardar el nivel actual
        await Storage.setCurrentLevel(this.currentLevel.id);
    }

    onAppResume() {
        // Verificar si hay que limpiar datos
        this.checkAndHandleDataReset();

        // Reanudar timer solo si estaba corriendo antes
        if (this._wasTimerRunning && this.timer?.isPaused) {
            this.resumeTimer();
            this._wasTimerRunning = false;
        }
    }

    async saveGameState() {
        try {
            // Solo guardamos el nivel actual, el tema y las configuraciones
            // El progreso se reinicia al volver a cargar
            await Storage.setCurrentLevel(this.currentLevel.id);
        } catch (error) {
            console.error('Error guardando estado:', error);
        }
    }

    async checkAndHandleDataReset() {
        try {
            // Intentar leer algún valor para ver si el storage fue limpiado
            const theme = await Storage.get(Storage.KEYS.THEME);
            if (!theme) {
                await this.handleDataReset();
            }
        } catch (error) {
            console.error('Error verificando datos:', error);
            await this.handleDataReset();
        }
    }

    async handleDataReset() {
        try {
            // Reinicializar storage con valores por defecto
            await Storage.resetToDefaults();

            // Recargar tema
            await this.themeSelector.initialize();

            // Reiniciar nivel al primero
            await this.loadLevel(LEVEL_ORDER[0]);

        } catch (error) {
            console.error('Error reinicializando datos:', error);
        }
    }

    async initializeGame() {
        await Storage.initialize();

        // Cargar el último nivel jugado
        const savedLevel = await Storage.get(Storage.KEYS.CURRENT_LEVEL, LEVEL_ORDER[0]);
        this.currentLevel = { ...LEVELS[savedLevel], id: savedLevel };
    }

    async initPhase1() {
        try {
            await this.themeSelector.initialize();
            this.initializeElements();
            this.initializeState();
            this.initializeBoard();
            this.bindEvents();
        } catch (error) {
            console.error('Error in initPhase1:', error);
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    async initPhase2() {
        // Cargar el último nivel jugado
        const savedLevel = await Storage.get(Storage.KEYS.CURRENT_LEVEL, LEVEL_ORDER[0]);
        this.currentLevel = { ...LEVELS[savedLevel], id: savedLevel };

        this.updateAll(this.currentLevel.id);
        this.showContent();
    }

    setTheme(themeName) {
        return this.themeSelector.setTheme(themeName);
    }

    // Nuevo método para manejar cambios de tema
    async handleThemeChange(themeName) {
        try {
            // 1. Aplicar el tema
            await this.themeSelector.setTheme(themeName);

            // 2. Resetear estilos del título
            this.titleElement.style = '';

            // 3. Esperar a que las fuentes estén listas
            await document.fonts.ready;
            
            // 4. Intentar precargar la fuente específica
            const computedStyle = getComputedStyle(this.titleElement);
            await document.fonts.load(`${computedStyle.fontSize} ${computedStyle.fontFamily}`);

            // 5. Ajustar el título usando TitleFitter
            if (this.titleFitter) {
                await this.titleFitter.fit();
            }

            // 6. Actualizar UI
            this.updateWordList();

        } catch (error) {
            console.error('Error al cambiar tema:', error);
        }
    }

    async showContent() {
        try {
            const body = document.body;
            const overlay = document.querySelector('.js-loading-overlay');

            // 1. Esperar a que las fuentes estén listas
            await document.fonts.ready;

            // 2. Hacer un único ajuste del título
            await this.fitTitle();

            // 3. Asegurar que los cambios se apliquen
            await new Promise(resolve => requestAnimationFrame(resolve));

            // 4. Mostrar contenido y ocultar spinner
            body.style.opacity = '1';
            body.classList.remove('js-loading');

            if (overlay) {
                overlay.classList.add('hidden');
                await new Promise(resolve => {
                    overlay.addEventListener('transitionend', () => {
                        overlay.remove();
                        resolve();
                    }, { once: true });
                });
            }
        } catch (error) {
            console.error('Error mostrando contenido:', error);
            this.handleShowContentError();
        }
    }

    // Nuevo método para actualizar sin ajustar título
    async updateAllWithoutTitleFit(levelId) {
        if (!this.currentLevel?.data) return;
        
        this.updateBoard();
        this.updateTitleContent(); // Solo actualiza el contenido
        this.updateWordList();
        this.updateUnusedLetters();
        this.updateLevelNumber(levelId);
        this.resetTimer();
        this.startTimer();
    }

    // Nuevo método para actualizar solo el contenido del título
    updateTitleContent() {
        if (!this.titleElement || !this.currentLevel?.name) return;
        
        const userSelectStyles = 'user-select: text; -webkit-user-select: text; -moz-user-select: text;';
        const isPlatformAndroid = Capacitor.getPlatform() === 'android';
        const fontSize = isPlatformAndroid ? '16px' : '24px';
        
        this.titleElement.textContent = this.currentLevel.name;
        this.titleElement.style.cssText = `${userSelectStyles}; font-size: ${fontSize};`;
    }

    // Modificar el ajuste del título para evitar llamadas simultáneas
    async fitTitle() {
        if (this._titleFitInProgress || !this.titleFitter) return;
        
        try {
            this._titleFitInProgress = true;
            await this.titleFitter.fit();
        } finally {
            this._titleFitInProgress = false;
        }
    }

    initializeElements() {
        try {
            // Primero verificar que los elementos existen
            const requiredElements = {
                titleContainer: document.querySelector('.title-container'),
                titleElement: document.querySelector('.title'),
                board: document.querySelector('.board'),
                wordList: document.querySelector('.word-list'),
                levelNumber: document.querySelector('.level-number'),
                timerElement: document.querySelector('.timer')
            };

            // Verificar elementos críticos
            if (!requiredElements.titleElement || !requiredElements.board) {
                throw new Error('Elementos críticos no encontrados');
            }

            // Asignar elementos a la instancia
            Object.entries(requiredElements).forEach(([key, element]) => {
                if (!element) {
                    console.warn(`Elemento ${key} no encontrado`);
                }
                this[key] = element;
            });

            // Inicializar timer
            this.timer = {
                element: this.timerElement,
                startTime: 0,
                elapsed: 0,
                interval: null,
                isPaused: false
            };

            // Inicializar TitleFitter
            if (this.titleElement) {
                this.titleFitter = new TitleFitter(this.titleElement);
                
                // Establecer estilos iniciales del título
                const isPlatformAndroid = Capacitor.getPlatform() === 'android';
                const userSelectStyles = 'user-select: text; -webkit-user-select: text; -moz-user-select: text;';
                const fontSize = isPlatformAndroid ? '16px' : '24px';
                this.titleElement.style.cssText = `${userSelectStyles}; font-size: ${fontSize};`;
            }

        } catch (error) {
            console.error('Error inicializando elementos:', error);
            throw error;
        }
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
        if (!this.currentLevel?.data) {
            console.warn('No hay nivel actual o datos para mostrar');
            return;
        }

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
        AnimationManager.stopConfetti();
        this.resetControls();
        // Limpiar cualquier letra animada que quede en el body
        document.querySelectorAll('.animated-letter').forEach(el => el.remove());
        this.currentLevel = { ...LEVELS[levelId], id: levelId };
        [this.foundWords, this.usedLetters].forEach(set => set.clear());
        this.resetSelection();
        this.updateAll(levelId);
        await Storage.setCurrentLevel(levelId);
    }

    updateAll(levelId) {
        if (!this.currentLevel?.data) {
            console.error('❌ No hay nivel actual para actualizar', {
                levelId,
                currentLevel: this.currentLevel
            });
            return;
        }
        this.updateBoard();
        this.updateTitle();
        
        // Asegurar que el título se ajuste después de actualizarlo
        if (this.titleFitter) {
            requestAnimationFrame(() => this.titleFitter.fit());
        }
        
        this.updateWordList();
        this.updateUnusedLetters();
        this.updateLevelNumber(levelId);
        this.resetTimer();
        this.startTimer();
    }

    updateTitle() {
        if (!this.titleElement) {
            console.error('Título no encontrado, reinicializando elementos...');
            this.initializeElements();
            if (!this.titleElement) {
                console.error('No se pudo recuperar el elemento título');
                return;
            }
        }

        if (!this.currentLevel?.name) {
            console.error('Nivel actual sin nombre:', this.currentLevel);
            return;
        }

        try {
            // Mantener los estilos de user-select
            const userSelectStyles = 'user-select: text; -webkit-user-select: text; -moz-user-select: text;';
            
            // Establecer el contenido
            this.titleElement.textContent = this.currentLevel.name;
            
            // Aplicar estilos
            const isPlatformAndroid = Capacitor.getPlatform() === 'android';
            const fontSize = isPlatformAndroid ? '16px' : '24px';
            this.titleElement.style.cssText = `${userSelectStyles}; font-size: ${fontSize};`;
            
            // Ajustar el título
            if (this.titleFitter) {
                requestAnimationFrame(() => this.titleFitter.fit());
            }
            
            console.log('Título actualizado:', {
                contenido: this.currentLevel.name,
                elemento: this.titleElement.textContent,
                estilos: this.titleElement.style.cssText
            });
        } catch (error) {
            console.error('Error actualizando título:', error);
        }
    }

    updateWordList() {
        if (!this.wordList || !this.currentLevel?.data) {
            console.warn('No hay lista de palabras o nivel actual');
            return;
        }

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
            // Vibrar al encontrar una palabra
            if (Storage.isVibrationEnabled) {
                await NativeServices.vibrate();
            }

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
        // Vibración más intensa al completar el nivel
        if (Storage.isVibrationEnabled) {
            NativeServices.vibrate('HEAVY');
        }

        AnimationManager.animateVictory(() => {
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

        // Agregar listener para cambios de tema
        window.addEventListener('themechange', (e) => {
            this.handleThemeChange(e.detail.theme);
        });

        this.bindModalEvents();
        window.addEventListener('resize', () => this.selectionManager.drawLine());

        // Unificar manejo de clicks globales
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

        // Solo mantener un ResizeObserver
        new ResizeObserver(() => {
            requestAnimationFrame(() => {
                AnimationManager.cleanupAnimations();
                this.updateWordList();
            });
        }).observe(document.documentElement);

        // Mover los manejadores de botones nativos aquí
        const nativeHandlers = {
            'vibration-toggle': async () => {
                try {
                    const button = document.getElementById('vibration-toggle');
                    const newState = !Storage.isVibrationEnabled;
                    await Storage.setVibrationEnabled(newState);
                    button.textContent = newState ? 'Desactivar Vibración' : 'Activar Vibración';

                    if (newState) {
                        await NativeServices.vibrate('LIGHT');
                    }
                } catch (error) {
                    console.error('Error al cambiar estado de vibración:', error);
                }
            },
            'test-notification': async () => {
                console.group('🔔 Test Notificación');
                try {
                    console.log('1. Activando notificaciones...');
                    await Storage.setNotificationEnabled(true);
                    
                    console.log('2. Intentando enviar notificación...');
                    await NativeServices.sendNotification(
                        '¡Hora de jugar!',
                        'Te esperan nuevos desafíos en GameSalad'
                    );
                    console.log('✅ Notificación enviada con éxito');
                } catch (error) {
                    console.error('❌ Error en notificación:', error);
                } finally {
                    console.groupEnd();
                }
            },
            // ...resto de manejadores...
        };

        // Inicializar estado de botón de vibración
        const vibrationButton = document.getElementById('vibration-toggle');
        if (vibrationButton) {
            vibrationButton.textContent = Storage.isVibrationEnabled ?
                'Desactivar Vibración' : 'Activar Vibración';
        }

        // Agregar event listeners para botones nativos
        Object.entries(nativeHandlers).forEach(([id, handler]) => {
            document.getElementById(id)?.addEventListener('click', handler);
        });

        // Manejar botones de acción
        const gameButtons = {
            'reset-game': () => {
                this.resetTimer();
                this.loadLevel(this.currentLevel.id);
                document.getElementById('modal').classList.remove('active');
            },
            'restart-level': () => {
                this.resetTimer();
                this.loadLevel(this.currentLevel.id);
                document.getElementById('victory-modal').classList.remove('active');
            },
            'next-level': () => {
                const currentIndex = LEVEL_ORDER.indexOf(this.currentLevel.id);
                const nextIndex = currentIndex + 1;

                if (nextIndex < LEVEL_ORDER.length) {
                    this.resetTimer();
                    this.loadLevel(LEVEL_ORDER[nextIndex]);
                    document.getElementById('victory-modal').classList.remove('active');
                } else {
                    // Si es el último nivel, mostrar algún mensaje o volver al primero
                    this.resetTimer();
                    this.loadLevel(LEVEL_ORDER[0]);
                    document.getElementById('victory-modal').classList.remove('active');
                }
            }
        };

        // Agregar los event listeners para los botones del juego
        Object.entries(gameButtons).forEach(([id, handler]) => {
            document.getElementById(id)?.addEventListener('click', handler);
        });

        // Agregar event listeners para el ciclo de vida de la app
        document.addEventListener('appPause', () => {
            this.onAppPause();
        });

        document.addEventListener('appResume', () => {
            this.onAppResume();
        });

        // También manejar visibilitychange del navegador
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onAppPause();
            } else {
                this.onAppResume();
            }
        });

        // ...rest of existing code...
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
            if (!isAnyModalActive()) {  // Usar la función aquí
                this.resumeTimer();
            }
        };

        // Unificar manejo de navegación entre modales
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

        // Configurar navegación
        Object.entries(modalNavigation).forEach(([id, handler]) => {
            document.querySelector(id === 'menu' ? '.menu' : `#${id}`)
                ?.addEventListener('click', (event) => {
                    event.stopPropagation();
                    handler();
                });
        });

        // Prevenir cierre del modal de victoria
        modalHandlers.victoryModal?.addEventListener('click', event => {
            if (event.target === modalHandlers.victoryModal) {
                event.stopPropagation();
            }
        });

        // Manejar clicks en overlay de modales
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            if (modal.id === 'victory-modal') return;

            modal.addEventListener('click', event => {
                if (event.target === modal) {
                    closeModal(modal);
                    // Verificar si hay que reanudar el timer
                    if (!isAnyModalActive()) {  // Y aquí
                        this.resumeTimer();
                    }
                }
            });
        });

        // ...rest of existing code...
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
            this.saveGameState();
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
}

// Nueva inicialización sin log
const startGame = async () => {
    try {
        const game = new GameState();
        await game.initialize();
    } catch (error) {
        console.error('Error:', error);
    }
};

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startGame);
} else {
    startGame();
}
