export default class Sidebar {
    constructor({onNavigate}) {
        this.onNavigate = onNavigate;
        this.el = this.createSidebar();
    }

    createSidebar() {
        const el = document.createElement('div');
        el.id = 'sidebar';
        el.innerHTML = `
                <h2><a href="#" data-navigo>CRE</a></h2>
                <ul>
                <li><a href="#me" data-navigo>Me</a></li>
                <li><a href="#friends" data-navigo>Friends</a></li>
                <li><a href="#network" data-navigo>Network</a></li>
                <li><a href="#notifications" data-navigo>Notifications</a></li>
                <li><a href="#database" data-navigo>Database</a></li>
                </ul>
                `;
        el.appendChild(this.createDarkModeToggle());
        el.addEventListener('click', ({target}) =>
            target.tagName === 'A' && target.dataset.navigo !== undefined && this.onNavigate?.(target.getAttribute('href'))
        );
        return el;
    }

    createDarkModeToggle() {
        const btn = document.createElement('button');
        btn.id = 'dark-mode-toggle';
        btn.textContent = 'Toggle Dark Mode';
        btn.style.marginTop = '1rem';
        btn.addEventListener('click', () => document.body.classList.toggle('dark'));
        return btn;
    }
}
        