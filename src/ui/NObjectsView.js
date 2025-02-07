import ListView from './ListView.js';
import DB from '../core/DB.js';

export default class NObjectsView {
    constructor(objects) {
        this.el = document.createElement('div');
        this.objects = objects;
        this.listView = new ListView(this.objects);
        DB.subscribe(this.handleDatabaseEvent);
    }

    handleDatabaseEvent = ({ event, data }) => {
        switch (event) {
            case 'objectCreated':
                this.handleObjectCreated(data);
                break;
            case 'objectUpdated':
                this.handleObjectUpdated(data);
                break;
            case 'objectDeleted':
                this.handleObjectDeleted(data);
                break;
        }
    };

    handleObjectCreated = (obj) => {
        this.listView.addObject(obj);
    };

    handleObjectUpdated = (obj) => {
        this.listView.updateObject(obj);
    };

    handleObjectDeleted = (id) => {
        this.listView.deleteObject(id);
    };

    render = () => {
        this.el.innerHTML = '';
        this.el.appendChild(this.listView.el);

    };
}