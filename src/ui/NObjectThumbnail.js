export default class NObjectThumbnail {
    constructor(obj) {
        this.el = document.createElement('div');
        this.el.classList.add('nobject-thumbnail');
        // Add thumbnail-specific rendering logic here, e.g., displaying an icon or preview
        this.el.textContent = obj.name; // Placeholder for now
    }
}