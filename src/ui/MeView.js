import View from './View.js';

export default class MeView extends View {
    constructor(objects, pluginManager, emitter) {
        super();
        this.el.id = 'me-view';
        this.el.textContent = 'Me View (Placeholder)';
    }

    render() {
        this.el.innerHTML = '';
        const placeholder = document.createElement('div');
        placeholder.innerText = 'Welcome to the Me Page!';
        this.el.appendChild(placeholder);
    }
}