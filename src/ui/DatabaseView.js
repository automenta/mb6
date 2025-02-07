export default class DatabaseView {
    constructor(objects, pluginManager) {
        this.el = document.createElement('div');
        this.objects = objects;
        this.pluginManager = pluginManager;
    }

    render() {
        this.el.innerHTML = '';

        const objectList = Array.from(this.objects.values());

        if (!objectList.length) {
            this.el.textContent = 'No objects in the database.';
            return;
        }

        const objectListElement = this.el.appendChild(document.createElement('ul'));
        objectList.map(obj => {
            const listItemElement = document.createElement('li');
            listItemElement.textContent = `Object ID: ${obj.id}, Name: ${obj.name}`;
            return listItemElement;
        }).forEach(listItemElement => objectListElement.appendChild(listItemElement));
    }
}