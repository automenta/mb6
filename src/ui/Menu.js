export default class Menu {
    constructor({onNavigate, objects, uiManager}) {
        this.onNavigate = onNavigate;
        this.objects = objects;
        this.uiManager = uiManager;
        const el = document.createElement('div');
        el.id = 'menu';
        el.className = 'menu'; // Add menu class
        el.innerHTML = `
            <button id="create-nobject" class="menu-button">+</button>
            <button id="settings" class="menu-button">Settings</button>
        `;
        const themeSwitcherContainer = this.createThemeSwitcher();
        themeSwitcherContainer.className = 'theme-switcher-container'; // Add class to theme switcher container
        el.appendChild(themeSwitcherContainer);

        el.addEventListener('click', ({target}) => {
            if (target.id === 'create-nobject') {
                const newNObject = this.uiManager.createNObject('Untitled', '', {}, []);
                this.onNavigate(`#editor/${newNObject.id}`);

            } else if (target.id === 'settings') {
                // Handle settings action
            }
        });
        this.el = el;
    }

    applyStylesheet(filename) {
        const themeFile = `src/ui/css/${filename}`;
        const linkElements = document.querySelectorAll('link[rel="stylesheet"][data-theme]');
        linkElements.forEach(link => link.remove());


        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.dataset.theme = true;
        document.head.appendChild(link);
        link.href = themeFile;

    }

    createThemeSwitcher() {
        const container = document.createElement('div');
        container.innerHTML = `
            <select id="theme-switcher" class="theme-switcher">
                <option value="styles-theme2.css">Theme 2</option>
                <option value="styles-theme1.css">Theme 1</option>
                <option value="styles-theme3.css">Theme 3</option>
            </select>
            <div class="dark-mode-toggle-container">  </div>
<input type="checkbox" id="dark-mode-toggle" class="dark-mode-toggle">
            <label for="dark-mode-toggle" class="dark-mode-label">Dark Mode</label>

        `;

        const themeSwitcher = container.querySelector('#theme-switcher');
        themeSwitcher.addEventListener('change', () => {
            // Apply the selected theme
            const selectedTheme = themeSwitcher.value;
            // Apply the selected theme
            this.applyStylesheet(selectedTheme);
        });

        const darkModeToggle = container.querySelector('#dark-mode-toggle');
        darkModeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark');
        });

        return container;
    }
}