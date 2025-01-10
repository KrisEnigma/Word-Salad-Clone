export class ThemeSelector {
    constructor() {
        this.availableThemes = new Map();
        this.themeDisplayNames = new Map();
        this.categoryOrder = [];
    }

    async initialize() {
        try {
            await this.loadAvailableThemes();
            this.initializeUI();
            return this.availableThemes;
        } catch (error) {
            console.error('Error initializing theme selector:', error);
            throw error;
        }
    }

    async loadAvailableThemes() {
        try {
            const cssFiles = await this.listThemeFiles();
            if (!cssFiles?.length) {
                throw new Error('No se encontraron archivos de tema');
            }

            for (const cssFile of cssFiles) {
                const response = await fetch(`styles/themes/${cssFile}`);
                if (!response.ok) {
                    console.warn(`⚠️ No se pudo cargar ${cssFile}`);
                    continue;
                }
                const cssContent = await response.text();
                this.processThemeFile(cssContent);
            }
        } catch (error) {
            throw error;
        }
    }

    async listThemeFiles() {
        try {
            const response = await fetch('styles/themes/themes.json');
            if (!response.ok) throw new Error('No se pudo obtener la lista de temas');

            const data = await response.json();
            return data.themes;
        } catch (error) {
            console.error('Error listing theme files:', error);
            return ['basic.css', 'retro-games.css', 'modern-games.css'];
        }
    }

    processThemeFile(cssContent) {
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
            this.availableThemes.set(category, this.availableThemes.has(category)
                ? new Set([...this.availableThemes.get(category), ...themeSet])
                : themeSet
            );
        }
    }

    async loadThemeStylesheets() {
        try {
            const cssFiles = await this.listThemeFiles();
            if (!cssFiles?.length) {
                throw new Error('No se encontraron archivos de tema');
            }

            // Cargar cada archivo CSS
            await Promise.all(cssFiles.map(async file => {
                // Evitar cargar basic.css que ya debería estar cargado
                if (file === 'basic.css') return;

                const existingLink = document.querySelector(`link[href="styles/themes/${file}"]`);
                if (existingLink) return;

                return new Promise((resolve, reject) => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = `styles/themes/${file}`;
                    
                    link.onload = resolve;
                    link.onerror = () => {
                        console.warn(`⚠️ Error cargando tema: ${file}`);
                        resolve(); // Resolvemos igual para no bloquear
                    };
                    document.head.appendChild(link);
                });
            }));

        } catch (error) {
            console.error('Error loading theme stylesheets:', error);
            throw error;
        }
    }

    async initializeUI() {
        const themeGrid = document.querySelector('.theme-grid');
        if (!themeGrid) return;

        // Primero cargamos todos los estilos de los temas en un Map
        const themeStyles = await this.loadThemeVariables();
        
        let html = '';
        this.categoryOrder.forEach(category => {
            const themes = this.availableThemes.get(category);
            if (themes?.size > 0) {
                html += `<div class="theme-category">${category}</div>`;
                Array.from(themes).sort().forEach(theme => {
                    const isActive = document.documentElement.getAttribute('data-theme') === theme;
                    const style = themeStyles.get(theme) || '';
                    
                    html += `
                        <button class="theme-option${isActive ? ' active' : ''}" 
                                data-theme="${theme}">
                            <div class="theme-preview">
                                <div class="preview-container" data-theme="${theme}" style="${style}">
                                    <div class="preview-cell">
                                        <div class="preview-mark"></div>
                                        <div class="preview-text">A</div>
                                    </div>
                                    <div class="preview-title" style="font-family: var(--font-family-title);">
                                        ${this.formatThemeName(theme)}
                                    </div>
                                </div>
                            </div>
                        </button>
                    `;
                });
            }
        });

        themeGrid.innerHTML = html;
        this.bindEvents(themeGrid);
    }

    async loadThemeVariables() {
        const themeStyles = new Map();
        
        try {
            const cssFiles = await this.listThemeFiles();
            
            for (const file of cssFiles) {
                const response = await fetch(`styles/themes/${file}`);
                if (!response.ok) continue;
                
                const css = await response.text();
                const themeRegex = /Theme:\s*([^*]+?)\s*\*\/\s*:root\[data-theme=['"]([^'"]+)['"]\]\s*{([^}]+)}/g;
                
                let match;
                while ((match = themeRegex.exec(css)) !== null) {
                    const themeName = match[2];
                    const variables = match[3];
                    
                    // Extraer las variables CSS relevantes, incluyendo title-letter-spacing
                    const styles = variables
                        .match(/--[^:]+:[^;]+;/g)
                        ?.filter(v => 
                            v.includes('color-') || 
                            v.includes('font-family') || 
                            v.includes('cell-radius') ||
                            v.includes('border-') ||
                            v.includes('letter-spacing')
                        )
                        ?.map(v => v.trim())
                        ?.join(' ') || '';
                    
                    themeStyles.set(themeName, styles);
                }
            }
        } catch (error) {
            console.error('Error loading theme variables:', error);
        }
        
        return themeStyles;
    }

    setTheme(themeName) {
        let found = false;
        for (const [, themes] of this.availableThemes) {
            if (themes.has(themeName)) {
                found = true;
                break;
            }
        }

        if (found || themeName === 'dark') {
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
                themeGrid.querySelectorAll('.theme-option').forEach(btn =>
                    btn.classList.toggle('active', btn.dataset.theme === newTheme)
                );
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
