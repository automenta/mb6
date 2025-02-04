import { v4 as uuidv4 } from 'uuid';
import NObject from '../core/NObject.js';

export default class Menu {
    constructor({onNavigate, objects, uiManager}) {
        this.onNavigate = onNavigate;
        this.objects = objects;
        this.uiManager = uiManager;
        const el = document.createElement('div');
        el.id = 'menu';
        el.innerHTML = `
            <button id="create-nobject">+</button>
            <button id="settings">Settings</button>
        `;
        el.appendChild(this.createDarkModeToggle());
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

    createDarkModeToggle() {
        const btn = document.createElement('button');
        btn.id = 'dark-mode-toggle';
        btn.textContent = 'Toggle Dark Mode';
        btn.addEventListener('click', () => document.body.classList.toggle('dark'));
        return btn;
    }
}