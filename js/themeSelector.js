import { Config } from './config.js';

export class ThemeSelector {
    constructor() {
        this.themesData = null;
        this.availableThemes = new Map();
        this.categoryOrder = [];
    }

    async applyInitialTheme() {
        try {
            await this.loadThemesData(); // Cargar datos primero
            const defaultTheme = 'dark';
            const savedTheme = await Config.get(Config.KEYS.THEME) || defaultTheme;
            document.documentElement.setAttribute('data-theme', savedTheme);

            const themeData = await this.findThemeData(savedTheme);
            if (!themeData) {
                // Si no se encuentra el tema, usar el tema por defecto
                return this.loadStylesheet('styles/basic/dark.css');
            }

            const themePath = `styles/${themeData.category.path}/${themeData.theme.file}`;
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = themePath;

            return new Promise((resolve, reject) => {
                link.onload = () => resolve(true);
                link.onerror = reject;
                document.head.appendChild(link);
            });
        } catch (error) {
            console.error('Error en applyInitialTheme:', error);
            return this.loadStylesheet('styles/basic/dark.css');
        }
    }

    async initialize() {
        try {
            // Cargar datos primero
            if (!this.themesData) {
                await this.loadThemesData();
            }

            // Cargar los stylesheets
            await this.loadThemeStylesheets();

            // Inicializar UI una vez que todo esté listo
            await this.initializeUI();

            return this.availableThemes;
        } catch (error) {
            console.error('Error en initialize:', error);
            throw error;
        }
    }

