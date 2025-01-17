export class ThemeSelector {
    constructor() {
        this.themesData = null;
        this.availableThemes = new Map();
        this.categoryOrder = [];
    }

    async applyInitialTheme() {
        const savedTheme = localStorage.getItem('theme') || this.getDefaultTheme();
        document.documentElement.setAttribute('data-theme', savedTheme);
        return this.preloadDefaultTheme();
    }

    async initialize() {
        await this.loadThemesData();
        await this.loadThemeStylesheets();
        this.initializeUI();
        return this.availableThemes;
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
            return;
        }

        try {
            const savedTheme = localStorage.getItem('theme');

            if (savedTheme) {
                const savedThemeData = this.findThemeData(savedTheme);
                const path = `styles/${savedThemeData.category.path}/${savedThemeData.theme.file}`;
                
                try {
                    const response = await fetch(path);
                    if (!response.ok) {
                        localStorage.removeItem('theme');
                    }
                } catch {  // Eliminar "_" como parámetro
                    localStorage.removeItem('theme');
                }
            }

            const defaultTheme = this.getDefaultTheme();
            const defaultThemeData = this.findThemeData(defaultTheme);

            if (defaultThemeData) {
                const defaultPath = `styles/${defaultThemeData.category.path}/${defaultThemeData.theme.file}`;
                await this.loadStylesheet(defaultPath).catch(error => {
                    console.error('Error loading default theme stylesheet:', error);
                });
            }

            const promises = Object.values(this.themesData.categories).flatMap(category => 
                category.themes
                    .filter(theme => this.getThemeId(theme.file) !== defaultTheme)
                    .map(theme => {
                        const path = `styles/${category.path}/${theme.file}`;
                        return this.loadStylesheet(path).catch(error => {
                            console.error(`Error loading stylesheet ${path}:`, error);
                        });
                    })
            );

            await Promise.allSettled(promises);

        } catch (error) {
            console.error('Error loading theme stylesheets:', error);
        } finally {
            const themeToApply = localStorage.getItem('theme') || this.getDefaultTheme();
            this.setTheme(themeToApply);
            
            document.body.classList.remove('js-loading');
            document.querySelector('.js-loading-overlay')?.classList.add('hidden');
        }
    }

    findThemeData(themeId) {
        for (const category of Object.values(this.themesData.categories)) {
            const theme = category.themes.find(t => this.getThemeId(t.file) === themeId);
            if (theme) {
                return { category, theme };
            }
        }
        
        for (const category of Object.values(this.themesData.categories)) {
            const defaultTheme = category.themes.find(t => t.isDefault);
            if (defaultTheme) {
                return { category, theme: defaultTheme };
            }
        }
        
        throw new Error('No se encontró el tema ni un tema por defecto');
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
                
        } catch {
            // Remover parámetro error no utilizado
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
            '--color-text',
            '--color-title',
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

        const themeToApply = found ? themeName : this.getDefaultTheme();
        document.documentElement.setAttribute('data-theme', themeToApply);
        localStorage.setItem('theme', themeToApply);
        return found;
    }

    formatThemeName(name) {
        return this.themeDisplayNames.get(name.toLowerCase()) ||
            name.split(/[-_\s.]/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
    }

    bindEvents(themeGrid) {
        themeGrid.addEventListener('click', event => {  // Renombrar e a event
            const themeButton = event.target.closest('.theme-option');
            if (!themeButton) return;

            const newTheme = themeButton.dataset.theme;
            if (this.setTheme(newTheme)) {
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

    async preloadDefaultTheme() {
        try {
            const defaultTheme = localStorage.getItem('theme') || 'dark';
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
