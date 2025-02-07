/** View for displaying the "Network" page. */
export default class NetworkView {
    constructor() {
        this.el = document.createElement('div');
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
