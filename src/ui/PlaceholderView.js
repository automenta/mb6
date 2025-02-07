import View from './View.js';

export default class PlaceholderView extends View {
    constructor(message) {
        super();
        this.message = message;
        this.el.id = 'placeholder-view';
    }

    render() {
        this.el.innerHTML = '';
        const placeholder = document.createElement('div');
        placeholder.innerText = this.message;
        this.el.appendChild(placeholder);
    }
}