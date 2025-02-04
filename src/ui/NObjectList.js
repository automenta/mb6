import NObjectThumbnail from './NObjectThumbnail.js';

export default class NObjectList {
    constructor(objects) {
        this.el = document.createElement('div');
        this.el.classList.add('nobject-list');
        this.objects = objects;
        this.render();

    }

    render() {
        this.el.innerHTML = ''; // Clear previous content
        this.objects.map(obj => new NObjectThumbnail(obj).el)
            .forEach(thumbnail => this.el.appendChild(thumbnail));

    }
}