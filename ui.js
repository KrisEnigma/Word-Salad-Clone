import { hintsElement } from './board.js';
import { getCurrentLevel, nextLevel, getLevelNumber } from './levels.js';

export function initializeUI() {
    updateLevelTitle();
    createOptionsMenu();
}

function updateLevelTitle() {
    const currentLevel = getCurrentLevel();
    document.getElementById('level-title').textContent = 
        `Nivel ${getLevelNumber()}: ${currentLevel.name}`;
}

export function createHints(sortedWords) {
    hintsElement.innerHTML = '';
    sortedWords.forEach((word) => {
        const hint = document.createElement('span');
        hint.textContent = word.length;
        hint.id = `hint-${word}`;
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.fontSize = '20px';
        tempSpan.textContent = word;
        document.body.appendChild(tempSpan);
        const wordWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        hint.style.width = `${Math.max(42, wordWidth + 32)}px`;
        hintsElement.appendChild(hint);
    });
}

export function updateHints(word) {
    const hintElement = document.getElementById(`hint-${word}`);
    if (hintElement) {
        hintElement.textContent = word;
        hintElement.classList.add('found');
    }
}

function createOverlayElement() {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '1000';
    
    const colors = [
        '#ffd700', // oro
        '#ff3b30', // rojo
        '#2ecc71', // verde
        '#3498db', // azul
        '#e74c3c', // rojo oscuro
        '#9b59b6', // morado
        '#f1c40f', // amarillo
        '#1abc9c', // turquesa
    ];
    
    const container = document.createElement('div');
    container.className = 'confetti';
    
    // Crear confetti con posiciones y propiedades variables
    for (let i = 0; i < 150; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        
        // Posición inicial aleatoria
        const randomX = Math.random() * 100;
        piece.style.left = `${randomX}%`;
        
        // Velocidad de caída variable
        const fallDuration = 2.5 + Math.random() * 2;
        piece.style.animationDuration = `${fallDuration}s`;
        
        // Retraso aleatorio
        piece.style.animationDelay = `${Math.random() * 2}s`;
        
        // Color aleatorio
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Tamaño variable
        const size = 6 + Math.random() * 8;
        piece.style.width = `${size}px`;
        piece.style.height = `${size}px`;
        
        // Rotación inicial aleatoria
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Frecuencia de zigzag variable
        piece.style.setProperty('--zigzag-freq', `${0.3 + Math.random() * 0.4}`);
        
        container.appendChild(piece);
    }
    
    overlay.appendChild(container);
    return overlay;
}

function createOverlayContent(hasNextLevel) {
    const content = document.createElement('div');
    content.classList.add('overlay-content');
    
    const message = document.createElement('h2');
    message.textContent = '¡Felicidades!';
    
    const subMessage = document.createElement('p');
    const finalTime = document.getElementById('timer').textContent;
    const [mins, secs] = finalTime.split(':');
    const timeText = mins === '00' ? `${parseInt(secs)} segundos` : 
                    mins === '01' ? `1 minuto y ${parseInt(secs)} segundos` :
                    `${parseInt(mins)} minutos y ${parseInt(secs)} segundos`;
    
    subMessage.textContent = hasNextLevel 
        ? `¡Has completado el nivel en ${timeText}!` 
        : `¡Has completado todos los niveles! Tiempo total: ${timeText}`;
    
    const timeElement = document.createElement('p');
    timeElement.classList.add('time-result');
    timeElement.textContent = finalTime;
    
    const button = document.createElement('button');
    button.textContent = hasNextLevel ? 'Siguiente Nivel ➜' : '🔄 Jugar de nuevo';
    
    content.append(message, subMessage, timeElement, button);
    return { content, button };
}

export function showVictory() {
    console.log('Mostrando victoria'); // Debug
    const overlay = createOverlayElement();
    const hasNextLevel = nextLevel(); // Preparar siguiente nivel
    const { content, button } = createOverlayContent(hasNextLevel);
    
    button.addEventListener('click', () => {
        console.log('Botón de victoria clickeado'); // Debug
        document.body.removeChild(overlay);
        if (!hasNextLevel) {
            window.location.reload();
            return;
        }
        document.dispatchEvent(new Event('nextLevel'));
    });
    
    overlay.appendChild(content);
    document.body.appendChild(overlay);
}

function createOptionsMenu() {
    const menu = document.createElement('div');
    menu.classList.add('options-menu');
    
    menu.innerHTML = `
        <h2>Opciones del Juego</h2>
        
        <div class="options-group">
            <h3>Sonido y Vibración</h3>
            <div class="option-item">
                <span>Efectos de Sonido</span>
                <label class="switch">
                    <input type="checkbox" id="sound-toggle" checked>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="option-item">
                <span>Vibración al Tocar</span>
                <label class="switch">
                    <input type="checkbox" id="vibration-toggle" checked>
                    <span class="slider"></span>
                </label>
            </div>
        </div>
        
        <div class="options-group">
            <h3>Aspecto Visual</h3>
            <div class="option-item">
                <span>Partículas de Fondo</span>
                <label class="switch">
                    <input type="checkbox" id="particles-toggle" checked>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="option-item">
                <span>Efectos Visuales</span>
                <label class="switch">
                    <input type="checkbox" id="effects-toggle" checked>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="option-item">
                <span>Modo Oscuro</span>
                <label class="switch">
                    <input type="checkbox" id="dark-mode-toggle" checked>
                    <span class="slider"></span>
                </label>
            </div>
        </div>

        <div class="options-group">
            <h3>Partida Actual</h3>
            <button id="restart-game" class="danger-button">🔄 Reiniciar Nivel</button>
        </div>
        
        <button id="close-options">✓ Guardar y Cerrar</button>
    `;
    
    document.body.appendChild(menu);
    
    const optionsButton = document.getElementById('options');
    optionsButton.addEventListener('click', () => {
        menu.classList.add('active');
    });
    
    document.getElementById('close-options').addEventListener('click', () => {
        menu.classList.remove('active');
    });
    
    // Cerrar al hacer clic fuera
    menu.addEventListener('click', (e) => {
        if (e.target === menu) {
            menu.classList.remove('active');
        }
    });

    // Añadir listener para reiniciar
    document.getElementById('restart-game').addEventListener('click', () => {
        document.dispatchEvent(new Event('resetGame'));
        menu.classList.remove('active');
    });
}