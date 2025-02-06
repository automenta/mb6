/**
 * View for displaying the main content.
 */
export class MainView {
    constructor() {
        this.el = document.createElement('div');
        this.el.id = 'main-view';
        this.contentContainer = document.createElement('div');
        this.contentContainer.id = 'content-container';
        this.el.appendChild(this.contentContainer);
    }

    /**
     * Sets the content view.
     * @param {object} view - The view to set as the content.
     * @param {object} obj - The object to display in the view.
     */
    setContentView = (view, obj) => {
        this.contentContainer.innerHTML = '';
        this.currentView = view;
        view.render(obj);
        this.contentContainer.appendChild(view.el);
    };
}