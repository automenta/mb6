import StatusView from './StatusView.js';
import { v4 as uuidv4 } from 'uuid';
import NObject from '../core/NObject.js';
import Menu from './Menu.js';
import NObjectList from './NObjectList.js';
import NObjectThumbnail from './NObjectThumbnail.js';


export default class Sidebar {
    constructor({onNavigate, objects, notifier, uiManager, emitter}) {
        this.objects = objects;
        this.onNavigate = onNavigate;
        this.uiManager = uiManager;
        this.menu = new Menu({onNavigate: this.onNavigate, objects: this.objects, uiManager: this.uiManager});
        this.nObjectList = new NObjectList(this.objects, emitter);
        this.statusView = new StatusView(notifier);
        const el = document.createElement('div');
        el.id = 'sidebar';
        el.classList.add('sidebar'); // Add sidebar class

        const menuContainer = document.createElement('div');
        menuContainer.classList.add('menu-container');
        menuContainer.appendChild(this.menu.el);
        el.appendChild(menuContainer);

        const nObjectListContainer = document.createElement('div');
        nObjectListContainer.classList.add('nobject-list-container');
        nObjectListContainer.appendChild(this.nObjectList.el);
        el.appendChild(nObjectListContainer);

        const statusViewContainer = document.createElement('div');
        statusViewContainer.classList.add('status-view-container');
        statusViewContainer.appendChild(this.statusView.el);
        el.appendChild(statusViewContainer);

        const customRenderer = (obj) => {
            const thumbnail = new NObjectThumbnail(obj).el;
            thumbnail.addEventListener('click', () => {
                console.log("Navigating to: #editor/" + obj.id);
                this.onNavigate(`#editor/${obj.id}`);
            });
            return thumbnail;
        };

        this.nObjectList.customRenderer = customRenderer; // Set the custom renderer


        this.el = el;
    }

}