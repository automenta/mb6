export default class NObjectThumbnail {
    constructor(obj) {
        const el = document.createElement('div');
        el.classList.add('nobject-thumbnail');
        el.textContent = obj.name;
        this.el = el;
    }
}