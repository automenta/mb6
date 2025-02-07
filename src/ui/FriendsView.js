/** View for displaying the "Friends" page. */
export default class FriendsView {
    constructor() {
        this.el = document.createElement('div');
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