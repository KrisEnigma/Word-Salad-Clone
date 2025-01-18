import { App } from '@capacitor/app';

class AppLifecycle {
    static listeners = new Set();

    static initialize() {
        try {
            App.addListener('appStateChange', (state) => {
                this.listeners.forEach(listener => listener(state.isActive));
            });
            App.addListener('pause', () => {
                this.listeners.forEach(listener => listener(false));
            });
            App.addListener('resume', () => {
                this.listeners.forEach(listener => listener(true));
            });
        } catch {  // Removido el parámetro error no utilizado
            document.addEventListener('visibilitychange', () => {
                const isActive = !document.hidden;
                this.listeners.forEach(listener => listener(isActive));
            });
        }
    }

    static addListener(callback) {
        this.listeners.add(callback);
    }

    static removeListener(callback) {
        this.listeners.delete(callback);
    }
}

AppLifecycle.initialize();

export class Timer {
    constructor(element) {
        this.element = element;
        this.startTime = null;
        this.pausedTime = null;
        this.running = false;
        this.animationFrame = null;
        this._lastKnownTime = 0;
        
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
        AppLifecycle.addListener(this.handleAppStateChange);
    }

    start() {
        if (!this.running) {
            const startFrom = this.pausedTime || 0;
            this.startTime = Date.now() - startFrom;
            this._lastKnownTime = startFrom;
            this.running = true;
            this.update();
        }
    }

    stop() {
        if (this.running) {
            this._lastKnownTime = Date.now() - this.startTime;
            this.running = false;
            this.pausedTime = this._lastKnownTime;
            
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            }
        }
    }

    reset() {
        this.running = false;
        this.startTime = null;
        this.pausedTime = null;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.element.textContent = '00:00';
    }

    handleAppStateChange(isActive) {
        if (!isActive && this.running) {
            this.stop();
        } else if (isActive && this.pausedTime !== null) {
            this.start();
        }
    }

    formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
    }

    update() {
        if (!this.running) return;

        const currentTime = Date.now() - this.startTime;
        const seconds = Math.floor(currentTime / 1000);
        const minutes = Math.floor(seconds / 60);
        
        this.element.textContent = `${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
        
        this.animationFrame = requestAnimationFrame(() => this.update());
    }

    getTime() {
        if (!this.startTime) return 0;
        return this.running ? Date.now() - this.startTime : this.pausedTime;
    }

    destroy() {
        AppLifecycle.removeListener(this.handleAppStateChange);
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}
