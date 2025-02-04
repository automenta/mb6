export class MainView {
    constructor() {
        this.el = document.createElement('div');
        this.el.id = 'main-view';
        this.contentContainer = document.createElement('div');
        this.contentContainer.id = 'content-container';
        this.el.appendChild(this.contentContainer);
    }

    setContentView = (view, obj) => {
        this.contentContainer.innerHTML = '';
        this.currentView = view;
        view.render(obj);
        this.contentContainer.appendChild(view.el);
    };

}