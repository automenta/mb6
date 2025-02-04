import NObjectThumbnail from './NObjectThumbnail.js';
import DB from '../core/DB.js';

export default class NObjectList {
    constructor(objects, emitter) {
        this.el = document.createElement('div');
        this.el.classList.add('nobject-list');
        this.db = DB;
        this.filter = () => true; // Default filter: include all
        this.sort = (a, b) => 0;   // Default sort: no sorting
        this.objects = objects;
        this.emitter = emitter;
        this.customRenderer = null; // Add customRenderer property

        this.refresh(); // Initial rendering

        this.emitter.on('objectUpdated', () => {
            this.refresh();
        });
    }

    async refresh() {
        this.objects = new Map(
            (await this.db.getObjects())
                .filter(this.filter)
                .sort(this.sort)
                .map(obj => [obj.id, obj]) // Assuming objects have an ID
        );
        this.render(this.customRenderer); // Pass customRenderer to render
    }

    createThumbnail(obj, customRenderer) {
        if (customRenderer) {
            return customRenderer(obj);
        } else {
            return new NObjectThumbnail(obj).el;
        }
    }


    render(customRenderer) {
        this.el.innerHTML = ''; // Clear previous content
        Array.from(this.objects.values()).map(obj => this.createThumbnail(obj, customRenderer))
            .forEach(thumbnail => this.el.appendChild(thumbnail));
    }
}