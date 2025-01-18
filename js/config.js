import { Preferences } from '@capacitor/preferences';
import { LEVELS, LEVEL_ORDER } from './levels.js';
import { Haptics } from '@capacitor/haptics';

export class Config {
    static KEYS = {
        THEME: 'theme',
        HAPTICS: 'haptics_enabled',
        LAST_LEVEL: 'last_level',
        HIGHEST_LEVEL: 'highest_level'  // Cambiamos UNLOCKED_LEVELS por HIGHEST_LEVEL
    };

    static async init() {
        console.log('🚀 Inicializando config...');

        // Validar progresión antes de inicializar
        await this.validateProgression();

        // Aseguramos que el nivel más alto se cargue primero
        const keys = Object.values(this.KEYS);
        const theme = await this.getTheme();
        const highestLevel = await this.getHighestLevel();
        const lastLevel = await this.getLastLevel();

        // Primero cargar el nivel más alto que será nuestro limite
        await this.set(this.KEYS.HIGHEST_LEVEL, String(Math.max(highestLevel, 0)));

        const defaults = {
            [this.KEYS.THEME]: theme,
            [this.KEYS.HAPTICS]: 'true',
            [this.KEYS.LAST_LEVEL]: lastLevel || '0'
        };

        // Asegurar que todos los valores existan
        for (const key of keys) {
            const { value } = await Preferences.get({ key });
            if (value === null) {
                await this.set(key, defaults[key]);
            }
        }

        console.log('✅ Config inicializada:', {
            theme,
            highestLevel,
            lastLevel
        });
    }

    static async get(key) {
        const { value } = await Preferences.get({ key });
        return value;
    }

    static async set(key, value) {
        await Preferences.set({
            key,
            value: String(value)
        });
    }

    static async isHapticsEnabled() {
        return (await this.get(this.KEYS.HAPTICS)) === 'true';
    }

    static async setHapticsEnabled(enabled) {
        await this.set(this.KEYS.HAPTICS, enabled);
        // Si se está activando la vibración, dar feedback inmediato
        if (enabled) {
            try {
                await Haptics.impact({ style: 'light' });
            } catch (error) {
                console.warn('Haptics no disponible:', error);
            }
        }
    }

    static async getLastLevel() {
        const lastLevel = await this.get(this.KEYS.LAST_LEVEL);
        const highestLevel = await this.getHighestLevel();

        // Verificación estricta de progresión
        const validateLevel = async (levelId) => {
            if (!levelId || !LEVELS[levelId]) return false;
            const levelIndex = LEVEL_ORDER.indexOf(levelId);

            // Verificar que el nivel está en una secuencia válida
            const isValidProgression = Array.from(
                { length: levelIndex + 1 },
                (_, i) => LEVELS[LEVEL_ORDER[i]]
            ).every(Boolean);

            return levelIndex >= 0 &&
                levelIndex <= highestLevel &&
                isValidProgression;
        };

        // Validar y usar el último nivel si es seguro
        if (await validateLevel(lastLevel)) {
            console.log('📝 Cargando último nivel:', lastLevel);
            return lastLevel;
        }

        // Reiniciar al primer nivel si se detecta manipulación
        console.warn('🚨 Progresión inválida, reiniciando al nivel 1');
        const safeLevel = LEVEL_ORDER[0];
        await this.set(this.KEYS.HIGHEST_LEVEL, '0');
        await this.set(this.KEYS.LAST_LEVEL, safeLevel);
        return safeLevel;
    }

    static async getTheme() {
        const value = await this.get(this.KEYS.THEME);
        // Si no hay tema guardado en Preferences, intentar migrar desde localStorage
        if (!value) {
            const legacyTheme = localStorage.getItem('theme');
            if (legacyTheme) {
                await this.set(this.KEYS.THEME, legacyTheme);
                localStorage.removeItem('theme'); // Limpiar localStorage
                return legacyTheme;
            }
        }
        return value || 'dark';
    }

    static async getHighestLevel() {
        const highest = await this.get(this.KEYS.HIGHEST_LEVEL);
        // Asegurar que devolvemos un número válido, defaulteando a 0
        const parsedHighest = highest !== null ? parseInt(highest) : 0;
        // Asegurar que el valor está dentro de los límites válidos
        return Math.max(0, Math.min(parsedHighest, LEVEL_ORDER.length - 1));
    }

    static async unlockLevel(levelId) {
        const currentIndex = LEVEL_ORDER.indexOf(levelId);
        if (currentIndex === -1) {
            console.warn('❌ Nivel no válido:', levelId);
            return false;
        }

        // Verificar y actualizar el nivel más alto
        const currentHighest = await this.getHighestLevel();
        console.log('🔄 Estado actual:', { currentIndex, currentHighest });

        // Primero actualizar el nivel más alto
        if (currentIndex <= currentHighest + 1) {
            await this.set(this.KEYS.HIGHEST_LEVEL, String(Math.max(currentHighest, currentIndex)));
            console.log('📈 Nivel más alto actualizado:', await this.getHighestLevel());
        }

        // Después actualizar el último nivel jugado
        await this.set(this.KEYS.LAST_LEVEL, levelId);

        // Verificar que todo se guardó correctamente
        const finalHighest = await this.getHighestLevel();
        const isUnlocked = await this.isLevelUnlocked(levelId);

        console.log('✅ Estado final:', {
            levelId,
            highestLevel: finalHighest,
            isUnlocked
        });

        return isUnlocked;
    }

    static async isLevelUnlocked(levelId) {
        const levelIndex = LEVEL_ORDER.indexOf(levelId);
        const highestUnlocked = await this.getHighestLevel();
        // Un nivel está desbloqueado si su índice es menor o igual al nivel más alto alcanzado
        return levelIndex <= highestUnlocked;
    }

    static async validateProgression() {
        // 1. Obtener los números guardados
        const lastLevel = await this.get(this.KEYS.LAST_LEVEL);     // Dónde estás
        const highestLevel = await this.get(this.KEYS.HIGHEST_LEVEL); // Tu récord

        // 2. Convertir nombres de nivel a números de peldaño
        const lastIndex = LEVEL_ORDER.indexOf(lastLevel);      // Ej: 'chess' → 1
        const highestIndex = parseInt(highestLevel);           // Ej: '2' → 2

        // 3. Verificar que todo esté bien
        const isValid =
            lastIndex >= 0 &&                                  // El peldaño existe
            lastIndex <= highestIndex &&                       // No estás más arriba que tu récord
            highestIndex < LEVEL_ORDER.length &&               // Tu récord no es mayor que el último peldaño
            // Verificar que conoces todos los peldaños anteriores
            Array.from({ length: highestIndex + 1 }, (_, i) => i)
                .every(i => LEVELS[LEVEL_ORDER[i]]);

        // 4. Si hay trampa, volver al inicio
        if (!isValid) {
            console.warn('🚨 ¡Trampa detectada! Volviendo al primer nivel');
            await this.set(this.KEYS.HIGHEST_LEVEL, '0');     // Récord a 0
            await this.set(this.KEYS.LAST_LEVEL, LEVEL_ORDER[0]); // Volver al primer nivel
            return false;
        }
        return true;
    }
}
