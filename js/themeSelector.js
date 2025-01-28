import { Capacitor } from "./vendor/capacitor-core.js";
import { S as Storage } from './storage.js';

const scriptRel = /* @__PURE__ */ (function detectScriptRel() {
  const relList = typeof document !== "undefined" && document.createElement("link").relList;
  return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
})();const assetsURL = function(dep, importerUrl) { return new URL(dep, importerUrl).href };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (true && deps && deps.length > 0) {
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep, importerUrl);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        const isBaseRelative = !!importerUrl;
        if (isBaseRelative) {
          for (let i = links.length - 1; i >= 0; i--) {
            const link2 = links[i];
            if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
              return;
            }
          }
        } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};

class ThemeSelector {
    constructor() {
        this.themesData = null;
        this.availableThemes = new Map();
        this.categoryOrder = [];
        this.loadedStylesheets = new Set();
        this.loadedFonts = new Set();
        
        // Agregar lista de excepciones que deben tratarse como una palabra
        this.singleWordTerms = new Set([
            'pac-man',
            'game-over',
            'dark-souls',
            'elden-ring',
        ]);
    }

    async initialize() {
        try {
            await this.loadThemesData();
            // Usar el tema inicial o guardarlo en una variable temporal si se necesita
            await this.applyInitialTheme();
            this.initializeUI();
            this.removeLoadingState();
            return this.availableThemes;
        } catch (error) {
            console.error('Error en ThemeSelector:', error);
            this.removeLoadingState();
            throw error;
        }
    }

    async applyInitialTheme() {
        const defaultTheme = this.getDefaultTheme();
        const savedTheme = await Storage.get(Storage.KEYS.THEME);

        // Validar si el tema guardado existe y es válido
        let themeToApply = defaultTheme;
        if (savedTheme) {
            const themeExists = Object.values(this.themesData.categories).some(
                category => category.themes.some(
                    theme => this.getThemeId(theme.file) === savedTheme
                )
            );

            if (themeExists) {
                themeToApply = savedTheme;
            } else {
                console.log('Tema guardado no válido, usando tema por defecto:', defaultTheme);
                await Storage.set(Storage.KEYS.THEME, defaultTheme);
            }
        }

        document.documentElement.setAttribute('data-theme', themeToApply);
        await this.setTheme(themeToApply, true);
        return themeToApply;
    }

    removeLoadingState() {
        document.body.classList.remove('js-loading');
        document.querySelector('.js-loading-overlay')?.classList.add('hidden');
    }

