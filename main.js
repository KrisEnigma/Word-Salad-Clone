import { createBoard, boardElement } from './board.js';
import { createHints, initializeUI } from './ui.js';
import { resetSelection, getSortedWords, resetGame, startTimer } from './gameLogic.js';

// Actualizar la configuración de particles.js
particlesJS('particles-js', {
    particles: {
        number: { 
            value: 40, 
            density: { 
                enable: true, 
                value_area: window.innerHeight  // Usar altura de ventana como referencia
            } 
        },
        color: { value: '#ffffff' },
        opacity: { 
            value: 0.15,  // Aumentado ligeramente
            random: true
        },
        size: { 
            value: 3,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.3,
                sync: false
            }
        },
        move: { 
            enable: true, 
            speed: 0.8,  // Velocidad reducida para un efecto más sutil
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
        },
        line_linked: {
            enable: true,
            distance: Math.min(window.innerWidth, window.innerHeight) * 0.15, // Distancia proporcional
            color: "#ffffff",
            opacity: 0.1,
            width: 1
        }
    },
    retina_detect: false,
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: false
            }
        }
    }
});

// Ajustar el canvas cuando cambie el tamaño de la ventana
window.addEventListener('resize', () => {
    if (window.pJSDom && window.pJSDom[0]) {
        window.pJSDom[0].pJS.particles.line_linked.distance = 
            Math.min(window.innerWidth, window.innerHeight) * 0.15;
        window.pJSDom[0].pJS.particles.number.value = 
            Math.floor((window.innerWidth * window.innerHeight) / 20000);
        window.pJSDom[0].pJS.fn.particlesRefresh();
    }
});

const ripples = new Set();

function createRipple(event) {
    const validTargets = ['board', 'reset', 'options'];
    const targetId = event.target.id || event.target.parentElement.id;
    
    if (!validTargets.includes(targetId) && !event.target.closest('#board')) {
        return;
    }

    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    const rect = document.body.getBoundingClientRect();
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    document.body.appendChild(ripple);
    ripples.add(ripple);
    
    requestAnimationFrame(() => {
        ripple.addEventListener('animationend', () => {
            ripples.delete(ripple);
            ripple.remove();
        });
    });
}

function throttle(func, limit) {
    let inThrottle;
    return function(event) {
        if (!inThrottle) {
            func(event);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

document.addEventListener('pointerdown', throttle(createRipple, 100));

document.addEventListener('click', (e) => !boardElement.contains(e.target) && resetSelection());

document.addEventListener('resetGame', resetGame);
document.addEventListener('nextLevel', () => {
    initializeUI();
    resetGame();
});

initializeUI();
createBoard();
createHints(getSortedWords());
startTimer();