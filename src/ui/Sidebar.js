import StatusView from './StatusView.js';
import Menu from './Menu.js';
import NObjectList from './NObjectList.js';
import NObjectThumbnail from './NObjectThumbnail.js';

export default class Sidebar {
    constructor({ onNavigate, objects, notifier, uiManager, emitter }) {
        this.onNavigate = onNavigate;
        this.uiManager = uiManager;
        this.objects = objects;
        this.emitter = emitter;
        this.menu = new Menu({ onNavigate: this.onNavigate, objects: this.objects, uiManager: this.uiManager });
        this.nObjectList = new NObjectList(this.objects, this.emitter);
        this.statusView = new StatusView(notifier);
        const el = document.createElement('div');
        el.id = 'sidebar';
        el.classList.add('sidebar');

        const menuContainer = el.appendChild(document.createElement('div'));
        menuContainer.classList.add('menu-container');
        menuContainer.appendChild(this.menu.el);

        const nObjectListContainer = el.appendChild(document.createElement('div'));
        nObjectListContainer.classList.add('nobject-list-container');
        nObjectListContainer.appendChild(this.nObjectList.el);

        const statusViewContainer = el.appendChild(document.createElement('div'));
        statusViewContainer.classList.add('status-view-container');
        statusViewContainer.appendChild(this.statusView.el);

        this.nObjectList.customRenderer = obj => {
            const thumbnail = new NObjectThumbnail(obj).el;
            thumbnail.addEventListener('click', () => this.onNavigate(`#editor/${obj.id}`));
            return thumbnail;
        };

        this.el = el;
    }
}