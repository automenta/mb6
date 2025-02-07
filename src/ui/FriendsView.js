import View from './View.js';

export default class FriendsView extends View {
    constructor() {
        super();
        this.el.id = 'friends-view';
        this.el.textContent = 'Friends View (Placeholder)';
    }

    render() {
        this.el.innerHTML = '';
        const placeholder = document.createElement('div');
        placeholder.innerText = 'Welcome to the Friends Page!';
        this.el.appendChild(placeholder);
    }
}