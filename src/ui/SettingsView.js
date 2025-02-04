export default class SettingsView {
    constructor({applyStylesheet}) {
        this.applyStylesheet = applyStylesheet;
        const el = document.createElement('div');
        el.id = 'settings-view';
        el.innerHTML = `
            <select id="theme-switcher">
                <option value="styles-theme2.css">Theme 2</option>
                <option value="styles-theme1.css">Theme 1</option>
                <option value="styles-theme3.css">Theme 3</option>
            </select>
            <div>
                <input type="checkbox" id="dark-mode-toggle">
                <label for="dark-mode-toggle">Dark Mode</label>
            </div>

        `;

        const themeSwitcher = el.querySelector('#theme-switcher');
        themeSwitcher.addEventListener('change', () => {
            const selectedTheme = themeSwitcher.value;
            this.applyStylesheet(selectedTheme);
        });

        const darkModeToggle = el.querySelector('#dark-mode-toggle');
        darkModeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark');
        });

        this.el = el;
    }

    render() {
        return this.el;
    }
}