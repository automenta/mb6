import NObjectThumbnail from './NObjectThumbnail.js';
import DB from '../core/DB.js';

export default class NObjectList {
    constructor(objects, emitter) {
        this.el = document.createElement('div');
        this.el.classList.add('nobject-list');
        this.db = DB;
        this.filter = () => true;
        this.sort = (a, b) => 0;
        this.objects = objects;
        this.emitter = emitter;
        this.customRenderer = null;

        this.refresh();

        this.emitter.on('objectUpdated', () => {
            this.refresh();
        });
    }

    refresh = async () => {
        this.objects = new Map((await this.db.getObjects()).filter(this.filter).sort(this.sort).map(obj => [obj.id, obj]));
        this.render(this.customRenderer);
    };

    createThumbnail = (obj, customRenderer) => customRenderer ? customRenderer(obj) : new NObjectThumbnail(obj).el;


    render = customRenderer => {
        this.el.innerHTML = '';
        Array.from(this.objects.values()).map(obj => this.createThumbnail(obj, customRenderer)).forEach(thumbnail => this.el.appendChild(thumbnail));

    };
}