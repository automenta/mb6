class Menu {
    constructor({ onNavigate }) {
        this.onNavigate = onNavigate;
        const el = document.createElement('div');
        el.id = 'menu';
        el.innerHTML = `
            <button id="create-nobject">+</button>
            <button id="settings">Settings</button>
        `;
        el.addEventListener('click', ({ target }) => {
            if (target.id === 'create-nobject') {
                // Handle create NObject action
            } else if (target.id === 'settings') {
                // Handle settings action
            }
        });
        this.el = el;
    }
}

class ViewSwitch {
    constructor({ onNavigate }) {
        this.onNavigate = onNavigate;

        const el = document.createElement('div');
        el.id = 'view-switch';
        el.innerHTML = `
            <ul>
                <li><a href="#me" data-navigo>Me</a></li>
                <li><a href="#friends" data-navigo>Friends</a></li>
                <li><a href="#network" data-navigo>Network</a></li>
                <li><a href="#notifications" data-navigo>Notifications</a></li>
                <li><a href="#database" data-navigo>Database</a></li>
            </ul>
        `;
        el.addEventListener('click', ({ target }) => {
            if (target.tagName === 'A' && target.dataset.navigo) {
                this.onNavigate(target.getAttribute('href'));
            }
        });

        this.el = el;
    }
}


class NObjectList {
    constructor(objects) {
        this.objects = objects;

        const el = document.createElement('ul');
        el.id = 'object-list';

        this.el = el;
    }

    renderList() { }
}

export default class Sidebar {
    constructor({ onNavigate, objects, renderList }) {
        this.objects = objects;
        this.onNavigate = onNavigate;
        this.renderList = renderList;

        this.menu = new Menu({ onNavigate: this.onNavigate });
        this.viewSwitch = new ViewSwitch({ onNavigate: this.onNavigate });
        this.nObjectList = new NObjectList(this.objects);

        const el = document.createElement('div');
        el.id = 'sidebar';

        el.appendChild(this.menu.el);
        el.appendChild(this.viewSwitch.el);
        el.appendChild(this.nObjectList.el);
        el.appendChild(this.createDarkModeToggle());

        this.el = el;
    }

    renderList() {
        this.nObjectList.renderList();
    }

    createDarkModeToggle() {
        const btn = document.createElement('button');
        btn.id = 'dark-mode-toggle';
        btn.textContent = 'Toggle Dark Mode';
        btn.addEventListener('click', () => document.body.classList.toggle('dark'));
        return btn;
    }
}