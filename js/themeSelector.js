export class ThemeSelector {
    constructor() {
        this.themesData = null;
        this.availableThemes = new Map();
        this.categoryOrder = [];
    }

    async initialize() {
        try {
            await this.loadThemesData();
            await this.loadThemeStylesheets();
            this.initializeUI();
            return this.availableThemes;
        } catch (error) {
            console.error('Error initializing theme selector:', error);
            throw error;
        }
    }

    getThemeId(themeFile) {
        return themeFile.replace('.css', '');
    }

    async loadThemesData() {
        try {
            const response = await fetch('styles/themes.json');
            if (!response.ok) throw new Error('No se pudo obtener la lista de temas');
            
            this.themesData = await response.json();
            this.categoryOrder = Object.values(this.themesData.categories).map(cat => cat.name);
            
            // Procesar las categorías y temas usando el nombre del archivo como ID
            Object.entries(this.themesData.categories).forEach(([categoryId, category]) => {
                this.availableThemes.set(category.name, new Set(
                    category.themes.map(theme => this.getThemeId(theme.file))
                ));
            });
        } catch (error) {
            console.error('Error loading themes data:', error);
            throw error;
        }
    }

    async loadThemeStylesheets() {
        if (!this.themesData) return;

        try {
            // Cargar todos los temas de forma asíncrona
            const promises = Object.values(this.themesData.categories).flatMap(category => 
                category.themes.map(theme => {
                    const path = `styles/${category.path}/${theme.file}`;
                    return this.loadStylesheet(path);
                })
            );

            await Promise.all(promises);

            // Aplicar el tema actual después de cargar todos
            const currentTheme = localStorage.getItem('theme') || this.getDefaultTheme();
            this.setTheme(currentTheme);
        } catch (error) {
            console.error('Error loading theme stylesheets:', error);
        }
    }

    findThemeData(themeId) {
        for (const category of Object.values(this.themesData.categories)) {
            const theme = category.themes.find(t => this.getThemeId(t.file) === themeId);
            if (theme) {
                return { category, theme };
            }
        }
        // Si no se encuentra, devolver el tema dark
        const basicCategory = this.themesData.categories.basic;
        return {
            category: basicCategory,
            theme: basicCategory.themes.find(t => this.getThemeId(t.file) === 'dark')
        };
    }

    loadStylesheet(path) {
        const existingLink = document.querySelector(`link[href="${path}"]`);
        if (existingLink) return Promise.resolve();

        return new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = path;
            link.onload = () => resolve();
            link.onerror = () => {
                console.warn(`⚠️ Error cargando tema: ${path}`);
                resolve();
            };
            document.head.appendChild(link);
        });
    }

    initializeUI() {
        const themeGrid = document.querySelector('.theme-grid');
        if (!themeGrid || !this.themesData) return;

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

        // Aplicar los estilos específicos a cada preview después de renderizar
        requestAnimationFrame(async () => {
            const previews = themeGrid.querySelectorAll('.preview-wrapper[data-theme]');
            for (const preview of previews) {
                const themeId = preview.getAttribute('data-theme');
                const themeData = this.findThemeData(themeId);
                if (themeData) {
                    const styleText = await this.getThemeStyles(themeData);
                    preview.setAttribute('style', styleText);
                }
            }
        });
    }

    async getThemeStyles(themeData) {
        const { category, theme } = themeData;
        const path = `styles/${category.path}/${theme.file}`;
        
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
            
            const css = await response.text();
            const styleMatch = css.match(/:root\[data-theme=['"]([^'"]+)['"]\]\s*{([^}]+)}/);
            
            if (!styleMatch) return '';
            
            // Primero procesar las variables internas (como --portal-blue)
            const variables = styleMatch[2];
            const internalVars = {};
            variables.match(/--[^:]+:[^;]+;/g)?.forEach(prop => {
                const [name, value] = prop.split(':').map(s => s.trim());
                if (name && !name.includes('color-')) {
                    internalVars[name] = value.replace(';', '');
                }
            });

            // Luego procesar las variables que necesitamos, resolviendo referencias
            const cssVars = {};
            variables.match(/--[^:]+:[^;]+;/g)?.forEach(prop => {
                const [name, value] = prop.split(':').map(s => s.trim());
                if (name) {
                    let resolvedValue = value.replace(';', '');
                    // Resolver referencias a variables internas
                    Object.entries(internalVars).forEach(([varName, varValue]) => {
                        resolvedValue = resolvedValue.replace(
                            `var(${varName})`,
                            varValue
                        );
                    });
                    cssVars[name] = resolvedValue;
                }
            });

            // Agregar variables específicas del preview
            cssVars['--preview-shadow'] = '0 2px 8px rgba(0, 0, 0, 0.15)';
            cssVars['--preview-border'] = '1px solid rgba(0, 0, 0, 0.1)';

            return Object.entries(cssVars)
                .map(([name, value]) => `${name}: ${value}`)
                .join(';');
                
        } catch (error) {
            console.warn(`Error cargando estilos para ${theme.name}:`, error);
            return '';
        }
    }

    createThemeButton(theme, isActive) {
        const themeId = this.getThemeId(theme.file);
        return `
            <button class="theme-option${isActive ? ' active' : ''}" 
                    data-theme="${themeId}">
                <div class="theme-preview">
                    <div class="preview-wrapper" data-theme="${themeId}">
                        <div class="preview-container">
                            <div class="preview-cell">
                                <div class="preview-mark"></div>
                                <div class="preview-text">A</div>
                            </div>
                            <div class="preview-title">${theme.name}</div>
                        </div>
                    </div>
                </div>
            </button>
        `;
    }

    getComputedThemeVariables(themeId) {
        // Crear un elemento temporal para obtener las variables computadas
        const temp = document.createElement('div');
        temp.style.display = 'none';
        temp.setAttribute('data-theme', themeId);
        document.body.appendChild(temp);

        // Obtener los valores computados
        const styles = getComputedStyle(temp);
        const variables = [
            '--color-bg',
            '--color-cell',
            '--color-text',
            '--color-selected',
            '--color-modal',
            '--cell-radius',
            '--border-light',
            '--font-family-title',
            '--font-family-content'
        ];

        const cssText = variables
            .map(variable => `${variable}:${styles.getPropertyValue(variable)}`)
            .join(';');

        document.body.removeChild(temp);
        return cssText;
    }

    getDefaultTheme() {
        // Buscar el tema marcado como default en el JSON
        for (const category of Object.values(this.themesData.categories)) {
            const defaultTheme = category.themes.find(theme => theme.isDefault);
            if (defaultTheme) {
                return this.getThemeId(defaultTheme.file);
            }
        }
        return 'dark'; // Fallback si no se encuentra ningún tema por defecto
    }

    async loadThemeVariables() {
        const themeStyles = new Map();
        
        try {
            const cssFiles = await this.listThemeFiles();
            
            for (const file of cssFiles) {
                const response = await fetch(file.fullPath);
                if (!response.ok) continue;
                
                const css = await response.text();
                
                // Extraer las variables del tema
                const themeName = file.theme;
                const themeMatch = css.match(/:root\[data-theme=['"]([^'"]+)['"]\]\s*{([^}]+)}/);
                
                if (themeMatch) {
                    const variables = themeMatch[2];
                    const styles = this.extractRequiredVariables(variables);
                    themeStyles.set(themeName, styles);
                }
            }
        } catch (error) {
            console.error('Error loading theme variables:', error);
        }
        
        return themeStyles;
    }

    extractRequiredVariables(variables) {
        const requiredVars = [
            '--font-family-title',
            '--font-family-content',
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
        let found = false;
        for (const [, themes] of this.availableThemes) {
            if (themes.has(themeName)) {
                found = true;
                break;
            }
        }

        if (found || themeName === this.getDefaultTheme()) {
            document.documentElement.setAttribute('data-theme', themeName);
            localStorage.setItem('theme', themeName);
            return true;
        }
        return false;
    }

    formatThemeName(name) {
        return this.themeDisplayNames.get(name.toLowerCase()) ||
            name.split(/[-_\s.]/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
    }

    bindEvents(themeGrid) {
        themeGrid.addEventListener('click', e => {
            const themeButton = e.target.closest('.theme-option');
            if (!themeButton) return;

            const newTheme = themeButton.dataset.theme;
            if (this.setTheme(newTheme)) {
                // Actualizar la clase active en todos los botones
                themeGrid.querySelectorAll('.theme-option').forEach(btn => {
                    btn.classList.toggle('active', btn === themeButton);
                });
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
}
