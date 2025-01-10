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
            // Usar getDefaultTheme en lugar de localStorage
            const defaultTheme = localStorage.getItem('theme') || this.getDefaultTheme();
            const defaultThemeData = this.findThemeData(defaultTheme);
            
            if (defaultThemeData) {
                // Asegurarse de que el tema por defecto esté cargado primero
                await this.loadStylesheet(`styles/${defaultThemeData.category.path}/${defaultThemeData.theme.file}`);
            }

            // Luego cargar el resto de los temas
            const promises = Object.values(this.themesData.categories).flatMap(category => 
                category.themes
                    .filter(theme => this.getThemeId(theme.file) !== defaultTheme)
                    .map(theme => {
                        const path = `styles/${category.path}/${theme.file}`;
                        return this.loadStylesheet(path);
                    })
            );

            await Promise.all(promises);
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
                    const isActive = document.documentElement.getAttribute('data-theme') === this.getThemeId(theme.file);
                    html += this.createThemeButton(theme, isActive);
                });
            }
        });

        themeGrid.innerHTML = html;
        this.bindEvents(themeGrid);
    }

    createThemeButton(theme, isActive) {
        const themeId = this.getThemeId(theme.file);
        return `
            <button class="theme-option${isActive ? ' active' : ''}" 
                    data-theme="${themeId}">
                <div class="theme-preview">
                    <div class="preview-container" data-theme="${themeId}">
                        <div class="preview-cell">
                            <div class="preview-mark"></div>
                            <div class="preview-text">A</div>
                        </div>
                        <div class="preview-title">${theme.name}</div>
                    </div>
                </div>
            </button>
        `;
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
