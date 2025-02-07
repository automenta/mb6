import View from './View.js';

export default class NetworkView extends View {
    constructor() {
        super();
        this.el.id = 'network-view';
        this.el.textContent = 'Network View (Placeholder)';
    }

    render() {
        this.el.innerHTML = '';
        const placeholder = document.createElement('div');
        placeholder.innerText = 'Welcome to the Network Page!';
        this.el.appendChild(placeholder);
    }
}
