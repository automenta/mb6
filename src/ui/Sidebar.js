import StatusView from './StatusView.js';
import { v4 as uuidv4 } from 'uuid';
import NObject from '../core/NObject.js';
import Menu from './Menu.js';
import ViewSwitch from './ViewSwitch.js';
import NObjectList from './NObjectList.js';
import NObjectThumbnail from './NObjectThumbnail.js';


export default class Sidebar {
    constructor({onNavigate, objects, notifier, uiManager, emitter}) {
        this.objects = objects;
        this.onNavigate = onNavigate;
        this.uiManager = uiManager;
        this.menu = new Menu({onNavigate: this.onNavigate, objects: this.objects, uiManager: this.uiManager});
        this.viewSwitch = new ViewSwitch({onNavigate: this.onNavigate});
        this.nObjectList = new NObjectList(this.objects, emitter);
        this.statusView = new StatusView(notifier);
        const el = document.createElement('div');
        el.id = 'sidebar';
        el.appendChild(this.menu.el);
        el.appendChild(this.viewSwitch.el);

        const customRenderer = (obj) => {
            const thumbnail = new NObjectThumbnail(obj).el;
            thumbnail.addEventListener('click', () => {
                console.log("Navigating to: #editor/" + obj.id);
                this.onNavigate(`#editor/${obj.id}`);
            });
            return thumbnail;
        };

        this.nObjectList.customRenderer = customRenderer; // Set the custom renderer


        el.appendChild(this.nObjectList.el);
        el.appendChild(this.statusView.el);
        this.el = el;
    }

}