    formatCategoryName(categoryId) {
        return categoryId.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    async loadThemesData() {
        const response = await fetch('styles/themes.json');
        if (!response.ok) throw new Error('No se pudo obtener la lista de temas');

        const data = await response.json();

        this.themesData = {
            categories: Object.fromEntries(
                Object.entries(data.categories).map(([id, category]) => [
                    id,
                    {
                        ...category,
                        name: this.formatCategoryName(id),
                        path: id
                    }
                ])
            )
        };

        this.categoryOrder = Object.keys(this.themesData.categories)
            .map(id => this.formatCategoryName(id));

        Object.entries(this.themesData.categories).forEach(([, category]) => {
            this.availableThemes.set(category.name, new Set(
                category.themes.map(theme => this.getThemeId(theme.file))
            ));
        });
    }

    loadStylesheet(path) {
        const existingLink = document.querySelector(`link[href="${path}"]`);
        if (existingLink) return Promise.resolve();

        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = path;
            link.onload = resolve;  // Simplificar
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    getThemeId(themeFile) {
        return themeFile.replace('.css', '');
    }

    async loadThemeStylesheets() {
        if (!this.themesData) {
            await this.loadThemesData();
        }

        const currentTheme = await Config.get(Config.KEYS.THEME) || 'dark';
        const themeData = await this.findThemeData(currentTheme);

        if (!themeData) return;

        try {
            const path = `styles/${themeData.category.path}/${themeData.theme.file}`;
            await this.loadStylesheet(path);

            // Cargar el resto de temas en segundo plano
            this.loadRemainingThemes();
        } catch (error) {
            console.error('Error loading theme stylesheet:', error);
            // Intentar cargar el tema por defecto como fallback
            await this.loadStylesheet('styles/basic/dark.css');
        }
    }

    async loadRemainingThemes() {
        const promises = Object.values(this.themesData.categories).flatMap(category =>
            category.themes.map(theme => {
                const path = `styles/${category.path}/${theme.file}`;
                return this.loadStylesheet(path).catch(() => { });
            })
        );

        await Promise.allSettled(promises);
    }

    async findThemeData(themeId) {
        if (!this.themesData) {
            await this.loadThemesData();
        }

        if (!this.themesData?.categories) {
            console.warn('No hay datos de categorías disponibles');
            return {
                category: { path: 'basic' },
                theme: { file: 'dark.css' }
            };
        }

        // Buscar en todas las categorías
        for (const category of Object.values(this.themesData.categories)) {
            const theme = category.themes.find(t => this.getThemeId(t.file) === themeId);
            if (theme) {
                return { category, theme };
            }
        }

        // Si no se encuentra, usar el tema por defecto
        for (const category of Object.values(this.themesData.categories)) {
            const defaultTheme = category.themes.find(t => t.isDefault);
            if (defaultTheme) {
                return { category, theme: defaultTheme };
            }
        }

        // Fallback final
        return {
            category: { path: 'basic' },
            theme: { file: 'dark.css' }
        };
    }

    getDefaultTheme() {
        for (const category of Object.values(this.themesData.categories)) {
            const defaultTheme = category.themes.find(theme => theme.isDefault);
            if (defaultTheme) {
                return this.getThemeId(defaultTheme.file);
            }
        }
        throw new Error('No se encontró un tema por defecto en el JSON');
    }

    async initializeUI() {
        const themeGrid = document.querySelector('.theme-grid');
        if (!themeGrid || !this.themesData) {
            console.warn('No se puede inicializar UI sin datos de temas');
            return;
        }

        let html = '';
        this.categoryOrder.forEach(categoryName => {
            const category = Object.values(this.themesData.categories)
                .find(cat => cat.name === categoryName);

            if (category?.themes.length) {
                html += `<div class="theme-category">${category.name}</div>`;
                category.themes.forEach(theme => {
                    const themeId = this.getThemeId(theme.file);
                    const isActive = document.documentElement.getAttribute('data-theme') === themeId;
                    html += this.createThemeButton(theme, isActive);
                });
            }
        });

        themeGrid.innerHTML = html;
        this.bindEvents(themeGrid);

        requestAnimationFrame(async () => {
            const previews = themeGrid.querySelectorAll('.preview-wrapper[data-theme]');
            for (const preview of previews) {
                try {
                    const themeId = preview.getAttribute('data-theme');
                    const themeData = await this.findThemeData(themeId);
                    if (!themeData) {
                        console.warn('No se encontraron datos para el tema:', themeId);
                        continue;
                    }

                    const styleText = await this.getThemeStyles(themeData);
                    if (styleText) {
                        preview.setAttribute('style', styleText);
                        const title = preview.querySelector('.preview-title');
                        if (title) {
                            this.fitPreviewTitle(title);
                        }
                    }
                } catch (error) {
                    console.warn('Error procesando preview:', error);
                }
            }
        });
    }

    fitPreviewTitle(titleElement) {
        const text = titleElement.textContent;
        const words = text.split(/\s+/);

        // Reset inicial
        titleElement.style = '';
        titleElement.classList.remove('single-line', 'multi-line');

        // Forzar reflow
        void titleElement.offsetWidth;

        if (words.length === 1) {
            this.fitSingleWord(titleElement);
        } else {
            this.fitMultipleWords(titleElement);
        }
    }

    fitSingleWord(titleElement) {
        titleElement.classList.add('single-line');
        const container = titleElement.parentElement;
        const maxWidth = container.clientWidth - 16;
        const textWidth = titleElement.scrollWidth;
        const isPixelFont = this.isPixelFont(titleElement);

        if (textWidth > maxWidth) {
            const scale = maxWidth / textWidth;
            // Ajustes específicos para fuentes pixel art
            const minSize = isPixelFont ? 12 : 16;
            const scaleFactor = isPixelFont ? 0.7 : 0.9; // Más agresivo con pixel fonts
            const currentSize = parseFloat(getComputedStyle(titleElement).fontSize);
            const newSize = Math.max(minSize, currentSize * scale * scaleFactor);
            titleElement.style.fontSize = `${newSize}px`;
        }
    }

    fitMultipleWords(titleElement) {
        titleElement.classList.add('multi-line');
        const isPixelFont = this.isPixelFont(titleElement);

        // Ajustar tamaño base según el tipo de fuente
        const baseSize = parseFloat(getComputedStyle(titleElement).fontSize);
        const initialSize = isPixelFont ? baseSize * 0.8 : baseSize;
        titleElement.style.fontSize = `${initialSize}px`;

        const maxHeight = parseFloat(getComputedStyle(titleElement).lineHeight) * 2;

        if (titleElement.scrollHeight > maxHeight) {
            let size = initialSize;
            const minSize = isPixelFont ? 10 : 14;
            const reductionFactor = isPixelFont ? 0.85 : 0.95;

            while (size > minSize && titleElement.scrollHeight > maxHeight) {
                size *= reductionFactor;
                titleElement.style.fontSize = `${size}px`;
            }

            if (titleElement.scrollHeight > maxHeight) {
                titleElement.classList.remove('multi-line');
                this.fitSingleWord(titleElement);
            }
        }
    }

    isPixelFont(element) {
        const fontFamily = getComputedStyle(element).fontFamily.toLowerCase();
        return fontFamily.includes('press start') ||
            fontFamily.includes('pixel') ||
            fontFamily.includes('8bit') ||
            fontFamily.includes('arcade');
    }

    async getThemeStyles(themeData) {
        if (!themeData || !themeData.category || !themeData.theme) {
            console.warn('Datos de tema inválidos:', themeData);
            return '';
        }

        const { category, theme } = themeData;
        const path = `styles/${category.path}/${theme.file}`;

        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`No se pudo cargar ${path}`);

            const css = await response.text();
            const styleMatch = css.match(/:root\[data-theme=['"]([^'"]+)['"]\]\s*{([^}]+)}/);

            if (!styleMatch) return '';

            const variables = styleMatch[2];
            const internalVars = {};
            variables.match(/--[^:]+:[^;]+;/g)?.forEach(prop => {
                const [name, value] = prop.split(':').map(s => s.trim());
                if (name && !name.includes('color-')) {
                    internalVars[name] = value.replace(';', '');
                }
            });

            const cssVars = {};
            variables.match(/--[^:]+:[^;]+;/g)?.forEach(prop => {
                const [name, value] = prop.split(':').map(s => s.trim());
                if (name) {
                    let resolvedValue = value.replace(';', '');
                    Object.entries(internalVars).forEach(([varName, varValue]) => {
                        resolvedValue = resolvedValue.replace(
                            `var(${varName})`,
                            varValue
                        );
                    });
                    cssVars[name] = resolvedValue;
                }
            });

            cssVars['--preview-shadow'] = '0 2px 8px rgba(0, 0, 0, 0.15)';
            cssVars['--preview-border'] = '1px solid rgba(0, 0, 0, 0.1)';

            return Object.entries(cssVars)
                .map(([name, value]) => `${name}: ${value}`)
                .join(';');

        } catch (error) {
            console.warn('Error cargando estilos del tema:', error);
            return '';
        }
    }

    createThemeButton(theme, isActive) {
        const themeId = this.getThemeId(theme.file);
        return `
            <button class="theme-option${isActive ? ' active' : ''}" 
                    data-theme="${themeId}">
                <div class="preview-wrapper" data-theme="${themeId}">
                    <div class="preview-cell">
                        <div class="preview-mark"></div>
                        <div class="preview-text">A</div>
                    </div>
                    <div class="preview-title">${theme.name}</div>
                </div>
            </button>
        `;
    }

    getComputedThemeVariables(themeId) {
        const temp = document.createElement('div');
        temp.style.display = 'none';
        temp.setAttribute('data-theme', themeId);
        document.body.appendChild(temp);

        const styles = getComputedStyle(temp);
        const variables = [
            '--color-bg',
            '--color-cell',
            '--color-letter',
            '--color-title',
            '--color-selected',
            '--color-modal',
            '--cell-radius',
            '--border-light',
            '--font-family-title',
            '--font-family-letters'
        ];

        const cssText = variables
            .map(variable => `${variable}:${styles.getPropertyValue(variable)}`)
            .join(';');

        document.body.removeChild(temp);
        return cssText;
    }

    async loadThemeVariables() {
        const themeStyles = new Map();

        try {
            const cssFiles = await this.listThemeFiles();

            for (const file of cssFiles) {
                const response = await fetch(file.fullPath);
                if (!response.ok) continue;

                const css = await response.text();

                const themeName = file.theme;
                const themeMatch = css.match(/:root\[data-theme=['"]([^'"]+)['"]\]\s*{([^}]+)}/);

                if (themeMatch) {
                    const variables = themeMatch[2];
                    const styles = this.extractRequiredVariables(variables);
                    themeStyles.set(themeName, styles);
                }
            }
        } catch {
            console.error('Error loading theme variables');
        }

        return themeStyles;
    }

    extractRequiredVariables(variables) {
        const requiredVars = [
            '--font-family-title',
            '--font-family-letters',
            '--color-bg',
            '--color-cell',
            '--color-text',
            '--color-selected',
            '--cell-radius',
            '--border-light',
            '--color-modal'
        ];

        return variables
            .match(/--[^:]+:[^;]+;/g)
            ?.filter(v =>
                requiredVars.some(required =>
                    v.startsWith(required + ':')
                )
            )
            ?.map(v => v.trim())
            ?.join(' ') || '';
    }

    setTheme(themeName) {
        console.log('ThemeSelector.setTheme:', themeName);
        let found = false;

        for (const [, themes] of this.availableThemes) {
            if (themes.has(themeName)) {
                found = true;
                break;
            }
        }

        const themeToApply = found ? themeName : this.getDefaultTheme();
        console.log('Aplicando tema:', themeToApply);

        document.documentElement.setAttribute('data-theme', themeToApply);
        Config.set(Config.KEYS.THEME, themeToApply);

        return found;
    }

    formatThemeName(name) {
        return this.themeDisplayNames.get(name.toLowerCase()) ||
            name.split(/[-_\s.]/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
    }

    bindEvents(themeGrid) {
        console.log('Inicializando eventos de tema');

        themeGrid.addEventListener('click', event => {
            const themeButton = event.target.closest('.theme-option');
            if (!themeButton) return;

            const newTheme = themeButton.dataset.theme;
            console.log('Click en tema:', newTheme);

            // Disparar un evento personalizado para el cambio de tema
            const themeChanged = this.setTheme(newTheme);
            console.log('Tema cambiado:', themeChanged);

            if (themeChanged) {
                themeGrid.querySelectorAll('.theme-option').forEach(btn => {
                    btn.classList.toggle('active', btn === themeButton);
                });

                // Disparar evento personalizado
                window.dispatchEvent(new CustomEvent('themechange', {
                    detail: { theme: newTheme }
                }));
            }
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

    async preloadDefaultTheme() {
        try {
            const defaultTheme = await Config.get(Config.KEYS.THEME) || 'dark';
            const defaultThemeData = this.findThemeData(defaultTheme);
            const themePath = `styles/${defaultThemeData.category.path}/${defaultThemeData.theme.file}`;

            const existingLink = document.querySelector(`link[href="${themePath}"]`);
            if (existingLink) {
                return new Promise((resolve) => {
                    if (existingLink.loaded || existingLink.getAttribute('rel') === 'stylesheet') {
                        resolve();
                    } else {
                        existingLink.onload = () => resolve();
                        existingLink.onerror = () => resolve();
                    }
                });
            }

            return this.loadStylesheet(themePath).catch(() =>
                this.loadStylesheet('styles/basic/dark.css')
            );
        } catch {
            return this.loadStylesheet('styles/basic/dark.css');
        }
    }
}