    formatCategoryName(categoryId) {
        return categoryId.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    async loadThemesData() {
        try {
            const data = await __vitePreload(() => import('./themes.js'),true?[]:void 0,import.meta.url);
            this.processThemeData(data);
        } catch (error) {
            console.error('Error cargando temas:', error);
            this.setDefaultThemeData();
        }
    }

    processThemeData(data) {
        this.themesData = {
            categories: Object.fromEntries(
                Object.entries(data.default.categories).map(([id, category]) => [
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

    setDefaultThemeData() {
        this.themesData = {
            categories: {
                basic: {
                    name: 'Basic',
                    path: 'basic',
                    themes: [{ isDefault: true, file: "dark.css", name: "Dark" }]
                }
            }
        };
        this.categoryOrder = ['Basic'];
        this.availableThemes.set('Basic', new Set(['dark']));
    }

    getThemeId(themeFile) {
        return themeFile.replace('.css', '');
    }

    async loadThemeStylesheets() {
        if (!this.themesData) return;
        const defaultTheme = this.getDefaultTheme();
        const themeToApply = localStorage.getItem('theme') || defaultTheme;
        await this.setTheme(themeToApply);
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
        if (!this.themesData?.categories) {
            return 'dark';
        }

        for (const category of Object.values(this.themesData.categories)) {
            const defaultTheme = category.themes.find(theme => theme.isDefault);
            if (defaultTheme) {
                return this.getThemeId(defaultTheme.file);
            }
        }

        // Si no hay tema por defecto, usar el primer tema de la primera categoría
        const firstCategory = Object.values(this.themesData.categories)[0];
        if (firstCategory?.themes?.length > 0) {
            return this.getThemeId(firstCategory.themes[0].file);
        }

        return 'dark';
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

                    const title = preview.querySelector('.preview-title');
                    if (title) {
                        this.fitPreviewTitle(title);
                    }
                }
            }
        });
    }

    fitPreviewTitle(titleElement) {
        const container = titleElement.parentElement;
        const maxWidth = container.clientWidth - 16;
        const maxHeight = container.clientHeight * 0.4; // 40% del contenedor para el título
        const text = titleElement.textContent.toLowerCase();

        // Verificar si el texto completo está en la lista de excepciones
        const isSingleWordTerm = this.singleWordTerms.has(text) ||
            Array.from(this.singleWordTerms).some(term => 
                text.includes(term)
            );

        // Resetear estilos y clases
        titleElement.style = '';
        titleElement.classList.remove('no-break');

        // Añadir clase no-break si es un término especial
        if (isSingleWordTerm) {
            titleElement.classList.add('no-break');
        }

        // Medición inicial
        const textWidth = titleElement.scrollWidth;
        const textHeight = titleElement.scrollHeight;
        const containerArea = maxWidth * maxHeight;
        const textArea = textWidth * textHeight;

        // Si el texto es pequeño y hay espacio, intentar agrandar
        if (textArea < containerArea * 0.5) { // Si usa menos del 50% del área disponible
            let size = parseFloat(getComputedStyle(titleElement).fontSize);
            const maxSize = 16; // Tamaño máximo permitido
            const growthFactor = 1.1; // Aumentar 10% en cada iteración

            while (size < maxSize) {
                const newSize = size * growthFactor;
                titleElement.style.fontSize = `${newSize}px`;

                // Verificar si aún cabe
                if (titleElement.scrollWidth > maxWidth || 
                    titleElement.scrollHeight > maxHeight) {
                    titleElement.style.fontSize = `${size}px`; // Volver al último tamaño válido
                    break;
                }
                size = newSize;
            }
        }
        // Si es demasiado grande, reducir
        else if (textWidth > maxWidth) {
            const scale = maxWidth / textWidth;
            const minSize = 10;
            const scaleFactor = 0.85;
            const currentSize = parseFloat(getComputedStyle(titleElement).fontSize);
            const newSize = Math.max(minSize, currentSize * scale * scaleFactor);
            titleElement.style.fontSize = `${newSize}px`;
        }
    }

    async getThemeStyles(themeData) {
        if (!themeData || !themeData.category || !themeData.theme) {
            return '';
        }

        const { category, theme } = themeData;
        const path = `./styles/themes/${category.path}/${theme.file}`;

        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`No se pudo cargar ${path}`);

            const css = await response.text();

            const fontUrls = css.match(/@import url\(['"]([^'"]+)['"]\)/g) || [];
            await Promise.all(
                fontUrls.map(importRule => {
                    const url = importRule.match(/\(['"]([^'"]+)['"]\)/)[1];
                    return this.loadWebFont(url);
                })
            );

            const styleMatch = css.match(/:root\[data-theme=['"]([^'"]+)['"]\]\s*{([^}]+)}/);
            if (!styleMatch) {
                return '';
            }

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

            const styleText = Object.entries(cssVars)
                .map(([name, value]) => `${name}: ${value}`)
                .join(';');

            return styleText;

        } catch {
            return this.getDefaultStyles();
        }
    }

    async loadWebFont(url) {
        if (this.loadedFonts.has(url)) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = () => {
                this.loadedFonts.add(url);
                resolve();
            };
            link.onerror = () => {
                resolve();
            };
            document.head.appendChild(link);
        });
    }

    getDefaultStyles() {
        return `
            --color-bg: #1a1a1a;
            --color-cell: #2a2a2a;
            --color-text: #ffffff;
            --color-title: #ffffff;
            --color-selected: #4a4a4a;
            --color-letters: #ffffff;
            --cell-radius: 8px;
            --border-light: 1px solid rgba(255, 255, 255, 0.1);
            --font-family-title: sans-serif;
            --preview-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            --preview-border: 1px solid rgba(0, 0, 0, 0.1)
        `;
    }

    createThemeButton(theme, isActive) {
        const themeId = this.getThemeId(theme.file);
        const text = theme.name.toLowerCase();
        const shouldNotBreak = this.singleWordTerms.has(text) ||
            Array.from(this.singleWordTerms).some(term => text.includes(term));
        
        return `
            <button class="theme-option${isActive ? ' active' : ''}" 
                    data-theme="${themeId}">
                <div class="preview-wrapper" data-theme="${themeId}">
                    <div class="preview-cell">
                        <div class="preview-mark"></div>
                        <div class="preview-text">A</div>
                    </div>
                    <div class="preview-title${shouldNotBreak ? ' no-break' : ''}">${theme.name}</div>
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
            return themeStyles;
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

    async loadStylesheet(path) {
        const existingLink = document.querySelector(`link[href="${path}"]`);
        if (existingLink) {
            this.loadedStylesheets.add(path);
            return Promise.resolve(existingLink);
        }

        return new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = path;

            const timeoutId = setTimeout(() => {
                this.loadedStylesheets.add(path);
                resolve(link);
            }, 2000);

            link.onload = () => {
                clearTimeout(timeoutId);
                this.loadedStylesheets.add(path);
                resolve(link);
            };

            link.onerror = () => {
                clearTimeout(timeoutId);
                this.loadedStylesheets.add(path);
                resolve(link);
            };

            document.head.appendChild(link);
        });
    }

    async setTheme(themeName, silent = false) {
        try {
            let themeExists = Object.values(this.themesData.categories).some(
                category => category.themes.some(
                    theme => this.getThemeId(theme.file) === themeName
                )
            );

            const themeToApply = themeExists ? themeName : this.getDefaultTheme();
            const themeData = this.findThemeData(themeToApply);

            if (themeData) {
                const path = `./styles/themes/${themeData.category.path}/${themeData.theme.file}`;
                document.body.classList.add('theme-transitioning');

                const newStylesheet = await this.loadStylesheet(path);
                await this.waitForStylesheet(newStylesheet);

                document.documentElement.setAttribute('data-theme', themeToApply);

                if (!silent && themeName !== await Storage.get(Storage.KEYS.THEME)) {
                    await Storage.set(Storage.KEYS.THEME, themeToApply);
                }

                this.cleanupUnusedStyles(path);

                setTimeout(() => {
                    document.body.classList.remove('theme-transitioning', 'js-loading');
                    document.querySelector('.js-loading-overlay')?.classList.add('hidden');
                }, 50);

                return true;
            }

            return false;
        } catch (error) {
            console.error('Error al establecer tema:', error);
            this.removeLoadingState();
            return false;
        }
    }

    async waitForStylesheet(stylesheet) {
        if (!stylesheet.sheet) {
            await new Promise(resolve => {
                const checkSheet = () => {
                    if (stylesheet.sheet) {
                        resolve();
                    } else {
                        requestAnimationFrame(checkSheet);
                    }
                };
                checkSheet();
            });
        }
    }

    cleanupUnusedStyles(currentPath) {
        const defaultPath = './styles/basic/dark.css';
        const baseStylesPath = './styles/styles.css';
        const links = document.querySelectorAll('link[rel="stylesheet"]');

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href &&
                href !== currentPath &&
                href !== defaultPath &&
                href !== baseStylesPath &&
                !this.loadedFonts.has(href)) {
                link.remove();
                this.loadedStylesheets.delete(href);
            }
        });
    }

    formatThemeName(name) {
        return this.themeDisplayNames.get(name.toLowerCase()) ||
            name.split(/[-_\s.]/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
    }

    bindEvents(themeGrid) {
        themeGrid.addEventListener('click', event => {
            const themeButton = event.target.closest('.theme-option');
            if (!themeButton) return;

            const newTheme = themeButton.dataset.theme;

            const themeChanged = this.setTheme(newTheme);

            if (themeChanged) {
                themeGrid.querySelectorAll('.theme-option').forEach(btn => {
                    btn.classList.toggle('active', btn === themeButton);
                });

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
            const defaultTheme = localStorage.getItem('theme') || 'dark';
            const defaultThemeData = this.findThemeData(defaultTheme);
            const themePath = `./styles/themes/${defaultThemeData.category.path}/${defaultThemeData.theme.file}`;

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
                this.loadStylesheet('./styles/themes/basic/dark.css')
            );
        } catch {
            return this.loadStylesheet('./styles/themes/basic/dark.css');
        }
    }
}

export { ThemeSelector as T, __vitePreload as _ };
