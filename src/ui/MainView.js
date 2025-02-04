export class MainView {
    constructor() {
        this.el = document.createElement('div');
        this.el.id = 'main-view';
        this.contentContainer = document.createElement('div');
        this.contentContainer.id = 'content-container';
        this.el.appendChild(this.contentContainer);
    }

    setContentView(view) {
        this.contentContainer.innerHTML = '';
        this.currentView = view;
        view.render();
        this.contentContainer.appendChild(view.el);
    }




}